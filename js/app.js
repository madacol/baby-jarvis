/**
 * Main application file for Baby Jarvis
 */

import { getActions } from './actions.js';
import { 
  saveApiKey, 
  getApiKey, 
  sendMessage 
} from './api.js';

// Global DOM element references with type annotations
const chatContainer = /** @type {HTMLDivElement} */ (document.getElementById('chat-container'));
const userInput = /** @type {HTMLInputElement} */ (document.getElementById('user-input'));
const sendButton = /** @type {HTMLButtonElement} */ (document.getElementById('send-button'));
const apiKeyInput = /** @type {HTMLInputElement} */ (document.getElementById('api-key'));
const saveKeyButton = /** @type {HTMLButtonElement} */ (document.getElementById('save-key'));

// Add type definitions at top
/** 
 * @typedef { { type: 'text', text: string, element?: HTMLDivElement } } TextContentBlock
 * @typedef { { type: 'tool', id: string, name: string, input_string: string, input?: {}, element: HTMLDivElement } } ToolContentBlock
 * @typedef { { type: 'image', source: { type: 'base64', media_type: string, data: string } } } ImageContentBlock
 * @typedef { { type: 'tool_result', tool_use_id: string, content: (string | ContentBlock[]), is_error?: boolean } } ToolResultContentBlock
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
 * @typedef { {role: string, content: ContentBlock[]} } Message
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
  else if (Array.isArray(message?.content)) {
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

/**
 * Update the tool params display with new input
 * @param {HTMLDivElement} toolElement 
 * @param {string} input 
 */
function updateToolParams(toolElement, input) {
  const paramsElement = toolElement.querySelector('.tool-params');
  if (paramsElement) {
    try {
      const params = JSON.parse(input);
      if (params.code) {
        paramsElement.textContent = params.code;
      } else {
        // Try to parse and format the input JSON
        paramsElement.textContent = JSON.stringify(params, null, 2);
      }
    } catch (e) {
      // If we can't parse it yet, show the raw input
      paramsElement.textContent = `Parameters: ${input}`;
    }
  }
}

// Get actions from the file system and use them as tools
/** @type {import('./actions.js').Action[]} */
let actions = [];
try {
  actions = await getActions();
} catch (error) {
  // Create a dialog to notify user and allow retry with user interaction
  const dialog = document.createElement('dialog');
  dialog.textContent = 'Please select your project directory to load actions';
  
  const selectBtn = document.createElement('button');
  selectBtn.textContent = 'Select Directory';
  selectBtn.onclick = async () => {
    dialog.close();
    try {
      actions = await getActions();
    } catch (err) {
      console.error('Failed to load actions:', err);
      dialog.showModal(); // Show again if failed
    }
  };
  
  dialog.appendChild(document.createElement('br'));
  dialog.appendChild(selectBtn);
  
  document.body.appendChild(dialog);
  
  // Show the dialog immediately
  dialog.showModal();
}

/**
 * Get an action by name
 * @param {string} actionName 
 * @returns {import('./actions.js').Action | undefined} The action object or undefined if not found
 */
function getAction(actionName) {
  return actions.find(action => action.name === actionName);
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
({getTool, log, createApp}) => {
  log('Starting task...');
  createApp( ... )
  return getTool('someFunction')('parameter');
}

This format is strictly required for all JavaScript code execution.`;

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
      actions,
      onEvent: handleStreamEvent
    });

    // TODO: Max history management
    
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
      if (!lastMessage) throw new Error('No last message found');
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
        const action = getAction(toolContent.name);
        if (!action) throw new Error(`Action ${toolContent.name} not found`);
        const result = await action.action_fn(parsedInput);
        updateToolWithResult(toolContent.element, result, true);
        messageHistory.push({ role: 'tool', content: [{ type: 'tool_result', tool_use_id: toolContent.id, content: JSON.stringify(result) }] });
      } catch (e) {
        updateToolWithResult(toolContent.element, e.message, false);
        messageHistory.push({ role: 'tool', content: [{ type: 'tool_result', tool_use_id: toolContent.id, content: e.message, is_error: true }] });
      }

      sendMessage({
        messages: messageHistory,
        systemPrompt,
        actions,
        onEvent: handleStreamEvent
      });
      break;
    }
    case 'content_block_stop': {
      const content_block = content_blocks.get(event.index);
      if (!content_block) throw new Error('No content block found');
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
