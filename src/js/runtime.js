/**
 * JavaScript Runtime Engine for executing LLM code
 */

// Simple in-memory tools database
const toolsDb = {};

/**
 * Run JavaScript code
 * @param {string} code - The code to execute
 * @returns {Promise<any>} The result of execution
 */
function runJs(code) {
  // Context shared across all executions
  const context = {
    getTool,
    log,
    sql
  }
  // Execute the code as an arrow function with context
  return getFunction(code)(context);
}

/**
 * Get function helper
 * @param {string} code - The code to get the function from
 * @returns {Function} The function
 */
function getFunction(code) {
  // Recover the function from the code
  return Function(`return ${code}`)();
}

/**
 * Get tool helper
 * @param {string} name - The name of the tool to get
 * @returns {Function} The tool function
 */
async function getTool(name) {
  const tool = toolsDb[name];
  if (!tool) throw new Error(`Tool "${name}" not found`);
  // Return the function
  return tool;
}

/**
 * Logging with real-time display
 * @param {...any} args - The arguments to log
 */
function log(...args) {
  const message = args.join(' ');
  // Display to user in real-time
  console.log(...args);
  
  // Also append to chat UI
  const chatContainer = document.getElementById('chat-container');
  const logElement = document.createElement('div');
  logElement.className = 'log-message';
  logElement.textContent = message;
  chatContainer.appendChild(logElement);
  
  return message;
}

/**
 * Database interface (mock implementation)
 * @param {string} query - The SQL query template strings
 * @param {any[]} params - The parameters for the query
 * @returns {Promise<any[]>} The result of the query
 */
async function sql(strings, ...values) {
  // This is just a mock implementation
  // In a real app, this would connect to IndexedDB
  console.log('SQL Query:', strings.join('?'), 'Values:', values);
  return [];
}

/**
 * Parses LLM responses to extract run-js code blocks
 * @param {string} llmResponse - The full response from the LLM
 * @returns {Object} Parsed response with code blocks and modified message
 */
function parseLLMResponse(llmResponse) {
  // Look for run-js code blocks
  const codeBlockRegex = /```run-js\s*([\s\S]*?)\s*```/g;
  const matches = [...llmResponse.matchAll(codeBlockRegex)];
  
  // Extract all code blocks
  const codeBlocks = matches.map(match => match[1].trim());
  
  // Replace code blocks with placeholders for later
  let cleanMessage = llmResponse;
  matches.forEach((match, index) => {
    cleanMessage = cleanMessage.replace(match[0], `[CODE_EXECUTION_${index}]`);
  });
  
  return {
    message: cleanMessage,
    codeBlocks
  };
}

/**
 * Execute all code blocks in an LLM response and replace placeholders with results
 * @param {string} llmResponse - The full response from the LLM
 * @returns {Promise<string>} - The response with executed code blocks
 */
async function executeCodeInResponse(llmResponse) {
  const { message, codeBlocks } = parseLLMResponse(llmResponse);
  
  if (codeBlocks.length === 0) {
    return llmResponse;
  }
  
  let processedMessage = message;
  
  for (let i = 0; i < codeBlocks.length; i++) {
    try {
      const result = await runJs(codeBlocks[i]);
      const resultStr = JSON.stringify(result, null, 2);
      processedMessage = processedMessage.replace(
        `[CODE_EXECUTION_${i}]`,
        `\`\`\`run-js\n${codeBlocks[i]}\n\`\`\`\n\nResult:\n\`\`\`json\n${resultStr}\n\`\`\``
      );
    } catch (error) {
      processedMessage = processedMessage.replace(
        `[CODE_EXECUTION_${i}]`,
        `\`\`\`run-js\n${codeBlocks[i]}\n\`\`\`\n\nError:\n\`\`\`\n${error.message}\n\`\`\``
      );
    }
  }
  
  return processedMessage;
}

// Initialize with built-in tools
function initializeTools() {
  // Tool for creating new tools
  toolsDb['createTool'] = function(name, description, implementation) {
    console.log(`Creating new tool: ${name}`);
    console.log(`Description: ${description}`);
    
    if (toolsDb[name]) {
      console.warn(`Tool ${name} already exists and will be overwritten`);
    }
    
    toolsDb[name] = implementation;
    return { success: true, name, description };
  };
  
  // Tool for listing available tools
  toolsDb['listTools'] = function() {
    return Object.keys(toolsDb).map(toolName => ({
      name: toolName
    }));
  };
}

// Initialize tools when the script loads
initializeTools();

export { 
  runJs, 
  getFunction, 
  getTool, 
  log, 
  sql, 
  parseLLMResponse, 
  executeCodeInResponse 
};