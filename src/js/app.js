/**
 * Main application file for Baby Jarvis
 */

import { 
  runJs, 
  parseLLMResponse, 
  executeCodeInResponse 
} from './runtime.js';

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
  
  // Process markdown-like formatting for code blocks
  let formattedMessage = message;
  
  // Format code blocks that are not run-js blocks
  formattedMessage = formattedMessage.replace(/```(?!run-js)([\s\S]*?)```/g, (match, code) => {
    return `<pre><code>${code}</code></pre>`;
  });
  
  // Highlight run-js blocks
  formattedMessage = formattedMessage.replace(/```run-js([\s\S]*?)```/g, (match, code) => {
    return `<pre class="run-js-block"><code>${code}</code></pre>`;
  });
  
  messageElement.innerHTML = formattedMessage;
  chatContainer.appendChild(messageElement);
  
  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Process the AI response including code execution
async function processAIResponse(response) {
  try {
    // Parse and execute code blocks
    const parsedResponse = parseLLMResponse(response);
    
    // If there are code blocks, execute them
    if (parsedResponse.codeBlocks.length > 0) {
      // First display the response without executed code
      addMessageToUI(response, false);
      
      // Execute each code block
      for (let i = 0; i < parsedResponse.codeBlocks.length; i++) {
        try {
          const codeBlock = parsedResponse.codeBlocks[i];
          console.log(`Executing code block ${i + 1}:`, codeBlock);
          
          // Execute the code
          const result = await runJs(codeBlock);
          console.log(`Code block ${i + 1} result:`, result);
          
          // Display the result
          const resultElement = document.createElement('div');
          resultElement.className = 'code-result';
          resultElement.textContent = `Result: ${JSON.stringify(result, null, 2)}`;
          document.getElementById('chat-container').appendChild(resultElement);
        } catch (error) {
          console.error(`Error executing code block ${i + 1}:`, error);
          
          // Display the error
          const errorElement = document.createElement('div');
          errorElement.className = 'code-error';
          errorElement.textContent = `Error: ${error.message}`;
          document.getElementById('chat-container').appendChild(errorElement);
        }
      }
    } else {
      // If no code blocks, just display the response
      addMessageToUI(response, false);
    }
  } catch (error) {
    console.error('Error processing AI response:', error);
    addMessageToUI(`Error processing response: ${error.message}`, false);
  }
}

// Send a message to the AI with streaming response
async function sendMessageToAI(message, continueFromResponse = null) {
  try {
    // Only add user message to UI if this is a new conversation, not a continuation
    if (!continueFromResponse) {
      addMessageToUI(message, true);
      
      // Add to history
      messageHistory.push({
        role: 'user',
        content: message
      });
    }
    
    // Get or create the AI message element
    const chatContainer = document.getElementById('chat-container');
    let aiMessageElement;
    
    if (continueFromResponse) {
      // Find the last AI message element
      const aiMessages = document.querySelectorAll('.ai-message');
      aiMessageElement = aiMessages[aiMessages.length - 1];
    } else {
      // Create a new AI message element
      aiMessageElement = document.createElement('div');
      aiMessageElement.className = 'ai-message';
      chatContainer.appendChild(aiMessageElement);
    }
    
    // Create separate elements for code blocks and results
    let currentCodeBlockElement = null;
    let currentCodeResultElement = null;
    
    // Current text buffer - initialize from previous response if continuing
    let currentText = continueFromResponse || '';
    
    // If continuing, restore the formatted content
    if (continueFromResponse) {
      aiMessageElement.innerHTML = formatMessage(currentText);
    }
    
    // Callbacks for streaming
    const onToken = (token) => {
      // Append the token to the current text
      currentText += token;
      
      // Update the message element with formatted text
      aiMessageElement.innerHTML = formatMessage(currentText);
      
      // Scroll to bottom
      chatContainer.scrollTop = chatContainer.scrollHeight;
    };
    
    const onCodeBlock = (code, fullBlock) => {
      console.log('Complete code block received:', code);
      console.log('Full block:', fullBlock);
      
      // Check if this is a properly formatted arrow function
      if (!code.includes('=>')) {
        console.warn('Code block is not a proper arrow function, this may fail to execute');
      }
      
      // Find the run-js code block in the AI message and insert the result after it
      const codeBlocks = aiMessageElement.querySelectorAll('pre.run-js-block');
      let targetCodeBlock = null;
      
      // Find the code block that contains this code
      for (const block of codeBlocks) {
        if (block.textContent.includes(code)) {
          targetCodeBlock = block;
          break;
        }
      }
      
      // Create the results element
      currentCodeResultElement = document.createElement('div');
      currentCodeResultElement.className = 'code-execution';
      currentCodeResultElement.textContent = 'Executing code...';
      
      if (targetCodeBlock) {
        // Insert the results directly after the code block
        targetCodeBlock.after(currentCodeResultElement);
      } else {
        // Fallback: append to chat container
        chatContainer.appendChild(currentCodeResultElement);
      }
      
      // Scroll to bottom
      chatContainer.scrollTop = chatContainer.scrollHeight;
    };
    
    const onCodeExecution = (executionData) => {
      if (!currentCodeResultElement) return;
      
      if (executionData.success) {
        // Update the result element with success
        currentCodeResultElement.className = 'code-result';
        currentCodeResultElement.textContent = `Result: ${JSON.stringify(executionData.result, null, 2)}`;
      } else {
        // Update the result element with error
        currentCodeResultElement.className = 'code-error';
        currentCodeResultElement.textContent = `Error: ${executionData.error}`;
      }
      
      // Reset current elements
      currentCodeBlockElement = null;
      currentCodeResultElement = null;
      
      // Scroll to bottom
      chatContainer.scrollTop = chatContainer.scrollHeight;
    };
    
    // Get streaming response from API
    const response = await sendMessage(
      message, 
      messageHistory, 
      onToken, 
      onCodeBlock, 
      onCodeExecution
    );
    
    // Add complete response to history
    messageHistory.push({
      role: 'assistant',
      content: response
    });
    
    // Limit history length to avoid token limits
    if (messageHistory.length > 10) {
      messageHistory = messageHistory.slice(messageHistory.length - 10);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    addMessageToUI(`Error: ${error.message}`, false);
  }
}

// Format message with code highlighting
function formatMessage(message) {
  let formattedMessage = message;
  
  // Format code blocks that are not run-js blocks
  formattedMessage = formattedMessage.replace(/```(?!run-js)([\s\S]*?)```/g, (match, code) => {
    return `<pre><code>${code}</code></pre>`;
  });
  
  // Highlight run-js blocks
  formattedMessage = formattedMessage.replace(/```run-js([\s\S]*?)```/g, (match, code) => {
    return `<pre class="run-js-block"><code>${code}</code></pre>`;
  });
  
  return formattedMessage;
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
  document.getElementById('api-key').value = '••••••••••••••••••••';
}

// Welcome message
addMessageToUI('Welcome to Baby Jarvis! I can help you with tasks using JavaScript. I can create new tools on demand too. Try asking me to create a tool or use an existing one.', false);