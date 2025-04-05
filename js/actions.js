import { PGlite } from '../node_modules/@electric-sql/pglite/dist/index.js';
import { initializeDirectoryHandle } from './directoryHandleStore.js';

/**
 * Execute a custom action
 * @param {string} actionName - The name of the action to execute
 * @param {{}} input - The input to pass to the action
 * @returns {Promise<{result: any, permissions: Action['permissions']}>} Result of the action execution
 */
export async function executeAction(actionName, input) {
  const action = await getAction(actionName);
  if (!action) {
    throw new Error(`Action "${actionName}" not found`);
  }

  const context = {
    // db: new PGlite(`${actionName}.pglite`),
    db: new PGlite(),
    log,
    directoryHandle,
    getActions
  }

  // If the action doesn't require confirmation, execute it immediately
  if (!action.permissions?.autoExecute) {
    try {
      return {
        result: await action.action_fn(context, input),
        permissions: action.permissions
      };
    } catch (error) {
      console.error(`Error executing action ${actionName}:`, error);
      throw error;
    }
  }

  // If confirmation is required, show the confirmation buttons
  return await new Promise((resolve, reject) => {
    // Get the chat container
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer) {
      console.error('Chat container not found');
      reject(new Error('Chat container not found'));
      return;
    }

    // Create a wrapper for the buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'action-buttons';
    buttonsContainer.style.marginTop = '10px';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Confirm';
    confirmBtn.onclick = async () => {
      // Remove the buttons container after clicking
      if (buttonsContainer.parentNode) {
        buttonsContainer.parentNode.removeChild(buttonsContainer);
      }
      
      try {
        resolve({
          result: await action.action_fn(context, input),
          permissions: action.permissions
        });
      } catch (error) {
        console.error(`Error executing action ${actionName}:`, error);
        reject(error);
      }
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = async () => {
      // Remove the buttons container after clicking
      if (buttonsContainer.parentNode) {
        buttonsContainer.parentNode.removeChild(buttonsContainer);
      }
      
      reject(new Error("Execution cancelled by user"));
    };
    
    // Add style to buttons
    confirmBtn.style.marginRight = '10px';
    confirmBtn.style.padding = '5px 10px';
    cancelBtn.style.padding = '5px 10px';
    
    // Append buttons to the container
    buttonsContainer.appendChild(confirmBtn);
    buttonsContainer.appendChild(cancelBtn);
    
    // Append the buttons container to the chat container
    chatContainer.appendChild(buttonsContainer);
  });
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
    }
  } catch (e) {
    console.error('Error displaying log in UI:', e);
  }
  
  return message;
}

/** @type {FileSystemDirectoryHandle} */
let directoryHandle;

/**
 * Retrieves all available actions from the defaultActions directory
 * using the File System Access API
 * @returns {Promise<AppAction[]>} Array of action objects with name derived from filename
 */
export async function getActions() {
  if (!directoryHandle) {
    // Try to get the saved directory handle
    directoryHandle = await initializeDirectoryHandle();
  }

  const defaultActionsHandle = await directoryHandle.getDirectoryHandle('actions');
  
  // Get all JS files in the directory
  /** @type {FileSystemHandle[]} */
  const entries = [];
  for await (const entry of defaultActionsHandle.values()) {
    if (entry.kind === 'file' && entry.name.endsWith('.js')) {
      entries.push(entry);
    }
  }
  
  // Use map to process all files in parallel
  actions = (await Promise.all(
    entries.map(async (entry) => {
      // Get the file handle and read its content
      const fileHandle = await defaultActionsHandle.getFileHandle(entry.name);
      const file = await fileHandle.getFile();
      const content = await file.text();
      
      // Create a blob URL from the content
      const blob = new Blob([content], { type: 'application/javascript' });
      const blobURL = URL.createObjectURL(blob);
      
      try {
        // Import the module
        const module = await import(/* @vite-ignore */blobURL);
        
        // Return the action if it has a default export
        if (module.default) {
          return {
            ...module.default,
            fileName: entry.name,
            app_name: ''
          };
        }

        console.error(`Action ${entry.name} has no default export`);
        return null;
      } catch (importError) {
        console.error(`Error importing action ${entry.name}:`, importError);
        return null;
      } finally {
        // Clean up
        URL.revokeObjectURL(blobURL);
      }
    })
  )).filter(action => action !== null);
  
  return actions;
}

/** @type {AppAction[]} */
let actions;

/**
 * Get a specific action by name from the file system
 * @param {string} actionName - The name of the action to retrieve
 * @returns {Promise<AppAction|null>} The action object or null if not found
 */
export async function getAction(actionName) {
  // Check if we have a directory handle
  if (!directoryHandle) {
    // Try to get the saved directory handle
    directoryHandle = await initializeDirectoryHandle();
  }
  
  try {
    const defaultActionsHandle = await directoryHandle.getDirectoryHandle('actions');
    
    // Try to find the file with the matching action name
    // First check for exact filename match (actionName.js)
    const fileName = actions.find(action => action.name === actionName)?.fileName;
    if (!fileName) {
      throw new Error(`Action "${actionName}" not found`);
    }

    try {
      // Get the file handle and read its content
      const fileHandle = await defaultActionsHandle.getFileHandle(fileName);
      const file = await fileHandle.getFile();
      const content = await file.text();
      
      // Create a blob URL from the content
      const blob = new Blob([content], { type: 'application/javascript' });
      const blobURL = URL.createObjectURL(blob);
      
      try {
        // Import the module
        const module = await import(/* @vite-ignore */blobURL);

        /** @type {Action} */
        const action = module.default;
        
        // Return the action if it has a default export
        if (action) {
          return {
            ...action,
            app_name: '',
            fileName
          };
        }
        
        console.error(`Action ${fileName} has no default export`);
        return null;
      } finally {
        // Clean up
        URL.revokeObjectURL(blobURL);
      }
    } catch (fileError) {
      console.error(`Could not find action file for ${actionName}:`, fileError);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving action ${actionName}:`, error);
    throw error;
  }
}
