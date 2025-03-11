/**
 * API client for connecting to Anthropic's Claude API with Tools support
 */

/**
 * @typedef {Object} ClaudeMessage
 * @property {string} role - The role of the message sender
 * @property {{role: string, content: Array<
 *   {type: 'text', text: string}
 *   | {type: 'tool_use', id: string, name: string, input: string}
 *   | {type: 'tool_result', tool_use_id: string, content: (string | Array<import('./app.js').ContentBlock>), is_error?: boolean}
 * >}} content - The content of the message
 */

// API configuration
const API_CONFIG = {
  baseUrl: 'https://api.anthropic.com/v1/messages',
  model: 'claude-3-5-haiku-latest',
  // model: 'claude-3-7-sonnet-latest',
  // model: 'claude-3-5-sonnet-latest',
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
 * Send a message to Claude and get a streaming response
 * @param {Object} params
 * @param {import('./app.js').Message[]} params.messages - Messages to send to Claude
 * @param {string} params.systemPrompt - System prompt for the conversation
 * @param {import('./app.js').Tool[]} params.tools - List of available tools
 * @param {(event: import('./app.js').StreamingEvent) => void} params.onEvent - Callback for streaming events
 */
async function sendMessage({ messages, systemPrompt, tools, onEvent }) {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('API key not found. Please set your Anthropic API key.');
  }

  /**
   * @type {ClaudeMessage[]}
   */
  const claudeMessages = messages.map(message => {
    return {
      role: message.role === 'tool' ? 'user' : message.role,
      content: message.content.map(content => {
        switch (content.type) {
          case 'text':
            return {
              type: 'text',
              text: content.text
            }
          case 'tool':
            return {
              type: 'tool_use',
              id: content.id,
              name: content.name,
              input: content.input
            }
          case 'tool_result':
            return {
              type: 'tool_result',
              tool_use_id: content.tool_use_id,
              content: content.content,
              is_error: content.is_error
            }
        }
      })
    }
  });

  // Create abort controller to allow cancelling the request
  const controller = new AbortController();
  const signal = controller.signal;
  
  try {
    // Prepare request body
    const requestBody = {
      model: API_CONFIG.model,
      messages: claudeMessages,
      max_tokens: API_CONFIG.maxTokens,
      system: systemPrompt,
      tools,
      tool_choice: { type: "auto" },
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

    console.log("Starting streaming process...");
    
    // Process the stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    // Function to handle SSE events
    const processStream = async () => {
      const { done, value } = await reader.read();
      
      if (done) return;
      
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
                break;
                
              case 'content_block_start':
                switch (data.content_block.type) {
                  case 'tool_use':
                    onEvent({
                      type: 'tool_start',
                      index: data.index,
                      content: {
                        id: data.content_block.id,
                        name: data.content_block.name,
                      },
                    });
                    break;
                  case 'text':
                    onEvent({
                      type: 'text_start',
                      index: data.index,
                      content: { text: '' },
                    });
                    break;
                }
                break;
                
              case 'content_block_delta':
                switch (data.delta.type) {
                  case 'text_delta':
                    // Update text content
                    onEvent({
                      type: 'text_delta', 
                      index: data.index,
                      content: { text: data.delta.text },
                    });
                    break;
                    
                  case 'input_json_delta':
                    onEvent({
                      type: 'tool_delta',
                      index: data.index,
                      content: { input: data.delta.partial_json },
                    });
                    break;
                }
                break;
                
              case 'content_block_stop':
                onEvent({
                  type: 'content_block_stop',
                  index: data.index
                });
                break;
                
              case 'message_delta':
                // Update message with delta information
                if (data.delta.stop_reason) {
                  console.log('Message delta - Stop reason:', data.delta.stop_reason);
                }
                if (data.usage) {
                  console.log("Message delta - Usage:", data.usage);
                }
                break;

              case 'error':
                throw new Error(data.error.message);
            }
          }
        }
      } catch (e) {
        // Clean up the reader
        reader.cancel();
        throw e;
      }
      
      return processStream();
    };
    
    // Start processing the stream
    return processStream();
    
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

export { saveApiKey, getApiKey, sendMessage };