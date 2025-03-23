/**
 * @typedef {Object} RawAction
 * @property {string} name - The name of the action
 * @property {string} description - Description of what the action does
 * @property {Object} parameters - a JSON-Schema for the action_fn's parameters
 * @property {Function} action_fn - The function that implements the action
 * @property {Function[]} [test_fn] - Optional test functions for the action
 * @property {string[]} [permissions] - Optional permissions required by the action
 */
export default {
  name: "runJavascript",
  description: "Execute arbitrary JavaScript code and return the result. Code must be an arrow function that receives a context object.",
  parameters: {
    type: "object",
    properties: {
      code: {
        type: "string",
        description: "The JavaScript code to execute. Must be an arrow function that accepts a context object that has helpers like getTool, log, and sql. Example: '({getTool, log}) => { return getTool(\"echo\")(\"hello\"); }'",
      },
    },
    required: ["code"],
  },
  /**
   * Run JavaScript code
   * @param {{code: string}} params - code to execute as an arrow function
   * @returns {Promise<any>} The result of execution
   */
  action_fn: async function runJs({code}) {
    console.log('Executing JavaScript code:', code);
    
    // Create context object with helper functions
    const context = {
      log,
      sql: async (query, params) => {
        console.log('SQL query:', query, params);
        return []; // Mock implementation
      }
    };
  
    let fn;
    try {
      // Evaluate code
      fn = Function(`return ${code}`)();
    } catch (error) {
      console.error('Invalid JavaScript code: Is it a function?', {code, error});
      throw error;
    }
    if (typeof fn !== 'function') {
      console.error('fn is not a function:', {code, fn});
      throw new Error('Code must evaluate to a function');
    }
    try {
      return fn(context);
    } catch (error) {
      console.error('Error executing function:', {code, fn, error});
      throw error;
    }
  }
}


// Log function for tools to use
function log(...args) {
  const message = args.join(' ');
  console.log(...args);
  
  // Add to chat UI if available
  try {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      const logElement = document.createElement('div');
      logElement.className = 'log-message';
      logElement.textContent = message;
      chatContainer.appendChild(logElement);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  } catch (e) {
    console.error('Error displaying log in UI:', e);
  }
  
  return message;
}