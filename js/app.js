/**
 * Main application file for Baby Jarvis
 */

import { 
  saveApiKey, 
  getApiKey, 
  sendMessage 
} from './api.js';
import { executeTool, runJs } from './runtime.js';

// Runtime imports moved back to api.js

// Global DOM element references with type annotations
const chatContainer = /** @type {HTMLDivElement} */ (document.getElementById('chat-container'));
const userInput = /** @type {HTMLInputElement} */ (document.getElementById('user-input'));
const sendButton = /** @type {HTMLButtonElement} */ (document.getElementById('send-button'));
const apiKeyInput = /** @type {HTMLInputElement} */ (document.getElementById('api-key'));
const saveKeyButton = /** @type {HTMLButtonElement} */ (document.getElementById('save-key'));

// Add type definitions at top
/** 
 * @typedef { { type: 'text', text: string, element?: HTMLDivElement } } TextContentBlock
 * @typedef { { type: 'tool', id: string, name: string, input_string: string, input?: {}, element?: HTMLDivElement } } ToolContentBlock
 * @typedef { { type: 'image', source: { type: 'base64', media_type: string, data: string } } } ImageContentBlock
 * @typedef { { type: 'tool_result', tool_use_id: string, content: (string | Array<ContentBlock>), is_error?: boolean } } ToolResultContentBlock
 * @typedef { TextContentBlock | ToolContentBlock | ImageContentBlock | ToolResultContentBlock } ContentBlock
 * @typedef { { type: 'text_start', index: number, content: { text: string } }
 *  | { type: 'text_delta', index: number, content: { text: string } }
 *  | { type: 'text_stop', index: number }
 *  | { type: 'tool_start', index: number, content: { id: string, name: string } }
 *  | { type: 'tool_delta', index: number, content: { input: string } }
 *  | { type: 'tool_stop', index: number }
 *  | { type: 'content_block_stop', index: number }
 * } StreamingEvent
 * 
 * @typedef { {role: string, content: Array<ContentBlock>} } Message
 * 
 * @typedef { {name: string, description: string, input_schema: Object} } Tool
 */

/** 
 * Message history for context
 * @type {Message[]}
 */ 
let messageHistory = [];

// Add a message to the UI
function addMessageToUI(message, isUser, messageClasses = []) {
  const messageElement = document.createElement('div');
  messageElement.className = isUser ? 'user-message' : 'ai-message';
  messageClasses.forEach(className => {
    messageElement.classList.add(className);
  });
  
  // Simple text message
  if (typeof message === 'string') {
    messageElement.textContent = message;
  } 
  // Message with content array (Anthropic format)
  else if (message.content && Array.isArray(message.content)) {
    message.content.forEach(block => {
      if (block.type === 'text') {
        const textElement = document.createElement('div');
        textElement.textContent = block.text;
        messageElement.appendChild(textElement);
      }
    });
  }
  
  chatContainer.appendChild(messageElement);
  
  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  return messageElement;
}

// Update a text block in an existing message element
function updateTextBlock(messageElement, text, blockIndex) {
  // Get or create the text block element
  let textBlockElement;
  
  if (blockIndex < messageElement.childElementCount) {
    textBlockElement = messageElement.children[blockIndex];
  } else {
    textBlockElement = document.createElement('div');
    messageElement.appendChild(textBlockElement);
  }
  
  // Update the text content
  textBlockElement.textContent = text;
  
  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  return textBlockElement;
}

/**
 * Add a tool use element to the UI
 * @param {{id: string, name: string}} toolUse 
 * @returns {HTMLDivElement}
 */
function addToolUseToUI(toolUse) {
  // Create tool use element
  const toolElement = document.createElement('div');
  toolElement.className = 'tool-use';
  toolElement.innerHTML = /*html*/`
    <div class="tool-header">Using tool: <span class="tool-name">${toolUse.name}</span></div>
    <div class="tool-params">Parameters: ...</div>
    <div class="tool-loading">Executing...</div>
  `;
  
  // Add to chat
  chatContainer.appendChild(toolElement);
  
  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  return toolElement;
}

