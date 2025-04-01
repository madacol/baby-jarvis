/** @type {Action} */
export default {
  name: "createAction",
  description: "Create a new action that will be stored permanently so the user can use it in the future. IMPORTANT: This tool should ONLY be executed when the user EXPLICITLY requests to create a new custom action. Do not use this proactively or as part of general problem-solving unless the user has specifically asked to 'create an action' or 'make a custom action'. When in doubt, ask the user first if they want to create a permanent action rather than executing this tool.",
  parameters: {
    type: "object",
    properties: {
      name: { type: "string", description: "The name of the action" },
      description: { type: "string", description: "The description of the action" },
      parameters: { type: "object", description: "A JSON schema for the parameters that will receive the action" },
      action_function: { type: "string", description: "The action that is an arrow function, that receives a context object and the parameters object described in the schema" },
    },
    required: ["name", "description", "parameters", "action_function"],
  },
  /**
   * Create a new action within an app
   * @param {Context} context - The context object
   * @param {{name: string, description: string, parameters: object, action_function: string, test_functions?: string[]}} params - The action object
   */
  action_fn: async function createAction(context, {name, description, parameters, action_function, test_functions}) {

    // Check if File System Access API is supported
    if (!('showDirectoryPicker' in window)) {
      throw new Error('File System Access API not supported in this browser');
    }
    
    const directoryHandle = context.directoryHandle;
    if (!directoryHandle) {
      throw new Error('A directory has not been set for this app');
    }
    
    try {
      // Get or create the actions directory
      const actionsHandle = await directoryHandle.getDirectoryHandle('actions', { create: true });
      
      // Create the action file
      const fileName = `${name}.js`;
      const fileHandle = await actionsHandle.getFileHandle(fileName, { create: true });
      
      // Create the action module content with app_id
      const actionModule = `/** @type {Action} */
export default {
  name: "${name}",
  description: "${description}",
  parameters: ${JSON.stringify(parameters, null, 2)},
  action_fn: ${action_function},
  test_functions: ${test_functions ? JSON.stringify(test_functions, null, 2) : '[]'}
};
`;

      // Write to the file
      const writable = await fileHandle.createWritable();
      await writable.write(actionModule);
      await writable.close();
    } catch (error) {
      console.error('Error creating action:', error);
      throw error;
    }
  }
};
