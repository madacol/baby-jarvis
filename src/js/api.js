/**
 * API client for connecting to Anthropic's Claude API
 */

// API configuration
const API_CONFIG = {
  baseUrl: 'https://api.anthropic.com/v1/messages',
  model: 'claude-3-haiku-20240307',
  maxTokens: 4000
};

// Constants for code block detection
const CODE_BLOCK_START = '```run-js';
const CODE_BLOCK_END = '```';

/**
 * Store API key in localStorage
 * @param {string} apiKey - The API key to store
 * @returns {boolean} Success indicator
 */
function saveApiKey(apiKey) {
  localStorage.setItem('anthropic_api_key', apiKey);
  return true;
}

/**
 * Get API key from localStorage
 * @returns {string|null} The stored API key
 */
function getApiKey() {
  return localStorage.getItem('anthropic_api_key');
}

/**
 * Send a message to Claude and get a streaming response with code execution
 * @param {string} userMessage - The user's message to send
 * @param {Array} history - Previous messages for context
 * @param {Function} onToken - Callback for each token received
 * @param {Function} onCodeBlock - Callback when a complete code block is received
 * @param {Function} onCodeExecution - Callback after code execution
 * @returns {Promise<{response: string, controller: AbortController}>} - Claude's complete response and the controller
 */
async function sendMessage(userMessage, history = [], onToken, onCodeBlock, onCodeExecution) {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('API key not found. Please set your Anthropic API key.');
  }
  
  // Create abort controller to allow cancelling the request
  const controller = new AbortController();
  const signal = controller.signal;
  
  try {
    // Convert history to Anthropic's format
    const messages = [...history, { role: 'user', content: userMessage }];
    
    const systemPrompt = `You are an AI assistant with the ability to execute JavaScript code using \`\`\`run-js code blocks.
This allows you to help users by executing functions and tools.

Available Tools:
- createTool: Create a new tool, but ONLY when the user explicitly asks to create a tool
- listTools: List all available tools

Code Execution Rules:
1. ALL \`\`\`run-js code blocks MUST be written as arrow functions that receive a context parameter
2. Access all tools ONLY through context.getTool() - never access tools directly
3. Always handle errors appropriately

Example code block (CORRECT):

    \`\`\`run-js
    ({getTool, log}) => {
        return getTool('listTools')();
    }
    \`\`\`

Example code block (INCORRECT - never do this):

    \`\`\`run-js
    ({createTool}) => {
        return createTool('name', 'description', () => {});
    }
    \`\`\`

Important guidelines:
1. Only use \`\`\`run-js blocks when code execution is necessary
2. ONLY create tools when the user explicitly asks to create a tool
3. Always validate inputs before using them
4. Handle errors gracefully and inform the user if something goes wrong
5. Always access tools through context.getTool() - never access them directly
6. Always write code blocks as arrow functions
7. After a code block executes, refer to its results in your subsequent response`;

    // Prepare request body
    const requestBody = {
      model: API_CONFIG.model,
      messages: messages,
      max_tokens: API_CONFIG.maxTokens,
      system: systemPrompt,
      stream: true
    };
    
    // Send request to Anthropic API with streaming
    const response = await fetch(API_CONFIG.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }
    
    // Variables to track streaming state
    let fullResponse = '';
    let buffer = '';
    let pendingCodeBlock = null;
    let inCodeBlock = false;
    
    console.log("Starting streaming process...");
    
    // Process the stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    // Stream processing function
    async function processStream() {
      // Read from the stream
      const { done, value } = await reader.read();
      
      // If the stream is done, return the full response
      if (done) {
        console.log("Streaming complete. Full response:", fullResponse);
        return fullResponse;
      }
      
      // Decode the chunk
      const chunk = decoder.decode(value, { stream: true });
      
      try {
        // Parse the SSE data
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonData = line.slice(6); // Remove 'data: ' prefix
            
            if (jsonData === '[DONE]') {
              continue;
            }
            
            const data = JSON.parse(jsonData);
            
            // Check if there's content
            if (data.type === 'content_block_delta' && data.delta && data.delta.text) {
              const token = data.delta.text;
              console.log("Received token:", token);
              
              // Add to the full response
              fullResponse += token;
              
              // Add to the buffer for code block detection
              buffer += token;
              
              // Check for code block start
              if (!inCodeBlock && buffer.includes(CODE_BLOCK_START)) {
                inCodeBlock = true;
                pendingCodeBlock = CODE_BLOCK_START;
                
                // Remove the start marker from the buffer
                buffer = buffer.substring(buffer.indexOf(CODE_BLOCK_START) + CODE_BLOCK_START.length);
                console.log("Detected code block start");
              }
              
              // Check for code block end if we're in a code block
              if (inCodeBlock && buffer.includes(CODE_BLOCK_END)) {
                // Complete code block found
                const codeContent = buffer.substring(0, buffer.indexOf(CODE_BLOCK_END));
                pendingCodeBlock += codeContent + CODE_BLOCK_END;
                
                // Remove the code block from the buffer
                buffer = buffer.substring(buffer.indexOf(CODE_BLOCK_END) + CODE_BLOCK_END.length);
                
                // Extract the actual code (without the markers)
                const code = codeContent.trim();
                console.log("Complete code block detected:", code);
                
                // Notify about the code block
                if (onCodeBlock) {
                  onCodeBlock(code, pendingCodeBlock);
                }
                
                // Terminate this streaming response - we'll create a new one after execution
                // Close the reader to stop the stream
                reader.cancel();
                
                // Execute the code
                try {
                  const result = await runJs(code);
                  console.log("Code execution result:", result);
                  
                  // Call execution callback with the result
                  if (onCodeExecution) {
                    onCodeExecution({
                      success: true,
                      result,
                      code
                    });
                  }
                  
                  // Add result to message history for context
                  messages.push({
                    role: 'user',
                    content: `The code block executed successfully. Result: ${JSON.stringify(result, null, 2)}`
                  });
                  
                  // Return the current response - we need to start a new request to continue
                  return fullResponse;
                } catch (error) {
                  console.error("Code execution error:", error);
                  
                  // Call execution callback with error
                  if (onCodeExecution) {
                    onCodeExecution({
                      success: false,
                      error: error.message,
                      code
                    });
                  }
                  
                  // Add error to message history
                  messages.push({
                    role: 'user', 
                    content: `The code block execution failed with error: ${error.message}`
                  });
                  
                  // Return the current response - we need to start a new request to continue
                  return fullResponse;
                }
                
                // Reset code block tracking
                inCodeBlock = false;
                pendingCodeBlock = null;
              }
              
              // Call token callback if provided
              if (onToken) {
                onToken(token);
              }
            }
          }
        }
      } catch (e) {
        console.error('Error processing stream chunk:', e);
      }
      
      // Continue processing the stream
      return processStream();
    }
    
    // Start processing the stream
    return processStream();
    
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

/**
 * Run JavaScript code from string
 * @param {string} code - Code to execute
 * @returns {Promise<any>} - Execution result
 */
async function runJs(code) {
  // Import at runtime to avoid circular dependencies
  const runtime = await import('./runtime.js');
  return runtime.runJs(code);
}

export { saveApiKey, getApiKey, sendMessage };