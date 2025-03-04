/**
 * JavaScript Runtime Engine for executing tools for Baby Jarvis
 */

// Simple in-memory tools database
const toolsDb = {};

/**
 * Run JavaScript code
 * @param {string} code - The code to execute as an arrow function
 * @returns {Promise<any>} The result of execution
 */
async function runJs(code) {
  try {
    console.log('Executing JavaScript code:', code);
    
    // Create context object with helper functions
    const context = {
      getTool: (name) => {
        console.log(`Getting tool: ${name}`);
        // Return a function that will call the tool when invoked
        return async (...args) => {
          console.log(`Executing tool ${name} with args:`, args);
          return await executeTool(name, args.length === 1 ? args[0] : args);
        };
      },
      log,
      sql: async (query, params) => {
        console.log('SQL query:', query, params);
        return []; // Mock implementation
      }
    };
    
    // Evaluate code as arrow function that receives context
    let fn;
    try {
      fn = Function(`return ${code}`)();
      
      if (typeof fn !== 'function') {
        throw new Error('Code must evaluate to a function');
      }
      
      const result = await Promise.resolve(fn(context));
      return { result };
    } catch (error) {
      console.error('JavaScript execution error:', error);
      throw error;
    }
  } catch (error) {
    console.error('JavaScript execution error:', error);
    throw error;
  }
}

/**
 * Create a new tool
 * @param {string} name - The name of the tool
 * @param {string} description - The description of the tool
 * @param {Function} implementation - The function implementation for the tool
 * @returns {Promise<object>} Result of tool creation
 */
async function createTool(name, description, implementation) {
  try {
    console.log(`Creating new tool: ${name}`);
    console.log(`Description: ${description}`);
    
    // Check if tool already exists
    if (toolsDb[name]) {
      console.warn(`Tool ${name} already exists and will be overwritten`);
    }
    
    // Validate that implementation is a function
    if (typeof implementation !== 'function') {
      throw new Error('Tool implementation must be a function');
    }
    
    // Store the tool
    toolsDb[name] = {
      name,
      description,
      implementation
    };
    
    return { 
      success: true, 
      name, 
      description
    };
  } catch (error) {
    console.error('Error creating tool:', error);
    throw error;
  }
}

/**
 * List all available tools
 * @returns {Promise<object[]>} Array of tool info objects
 */
async function listTools() {
  return Object.keys(toolsDb).map(name => ({
    name,
    description: toolsDb[name].description
  }));
}

/**
 * Execute a custom tool
 * @param {string} name - The name of the tool to execute
 * @param {any} input - The input for the tool
 * @returns {Promise<any>} Result of the tool execution
 */
async function executeTool(name, input) {
  if (!toolsDb[name]) {
    throw new Error(`Tool "${name}" not found`);
  }
  
  try {
    return await toolsDb[name].implementation(input);
  } catch (error) {
    console.error(`Error executing tool ${name}:`, error);
    throw error;
  }
}

// Initialize with built-in tools
function initializeTools() {
  // Example built-in tool
  createTool(
    'echo',
    'Echoes back the input provided',
    (message) => {
      return message || "No message provided";
    }
  );
}

// Initialize tools when the script loads
initializeTools();

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

export { 
  runJs, 
  createTool, 
  listTools, 
  executeTool,
  log
};