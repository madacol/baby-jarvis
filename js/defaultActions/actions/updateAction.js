export default /** @type {defineAction} */ (x=>x)({
  name: "updateAction",
  description: `Update an existing action by updating its properties.

This action allows to update:
- Action's name
- Description
- Parameters schema
- Action function
- Test functions

Provides a flexible way to evolve custom actions without completely recreating them.`,
  parameters: {
  "type": "object",
  "properties": {
    "originalName": {
      "type": "string",
      "description": "The current name of the action to be modified"
    },
    "newName": {
      "type": "string",
      "description": "Optional new name for the action"
    },
    "description": {
      "type": "string",
      "description": "Optional new description for the action"
    },
    "parameters": {
      "type": "object",
      "description": "Optional new parameters schema"
    },
    "action_function": {
      "type": "string",
      "description": "Optional new action function implementation"
    },
    "test_functions": {
      "type": "array",
      "description": "Optional array of test functions",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "originalName"
  ]
},
  permissions: {
    useFileSystem: true
  },
  action_fn: async function (context, {originalName, newName, description, parameters, action_function, test_functions}) {
  // Validate input
  if (!originalName) {
    throw new Error('Original action name must be provided');
  }

  const directoryHandle = context.directoryHandle;
  if (!directoryHandle) {
    throw new Error('A directory has not been set for this app');
  }

  try {
    // Get the actions directory
    const actionsHandle = await directoryHandle.getDirectoryHandle('actions');
    
    // Construct original and potential new filenames
    const originalFileName = `${originalName}.js`;
    const newFileName = (newName ? `${newName}.js` : originalFileName);

    // Read the original action file
    const originalFileHandle = await actionsHandle.getFileHandle(originalFileName);
    const originalFile = await originalFileHandle.getFile();
    const originalContent = await originalFile.text();

    // Parse the existing action module
    const blob = new Blob([originalContent], { type: 'application/javascript' });
    const blobURL = URL.createObjectURL(blob);
    
    let existingAction;
    try {
      const module = await import(blobURL);
      existingAction = module.default;
    } catch (error) {
      console.error('Error parsing existing action:', error);
      throw new Error('Failed to parse existing action');
    } finally {
      URL.revokeObjectURL(blobURL);
    }

    // Prepare updated action details
    const updatedAction = {
      name: newName || existingAction.name,
      description: description || existingAction.description,
      parameters: parameters || existingAction.parameters,
      action_fn: action_function || existingAction.action_fn,
      test_functions: test_functions || existingAction.test_functions || []
    };

    // Create the updated action module content
    const updatedActionModule = `/** @type {Action} */
export default {
  name: "${updatedAction.name}",
  description: "${updatedAction.description}",
  parameters: ${JSON.stringify(updatedAction.parameters, null, 2)},
  action_fn: ${updatedAction.action_fn},
  test_functions: ${JSON.stringify(updatedAction.test_functions, null, 2)}
};`;

    // Write the updated content
    if (newFileName !== originalFileName) {
      // If name changed, delete old file and create new one
      await actionsHandle.removeEntry(originalFileName);
    }

    const newFileHandle = await actionsHandle.getFileHandle(newFileName, { create: true });
    const writable = await newFileHandle.createWritable();
    await writable.write(updatedActionModule);
    await writable.close();

    return {
      message: `Action ${originalName} has been successfully modified`,
      newName: updatedAction.name
    };
  } catch (error) {
    console.error('Error modifying action:', error);
    throw error;
  }
},
  test_functions: []
});
