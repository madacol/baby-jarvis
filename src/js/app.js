/**
 * Main application file for Baby Jarvis
 */

import { 
  saveApiKey, 
  getApiKey, 
  sendMessage 
} from './api.js';

// Message history for context
let messageHistory = [];

// Add a message to the UI
function addMessageToUI(message, isUser) {
  const chatContainer = document.getElementById('chat-container');
  const messageElement = document.createElement('div');
  messageElement.className = isUser ? 'user-message' : 'ai-message';
  
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
  const chatContainer = document.getElementById('chat-container');
  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  return textBlockElement;
}

// Add a tool use element to the UI
function addToolUseToUI(toolUse) {
  const chatContainer = document.getElementById('chat-container');
  
  // Display parameters for the tool
  
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
  if (loadingElement) {
    loadingElement.className = success ? 'tool-result' : 'tool-error';
    
    // Format the result appropriately
    let displayText = '';
    
    if (success) {
      // Special handling for runJavaScript results
      if (result && typeof result === 'object') {
        // Check if it has a result property (from our runJs function)
        if (result.result !== undefined) {
          // Show the result
          displayText = `Result: ${JSON.stringify(result.result, null, 2)}`;
        } else if (result.logs && Array.isArray(result.logs) && result.logs.length > 0) {
          // Show logs as primary output
          displayText = `Output:\n${result.logs.join('\n')}`;
          
          // Add result only if it's not undefined
          if (result.result !== undefined) {
            displayText += `\n\nReturn value: ${JSON.stringify(result.result, null, 2)}`;
          }
        } else {
          // Normal object result
          displayText = `Result: ${JSON.stringify(result, null, 2)}`;
        }
      } else {
        // Simple value
        displayText = `Result: ${result}`;
      }
    } else {
      // Error case
      displayText = `Error: ${result.error || 'Unknown error'}`;
    }
    
    loadingElement.textContent = displayText;
  }
  
  // Scroll to bottom
  const chatContainer = document.getElementById('chat-container');
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

// Send a message to the AI with streaming response
async function sendMessageToAI(message) {
  try {
    // Add user message to UI
    addMessageToUI(message, true);
    
    // Add to history
    messageHistory.push({
      role: 'user',
      content: message
    });
    
    // Create message element for AI response
    const chatContainer = document.getElementById('chat-container');
    const aiMessageElement = document.createElement('div');
    aiMessageElement.className = 'ai-message';
    chatContainer.appendChild(aiMessageElement);
    
    // Variables to track current state
    let currentToolElement = null;
    
    // Callbacks for streaming
    const onTextUpdate = (text, blockIndex) => {
      // Update the text in the AI message element
      updateTextBlock(aiMessageElement, text, blockIndex);
    };
    
    const onToolStart = (toolUse) => {
      console.log('Tool use started:', toolUse);
      
      // Create a tool use element
      currentToolElement = addToolUseToUI(toolUse);
    };
    
    const onToolUpdate = (update) => {
      console.log('Tool update:', update);
      
      if (!currentToolElement) return;

      // Handle input updates
      if (update.input !== undefined) {
        updateToolParams(currentToolElement, update.input);
      }
      
      // Handle results/errors
      if (update.success !== undefined) {
        updateToolWithResult(
          currentToolElement, 
          update.success ? update.result : { error: update.error },
          update.success
        );
        
        // Reset current tool element after completion
        currentToolElement = null;
      }
    };
    
    // Get streaming response from API
    const response = await sendMessage(
      message, 
      messageHistory, 
      onTextUpdate, 
      onToolStart, 
      onToolUpdate
    );
    
    console.log('Full response:', response);
    
    // Add complete response to history with careful handling of tool interactions
    if (response && response.role === 'assistant') {
      const assistantMessage = {
        role: 'assistant',
        content: response.content
      };
      
      // Check if this message has tool use
      const hasTool = response.content.some(block => block.type === 'tool_use');
      
      // If the last message is also from the assistant, replace it to avoid duplicate messages
      if (messageHistory.length > 0 && messageHistory[messageHistory.length - 1].role === 'assistant') {
        messageHistory[messageHistory.length - 1] = assistantMessage;
      } else {
        // Otherwise append the new message
        messageHistory.push(assistantMessage);
      }
      
      // If using a tool, we need a matching tool result
      if (hasTool) {
        // Find the tool use ID so we can process this properly in future messages
        const toolUseId = response.content.find(block => block.type === 'tool_use').id;
        console.log("Message contains tool_use with ID:", toolUseId);
      }
    }
    
    // Limit history length to avoid token limits
    if (messageHistory.length > 20) {
      messageHistory = messageHistory.slice(messageHistory.length - 20);
    }
    
    console.log("Updated message history:", messageHistory);
  } catch (error) {
    console.error('Error sending message:', error);
    addMessageToUI(`Error: ${error.message}`, false);
  }
}

// Save API key button
document.getElementById('save-key').addEventListener('click', () => {
  const apiKey = document.getElementById('api-key').value.trim();
  
  if (apiKey) {
    saveApiKey(apiKey);
    alert('API key saved successfully!');
  } else {
    alert('Please enter a valid API key');
  }
});

// Send message button
document.getElementById('send-button').addEventListener('click', () => {
  const userInput = document.getElementById('user-input');
  const message = userInput.value.trim();
  
  if (message) {
    sendMessageToAI(message);
    userInput.value = '';
  }
});

// Enter key to send message
document.getElementById('user-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    document.getElementById('send-button').click();
  }
});

// Check for API key
const apiKey = getApiKey();
if (apiKey) {
  document.getElementById('api-key').value = '••••••••••••••••••••••••••••••••••••••••';
}

// Welcome message
addMessageToUI('Welcome to Baby Jarvis! I can help you with tasks using JavaScript. I can create new tools on demand too. Try asking me to create a tool or use an existing one.', false);