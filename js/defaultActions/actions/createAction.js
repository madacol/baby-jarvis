export default /** @type {defineAction} */ (x=>x)({
  name: "createAction",
  description: `Creates a new action after having it already tested, working and validated by the user.
IMPORTANT: This tool should ONLY be executed when the user EXPLICITLY requests to create or make a new action.`,
  parameters: {
    type: "object",
    properties: {
      name: { type: "string", description: "The unique identifier and reference name for the action. Use a concise, descriptive name with camelCase formatting (e.g., 'fetchWeatherData', 'generateReport')." },
      description: { type: "string", description: "A comprehensive explanation of what the action does, when to use it, what it returns, and any important usage notes. This helps users understand the action's purpose and proper usage context. Use `...` for multi-line descriptions." },
      parameters: { type: "object", description: "A JSON schema defining the input parameters the action accepts. Include type, description, and required fields for each parameter. The schema follows standard JSON Schema format and will be used for validation and documentation." },
      action_function: { type: "string", description: "The implementation of the action as an arrow function that receives two arguments: a context object (providing access to system capabilities) and the parameters object containing user inputs. Function body should handle error cases and return appropriate values." },
      permissions: {
        type: "object",
        properties: {
          autoExecute: { type: "boolean", description: "Whether the action should be automatically run when the user requests it." },
          autoContinue: { type: "boolean", description: "Whether the LLM should continue after the action is executed." },
          usePersistentDb: { type: "boolean", description: "Whether the action should use a persistent database that persists across browser refreshes." },
          useFileSystem: { type: "boolean", description: "Whether the action should use the file system to read and write files." }
        }
      },
    },
    required: ["name", "description", "parameters", "action_function"],
  },
  permissions: {
    useFileSystem: true,
  },
  /**
   * Create a new action within an app
   * @param {Context<{useFileSystem: true}>} context - The context object
   * @param {{name: string, description: string, parameters: object, action_function: string, test_functions?: string[]}} params - The action object
   */
  action_fn: async function ({directoryHandle}, {name, description, parameters, action_function, test_functions}) {
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
      const actionModule = 
`export default /** @type {defineAction} */ (x=>x)({
  name: "${name}",
  description: \`${description.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
  parameters: ${JSON.stringify(parameters, null, 2)},
  action_fn: ${action_function},
  test_functions: ${test_functions ? JSON.stringify(test_functions, null, 2) : '[]'}
});
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
});
