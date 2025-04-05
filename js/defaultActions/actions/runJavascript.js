/** @type {Action} */
export default {
  name: "runJavascript",
  description: "Use this to execute any JavaScript code and show results. The code must be an arrow function that receives a context object.",
  parameters: {
    type: "object",
    properties: {
      code: {
        type: "string",
        description: "The JavaScript code to execute. Must be an arrow function that accepts a context object that has helpers like `log()` to log extra information, the main answer must be returned form the function. Example: '({log, db}) => { log(\"Processing\"); return db.sql(\"SELECT * FROM users\"); }'",
      },
    },
    required: ["code"],
  },
  permissions: {
    autoExecute: true
  },
  /**
   * Run JavaScript code
   * @param {Context} context - The context object
   * @param {{code: string}} params - code to execute as an arrow function
   * @returns {Promise<any>} The result of execution
   */
  action_fn: async function runJs(context, {code}) {
    console.log('Executing JavaScript code:', code);
  
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
