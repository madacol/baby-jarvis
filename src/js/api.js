/**
 * API client for connecting to Anthropic's Claude API with Tools support
 */

import { runJs, createTool, listTools, executeTool } from './runtime.js';

// API configuration
const API_CONFIG = {
  baseUrl: 'https://api.anthropic.com/v1/messages',
  model: 'claude-3-5-haiku-latest',
  maxTokens: 4000
};

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
 * Send a message to Claude and get a streaming response with tool execution
 * @param {string} userMessage - The user's message to send
 * @param {Array} history - Previous messages for context
 * @param {Function} onTextUpdate - Callback for text updates
 * @param {Function} onToolStart - Callback when a tool use is started
 * @param {Function} onToolUpdate - Callback to update tool input and results
 * @returns {Promise<object>} - Claude's complete response object
 */
async function sendMessage(userMessage, history = [], onTextUpdate, onToolStart, onToolUpdate) {
  // Create a shared reference to history for all closures to use
  const messageHistory = history;
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('API key not found. Please set your Anthropic API key.');
  }
  
  // Create abort controller to allow cancelling the request
  const controller = new AbortController();
  const signal = controller.signal;
  
  try {
    // Convert history to Anthropic's format
    const messages = [];
    let pendingToolUse = null;
    
    for (let i = 0; i < messageHistory.length; i++) {
      const msg = messageHistory[i];
      
      // If we have a pending tool_use and this isn't a tool_result, we need to skip
      // the pending tool_use message since it doesn't have a matching result
      if (pendingToolUse && (!msg.content || msg.content[0]?.type !== 'tool_result')) {
        pendingToolUse = null;
        continue;
      }
      
      if (msg.role === 'assistant' && Array.isArray(msg.content)) {
        // Check if this message contains a tool_use
        const toolUseBlock = msg.content.find(block => block.type === 'tool_use');
        if (toolUseBlock) {
          pendingToolUse = msg;
        }
      }
      
      if (msg.role === 'user' && Array.isArray(msg.content) && 
          msg.content[0]?.type === 'tool_result' && pendingToolUse) {
        // Add both the tool_use message and its result
        messages.push(pendingToolUse);
        messages.push(msg);
        pendingToolUse = null;
      } else if (!pendingToolUse) {
        // Add normal messages that aren't part of a tool interaction
        messages.push(msg);
      }
    }
    
    // If there's still a pending tool_use at the end, don't include it
    if (pendingToolUse) {
      pendingToolUse = null;
    }
    
    // Add the current user message
    messages.push({ role: 'user', content: userMessage });
    
    // Define the system prompt
    const systemPrompt = `You are Baby Jarvis, a helpful AI assistant that can use tools to accomplish tasks.
You can create and use JavaScript tools to help users solve problems.

IMPORTANT: 
1. When writing JavaScript code, you MUST always use arrow functions that receive a context parameter.
2. Access helper functions through the context parameter, such as:
   - context.getTool: Access other tools
   - context.log: Log messages 
   - context.sql: Execute database queries

Example of correct code:
({getTool, log}) => {
  log('Starting task...');
  return getTool('someFunction')('parameter');
}

This format is strictly required for all JavaScript code execution.`;
    
    // Define available tools
    const tools = [
      {
        name: "runJavaScript",
        description: "Execute arbitrary JavaScript code and return the result. Code must be an arrow function that receives a context object.",
        input_schema: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "The JavaScript code to execute. Must be an arrow function that accepts a context object with helpers like getTool, log, and sql. Example: '({getTool, log}) => { return getTool(\"echo\")(\"hello\"); }'"
            }
          },
          required: ["code"]
        }
      },
      {
        name: "createTool",
        description: "Create a new JavaScript tool that can be used later. Only use this when explicitly asked to create a tool.",
        input_schema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The name of the tool to create. Should be camelCase."
            },
            description: {
              type: "string",
              description: "A description of what the tool does and when to use it."
            },
            functionCode: {
              type: "string",
              description: "The JavaScript function code for this tool. Must be an arrow function. Example: '(param1, param2) => { return param1 + param2; }'"
            }
          },
          required: ["name", "description", "functionCode"]
        }
      },
      {
        name: "listTools",
        description: "List all available tools that have been created.",
        input_schema: {
          type: "object",
          properties: {},
          required: []
        }
      }
    ];
    
    // Prepare request body
    const requestBody = {
      model: API_CONFIG.model,
      messages: messages,
      max_tokens: API_CONFIG.maxTokens,
      system: systemPrompt,
      tools: tools,
      tool_choice: { type: "auto" },  // Changed from "any" to "auto" to allow text before tool use
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
      body: JSON.stringify(requestBody),
      signal: signal
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }
    
    // Variables to track state
    let currentMessage = { id: '', role: 'assistant', content: [], usage: { input_tokens: 0, output_tokens: 0 } };
    let currentToolUse = null;
    let currentTextBlock = null;
    let currentTextIndex = -1;
    let currentToolInput = "";  // For accumulating JSON fragments
    
    console.log("Starting streaming process...");
    
    // Process the stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    // Function to handle SSE events
    async function processStream() {
      // Read from the stream
      const { done, value } = await reader.read();
      
      // If the stream is done, return the full message
      if (done) {
        console.log("Streaming complete. Full message:", currentMessage);
        return currentMessage;
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
            console.log("SSE event:", data);
            
            // Handle event types
            switch (data.type) {
              case 'message_start':
                // Initialize the message
                currentMessage = data.message;
                break;
                
              case 'content_block_start':
                // Handle the start of a content block
                const block = data.content_block;
                
                if (block.type === 'text') {
                  // Initialize text block
                  currentTextIndex = data.index;
                  currentTextBlock = block.text || '';
                  currentMessage.content[currentTextIndex] = { type: 'text', text: currentTextBlock };
                } else if (block.type === 'tool_use') {
                  // Reset tool input accumulator
                  currentToolInput = '';
                  
                  // Initialize tool use block
                  currentToolUse = {
                    id: block.id,
                    name: block.name,
                    input: block.input || {}
                  };
                  
                  // Add to message content
                  currentMessage.content[data.index] = {
                    type: 'tool_use',
                    ...currentToolUse
                  };
                  
                  // Notify about tool start
                  if (onToolStart) {
                    onToolStart(currentToolUse);
                  }
                }
                break;
                
              case 'content_block_delta':
                // Handle deltas to content blocks
                if (data.delta.type === 'text_delta') {
                  // Update text content
                  currentTextBlock += data.delta.text;
                  
                  // Update in message
                  if (currentMessage.content[data.index]) {
                    currentMessage.content[data.index].text = currentTextBlock;
                  }
                  
                  // Call text update callback
                  if (onTextUpdate) {
                    onTextUpdate(currentTextBlock, data.index);
                  }
                } else if (data.delta.type === 'input_json_delta') {
                  // Tool input delta - accumulate the partial JSON
                  if (data.delta.partial_json !== undefined) {
                    currentToolInput += data.delta.partial_json;
                    if (onToolUpdate) {
                      onToolUpdate({
                        input: currentToolInput
                      });
                    }

                    try {
                      // Try to parse the accumulated JSON
                      const parsedInput = JSON.parse(currentToolInput);
                      
                      // If successful, update the tool use input
                      if (currentMessage.content[data.index] && currentMessage.content[data.index].type === 'tool_use') {
                        currentMessage.content[data.index].input = parsedInput;
                        
                        // Update current tool use
                        if (currentToolUse) {
                          currentToolUse.input = parsedInput;
                        }
                      }
                    } catch (error) {
                      // Ignore parsing errors until we have the complete JSON
                      // This is expected since we're receiving partial JSON fragments
                    }
                  }
                }
                break;
                
              case 'content_block_stop':
                // Handle the end of a content block
                // Reset tool input accumulator if this was a tool_use block
                if (currentMessage.content[data.index] && currentMessage.content[data.index].type === 'tool_use') {
                  // Final chance to parse the JSON
                  try {
                    const parsedInput = JSON.parse(currentToolInput);
                    currentMessage.content[data.index].input = parsedInput;
                    if (currentToolUse) {
                      currentToolUse.input = parsedInput;
                    }
                  } catch (error) {
                    console.error('Error parsing tool input JSON:', error);
                  }
                  
                  // Reset the accumulator for next tool
                  currentToolInput = "";
                }
                
                // If this is a tool block that's complete, execute the tool
                if (currentToolUse && data.index === currentMessage.content.findIndex(c => c.type === 'tool_use')) {
                  try {
                    // Get the complete tool input
                    const toolInput = currentMessage.content[data.index].input;
                    
                    // Log the tool and input
                    console.log(`Executing tool ${currentToolUse.name} with input:`, toolInput);
                    
                    // Execute the tool based on name
                    let result;
                    if (currentToolUse.name === 'runJavaScript') {
                      result = await runJs(toolInput.code);
                    } else if (currentToolUse.name === 'createTool') {
                      // Make sure we're passing the function implementation correctly
                      let implementation;
                      try {
                        // Parse the function code as an arrow function
                        implementation = Function(`return ${toolInput.functionCode}`)();
                        if (typeof implementation !== 'function') {
                          throw new Error('Tool implementation must be a function');
                        }
                      } catch (error) {
                        throw new Error(`Invalid function code: ${error.message}`);
                      }
                      
                      result = await createTool(toolInput.name, toolInput.description, implementation);
                    } else if (currentToolUse.name === 'listTools') {
                      result = await listTools();
                    } else {
                      // Try to execute a custom tool
                      result = await executeTool(currentToolUse.name, toolInput);
                    }
                    
                    // Call tool update callback with success
                    if (onToolUpdate) {
                      onToolUpdate({
                        success: true,
                        result
                      });
                    }
                    
                    // Add tool result to the message history for context
                    const toolResultMessage = {
                      role: 'user',
                      content: [
                        {
                          type: 'tool_result',
                          tool_use_id: currentToolUse.id,
                          content: JSON.stringify(result)
                        }
                      ]
                    };
                    
                    // Don't modify the messageHistory here - we'll just return the results
                    // The app.js file will handle updating the message history appropriately
                    
                    // However, we need to add to the messages array for context within this API call
                    messages.push(toolResultMessage);
                    
                    // We need to continue processing the existing response
                    // Don't make additional API calls here - the streaming continues after tool execution
                    
                    // Instead, just process the tool result locally and let the stream continue
                    console.log("Tool execution complete, continuing with stream processing", result);
                    
                    // Reset current tool use
                    currentToolUse = null;
                  } catch (error) {
                    console.error(`Error executing tool ${currentToolUse.name}:`, error);
                    
                    // Call tool update callback with error
                    if (onToolUpdate) {
                      onToolUpdate({
                        success: false,
                        error: error.message
                      });
                    }
                    
                    // Add error to message history
                    const errorToolResult = {
                      role: 'user',
                      content: [
                        {
                          type: 'tool_result',
                          tool_use_id: currentToolUse.id,
                          content: JSON.stringify({ error: error.message })
                        }
                      ]
                    };
                    
                    // Add to messages array for context in the current API call
                    messages.push(errorToolResult);
                    
                    // Also add to messageHistory for context in subsequent API calls
                    messageHistory.push(errorToolResult);
                    
                    // Reset current tool use
                    currentToolUse = null;
                  }
                }
                break;
                
              case 'message_delta':
                // Update message with delta information
                if (data.delta.stop_reason) {
                  currentMessage.stop_reason = data.delta.stop_reason;
                }
                if (data.delta.stop_sequence) {
                  currentMessage.stop_sequence = data.delta.stop_sequence;
                }
                if (data.usage) {
                  currentMessage.usage = data.usage;
                }
                break;
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

export { saveApiKey, getApiKey, sendMessage };