// Update a tool element with results
function updateToolWithResult(toolElement, result, success) {
  // Find the loading element
  const loadingElement = toolElement.querySelector('.tool-loading');
  
  // Replace with result
  if (loadingElement && success) {
    loadingElement.textContent = `Result: ${JSON.stringify(result, null, 2)}`;
    loadingElement.className = 'tool-result';
  } else if (loadingElement) {
      // Error case
      loadingElement.textContent = `Error: ${result || 'Unknown error'}`;
    loadingElement.className = 'tool-error';
  }
  
  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Update the tool params display with new input
function updateToolParams(toolElement, input) {
  const paramsElement = toolElement.querySelector('.tool-params');
  if (paramsElement) {
    try {
      // Try to parse and format the input JSON
      const formatted = JSON.stringify(JSON.parse(input), null, 2);
      paramsElement.textContent = `Parameters: ${formatted}`;
    } catch (e) {
      // If we can't parse it yet, show the raw input
      paramsElement.textContent = `Parameters: ${input}`;
    }
  }
}

// Define system prompt
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

This format is strictly required for all JavaScript code execution.`; // Your existing system prompt

/**
 * List of tools available to the assistant
 * @type {Tool[]}
 */
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
  // {
  //   name: "createTool",
  //   description: "Create a new JavaScript tool that can be used later. Only use this when explicitly asked to create a tool.",
  //   input_schema: {
  //     type: "object",
  //     properties: {
  //       name: {
  //         type: "string",
  //         description: "The name of the tool to create. Should be camelCase."
  //       },
  //       description: {
  //         type: "string",
  //         description: "A description of what the tool does and when to use it."
  //       },
  //       functionCode: {
  //         type: "string",
  //         description: "The JavaScript function code for this tool. Must be an arrow function. Example: '(param1, param2) => { return param1 + param2; }'"
  //       }
  //     },
  //     required: ["name", "description", "functionCode"]
  //   }
  // },
  // {
  //   name: "listTools",
  //   description: "List all available tools that have been created.",
  //   input_schema: {
  //     type: "object",
  //     properties: {},
  //     required: []
  //   }
  // }
];

/**
 * Send a message to the AI
 * @param {string} message
 */
async function sendMessageToAI(message) {
  try {
    // Add user message to UI and history
    addMessageToUI(message, true);
    messageHistory.push({ role: 'user', content: [{ type: 'text', text: message }] });

    // Make API call with new interface
    await sendMessage({
      messages: messageHistory,
      systemPrompt,
      tools,
      onEvent: handleStreamEvent
    });

    // History management remains similar
    if (messageHistory.length > 20) {
      messageHistory = messageHistory.slice(messageHistory.length - 20);
    }
    
    console.log("Updated message history:", messageHistory);
  } catch (error) {
    console.error('Error sending message:', error);
    addMessageToUI(`Error: ${error.message}`, false, ['error']);
  }
}

// Add accumulation buffer
/** 
 * @type {Map<number, ContentBlock>}
 */
const content_blocks = new Map();

/**
 * Handle streaming events from API
 * @param {StreamingEvent} event 
 */
async function handleStreamEvent(event) {
  console.log('Handling stream event:', event);
  switch (event.type) {
    case 'text_start': {
      const element = addMessageToUI('', false);
      content_blocks.set(event.index, {
        type: 'text',
        text: '',
        element
      });
      break;
    }
    case 'text_delta': {
      const { index, content } = event;
      const content_block = /** @type {TextContentBlock} */ (content_blocks.get(index));
      // Accumulate text deltas
      content_block.text += content.text;
      updateTextBlock(content_block.element, content_block.text, index);
      break;
    }
    case 'text_stop': {
      const textBlock = /** @type {TextContentBlock} */ (content_blocks.get(event.index));
      AddTextBlockToHistory(event.index, textBlock);
      content_blocks.delete(event.index);
      break;
    }
    case 'tool_start': {
      const { index, content: { id, name } } = event;
      content_blocks.set(index, {
        type: 'tool',
        id,
        name,
        input_string: '',
        element: addToolUseToUI({id, name})
      });
      break;
    }
    case 'tool_delta': {
      const content_block = /** @type {ToolContentBlock} */ (content_blocks.get(event.index));
      content_block.input_string += event.content.input;
      updateToolParams(content_block.element, content_block.input_string);
      break;
    }
    case 'tool_stop': {
      // Final tool use with parsed input
      const toolContent = /** @type {ToolContentBlock} */ (content_blocks.get(event.index));
      content_blocks.delete(event.index);

      const lastMessage = messageHistory.at(-1);
      lastMessage.content[event.index] = toolContent;
      
      let parsedInput;
      try {
        parsedInput = JSON.parse(toolContent.input_string);
      } catch (e) {
        updateToolWithResult(toolContent.element, e.message, false);
        AddToolToHistory(event.index, toolContent);
        messageHistory.push({ role: 'tool', content: [{ type: 'tool_result', tool_use_id: toolContent.id, content: e.message, is_error: true }] });
        break;
      }
      toolContent.input = parsedInput;
      AddToolToHistory(event.index, toolContent);
      try {
        const result = await runJs(parsedInput.code);
        updateToolWithResult(toolContent.element, result, true);
        messageHistory.push({ role: 'tool', content: [{ type: 'tool_result', tool_use_id: toolContent.id, content: JSON.stringify(result) }] });
      } catch (e) {
        updateToolWithResult(toolContent.element, e.message, false);
        messageHistory.push({ role: 'tool', content: [{ type: 'tool_result', tool_use_id: toolContent.id, content: e.message, is_error: true }] });
      }

      sendMessage({
        messages: messageHistory,
        systemPrompt,
        tools,
        onEvent: handleStreamEvent
      });
      break;
    }
    case 'content_block_stop': {
      const content_block = content_blocks.get(event.index);
      switch (content_block.type) {
        case 'text':
          await handleStreamEvent({
            type: 'text_stop',
            index: event.index,
          });
          break;
        case 'tool':
          await handleStreamEvent({
            type: 'tool_stop',
            index: event.index
          });
          break;
      }
      break;
    }
  }
}

/**
 * Add a text block to the message history
 * @param {number} index 
 * @param {TextContentBlock} textContent 
 */
function AddTextBlockToHistory(index, textContent) {
  const lastMessage = messageHistory.at(-1);
  if (!lastMessage || lastMessage.role !== 'assistant') {
    messageHistory.push({
      role: 'assistant',
      content: [textContent]
    });
  } else {
    const current_content = lastMessage.content[index];
    if (current_content?.type === 'text') {
      current_content.text = textContent.text;
    } else {
      console.error('Error: current_content is not a text block', {current_content, textContent});
    }
  }
}

/**
 * Add a tool use to the message history
 * @param {number} index 
 * @param {ToolContentBlock} toolContent 
 */
function AddToolToHistory(index, toolContent) {
  const lastMessage = messageHistory.at(-1);
  if (lastMessage?.role !== 'assistant') {
    messageHistory.push({ role: 'assistant', content: [toolContent] });
  } else {
    const current_content = lastMessage.content[index];
    if (current_content?.type === 'tool') {
      current_content.id = toolContent.id;
      current_content.name = toolContent.name;
      current_content.input = toolContent.input;
    } else {
      console.error('Error: current_content is not type tool', {current_content, toolContent});
    }
  }
}

// Update event listeners to use global references
saveKeyButton.addEventListener('click', () => {
  const apiKey = apiKeyInput.value.trim();
  
  if (apiKey) {
    saveApiKey(apiKey);
    alert('API key saved successfully!');
  } else {
    alert('Please enter a valid API key');
  }
});

sendButton.addEventListener('click', () => {
  const message = userInput.value.trim();
  
  if (message) {
    sendMessageToAI(message);
    userInput.value = '';
  }
});

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendButton.click();
  }
});

// Check for API key
const apiKey = getApiKey();
if (apiKey) {
  apiKeyInput.value = '••••••••••••••••••••••••••••••••••••••••';
}

// Welcome message
addMessageToUI('Welcome to Baby Jarvis! I can help you with tasks by generating JavaScript and running it in your browser.', false);
