/** @type {Action} */
export default {
  name: "readAction",
  description: "Reads the source code of an existing action from the file system. This utility allows users to view the implementation details of any action available in the system by providing the action name. Returns the full source code of the requested action as well as its metadata.",
  parameters: {
  "type": "object",
  "properties": {
    "actionName": {
      "type": "string",
      "description": "The name of the action to read (e.g., 'readAction', 'modifyAction')"
    }
  },
  "required": [
    "actionName"
  ]
},
permissions: {
  autoExecute: true,
  autoContinue: true
},
  action_fn: async ({log, directoryHandle}, params) => {
  try {
    const { actionName } = params;
    
    if (!actionName) {
      return {
        success: false,
        error: "Action name is required"
      };
    }
    
    // Access the actions directory
    const actionsDirectory = await directoryHandle.getDirectoryHandle('actions');
    
    // List all files in the actions directory to find the right one
    const files = [];
    for await (const entry of actionsDirectory.values()) {
      if (entry.kind === 'file') {
        files.push(entry.name);
      }
    }
    
    // Try to find the exact file name first (if user provided .js extension)
    let fileName = actionName;
    if (!fileName.endsWith('.js')) {
      fileName = `${fileName}.js`;
    }
    
    // If file not found, try to find a case-insensitive match
    if (!files.includes(fileName)) {
      const possibleMatch = files.find(file => 
        file.toLowerCase() === fileName.toLowerCase());
      
      if (possibleMatch) {
        fileName = possibleMatch;
      } else {
        // Look for partial matches (actionName might not be the complete filename)
        const possibleMatches = files.filter(file => 
          file.toLowerCase().includes(actionName.toLowerCase()));
          
        if (possibleMatches.length === 1) {
          fileName = possibleMatches[0];
        } else if (possibleMatches.length > 1) {
          return {
            success: false,
            error: `Multiple matching files found for "${actionName}": ${possibleMatches.join(', ')}. Please be more specific.`
          };
        } else {
          return {
            success: false,
            error: `No action file found with name "${actionName}". Available actions: ${files.join(', ')}`
          };
        }
      }
    }
    
    // Get the file and read its content
    const actionFile = await actionsDirectory.getFileHandle(fileName);
    const file = await actionFile.getFile();
    const content = await file.text();
    
    // Import the module dynamically to extract metadata
    let metadata = null;
    try {
      // Create a blob URL from the file content
      const blob = new Blob([content], { type: 'text/javascript' });
      const blobURL = URL.createObjectURL(blob);
      
      // Import the module
      const actionModule = await import(/* @vite-ignore */ blobURL);
      const actionDefault = actionModule.default;
      
      // Clean up the blob URL
      URL.revokeObjectURL(blobURL);
      
      metadata = {
        fileName,
        name: actionDefault?.name || null,
        description: actionDefault?.description || null
      };
    } catch (importError) {
      log("Error importing action module:", importError);
      // Continue even if metadata extraction fails
    }
    
    return {
      success: true,
      fileName,
      actionName: metadata?.name || actionName,
      description: metadata?.description || "Description not found",
      content,
      size: content.length,
      lines: content.split('\n').length
    };
  } catch (error) {
    log("Error reading action:", error);
    return {
      success: false,
      error: error.toString()
    };
  }
},
  test_functions: []
};
