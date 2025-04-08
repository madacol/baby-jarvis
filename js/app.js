/**
 * Main application file for Baby Jarvis
 */

import { executeAction, getActions } from './actions.js';
import { 
  saveApiKey, 
  getApiKey, 
  sendMessage 
} from './ClaudeAPI.js';
import { initializeDirectoryHandle } from './directoryHandleStore.js';

// Global DOM element references with type annotations
const chatContainer = /** @type {HTMLDivElement} */ (document.getElementById('chat-container'));
const userInput = /** @type {HTMLTextAreaElement} */ (document.getElementById('user-input'));
const sendButton = /** @type {HTMLButtonElement} */ (document.getElementById('send-button'));
const apiKeyInput = /** @type {HTMLInputElement} */ (document.getElementById('api-key'));
const saveKeyButton = /** @type {HTMLButtonElement} */ (document.getElementById('save-key'));

// Add type definitions at top
/** 
 * Message history for context
 * @type {Message[]}
 */ 
let messageHistory = [];

const autoScroll = (() => {
  // Private variables within closure
  const threshold = 10;
  let shouldAutoScroll = true;

  // Attach scroll event listener
  document.addEventListener('scroll', () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    // If scrolled to the bottom, enable auto-scrolling
    shouldAutoScroll = (scrollHeight - scrollTop - clientHeight) < threshold;
  })

  return () => {
    if (shouldAutoScroll) {
      document.documentElement.scrollTop = document.documentElement.scrollHeight;
    }
  };
})();

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
  autoScroll();
  
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
  autoScroll();
  
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
  autoScroll();
  
  return toolElement;
}

/**
 * Update the tool with a result
 * @param {HTMLDivElement} toolElement 
 * @param {ActionResult} result 
 * @param {boolean} success 
 */
function updateToolWithResult(toolElement, result, success) {
  // Find the loading element
  const loadingElement = toolElement.querySelector('.tool-loading');

  
  // Replace with result
  if (loadingElement && success) {
    if (typeof result === 'string') {
      loadingElement.textContent = `Result: ${result}`;
    } else if (result instanceof HTMLElement) {
      loadingElement.innerHTML = '';
      loadingElement.appendChild(result);
    } else {
      loadingElement.textContent = `Result: ${JSON.stringify(result, null, 2)}`;
    }
    loadingElement.className = 'tool-result';
  } else if (loadingElement) {
      // Error case
      loadingElement.textContent = `Error: ${result || 'Unknown error'}`;
    loadingElement.className = 'tool-error';
  }
  
  autoScroll();
}

/**
 * Update the tool params display with new input
 * @param {HTMLDivElement} toolElement 
 * @param {string} input 
 */
function updateToolParams(toolElement, input) {
  const paramsElement = toolElement.querySelector('.tool-params');
  if (!paramsElement) {
    throw new Error('No params element found');
  }
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
  autoScroll();
}

// Define system prompt
const systemPrompt = `You are Baby Jarvis, a helpful AI assistant that can execute javascript code.
Use the \`runJavascript\` action for any new task.
All Javascript code runs in the browser and is typechecked using JSDoc.

When I ask you to demonstrate something, never create an action immediately. Instead:
1. First, use \`runJavascript\` to show the implementation
2. Only create an action if I explicitly say 'create an action for this' or 'make this an action'

IMPORTANT: 
When writing JavaScript code, you MUST always use arrow functions that receive a context parameter that has the following properties:
- context.log: A function to add messages to the UI for the user to see.
- context.db: A PGlite (Postgres in WASM) database instance, use \`db.sql\`...\`\` to execute queries. Each action can be configured to use either:
  - A shared ephemeral database that is cleared when the session ends (default)
  - A persistent isolated database that persists across browser refreshes
- context.directoryHandle: Access user's directory where you can read and write files.
- context.getActions: A function to get all actions that have been created.
And you can return a string, a JSON-serializable object, or an HTML element which will be rendered in the UI.

Example of correct code:
\`\`\`javascript
async ({log, db, directoryHandle, getActions}, params) => {
  log('Starting task...');
  const {rows: users} = await db.sql\`SELECT * FROM users WHERE id = \${params.userId}\`;
  const fileHandle = await directoryHandle.getFileHandle('users.txt', { create: true });
  const writer = await fileHandle.createWritable();
  await writer.write(users);
  return {
    users,
    actions: await getActions()
  }
}
\`\`\`

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
      actions: await getActions(),
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
      if (lastMessage.role !== 'assistant') {
        messageHistory.push({ role: 'assistant', content: [toolContent] });
      } else {
        lastMessage.content[event.index] = toolContent;
      }
      
      let parsedInput = {};
      if (toolContent.input_string) {
        try {
          parsedInput = JSON.parse(toolContent.input_string);
        } catch (e) {
          console.error('Error parsing input:', e);
          console.log({input_string: toolContent.input_string});
          updateToolWithResult(toolContent.element, e.message, false);
          AddToolToHistory(event.index, toolContent);
          messageHistory.push({ role: 'tool', content: [{ type: 'tool_result', tool_use_id: toolContent.id, content: e.message, is_error: true }] });
          break;
        }
      }
      toolContent.input = parsedInput;
      AddToolToHistory(event.index, toolContent);
      let shouldLLMInterpretResult = false;
      try {
        const {result, permissions} = await executeAction(toolContent.name, parsedInput);
        shouldLLMInterpretResult = !!permissions?.autoContinue;
        updateToolWithResult(toolContent.element, result, true);
        const content = (result instanceof HTMLElement) ? `Rendered HTML:\n${result.outerHTML}` : JSON.stringify(result);
        messageHistory.push({ role: 'tool', content: [{ type: 'tool_result', tool_use_id: toolContent.id, content }] });
      } catch (e) {
        shouldLLMInterpretResult = true;
        console.error('Error executing action:', e);
        updateToolWithResult(toolContent.element, e.message, false);
        messageHistory.push({ role: 'tool', content: [{ type: 'tool_result', tool_use_id: toolContent.id, content: e.message, is_error: true }] });
      }
      if (shouldLLMInterpretResult) {
        sendMessage({
          messages: messageHistory,
          systemPrompt,
          actions: await getActions(),
          onEvent: handleStreamEvent
        });
      }
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


/** @type {HTMLAnchorElement} */
(document.getElementById('change-directory')).addEventListener('click', async (event) => {
  event.preventDefault();
  await initializeDirectoryHandle(true);
});

// Check for API key
const apiKey = getApiKey();
if (apiKey) {
  apiKeyInput.value = '••••••••••••••••••••••••••••••••••••••••';
}

// Set up hamburger menu toggle
const hamburgerIcon = document.querySelector('.hamburger-icon');
const menuContent = document.querySelector('.menu-content');

if (hamburgerIcon && menuContent) {
  hamburgerIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    menuContent.classList.toggle('menu-active');
    hamburgerIcon.classList.toggle('hamburger-active');
  });
  
  // Close menu when clicking outside of it
  document.addEventListener('click', () => {
    if (menuContent.classList.contains('menu-active')) {
      menuContent.classList.remove('menu-active');
      hamburgerIcon.classList.remove('hamburger-active');
    }
  });
}

// Welcome message
addMessageToUI('Welcome to Baby Jarvis! I can help you with tasks by generating JavaScript and running it in your browser.', false);
