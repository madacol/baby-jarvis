/**
 * @typedef {{
 *   permission_id: string,
 *   name: string,
 *   description?: string,
 * }} Permission
 * 
 * @typedef {{
 *   fileName: string,
 *   app_id: string | null,
 *   name: string,
 *   description: string,
 *   parameters: {},
 *   action_fn: (input: any) => Promise<any>
 *   test_fn: (()=>Promise<boolean>)[]
 *   permissions: string[]
 * }} Action
 * 
 * @typedef {{
 *   app_id: string,
 *   name: string,
 *   description: string,
 *   actions: Action[]
 * }} App
 */

/**
 * Retrieves all available actions from the defaultActions directory
 * using the File System Access API
 * @returns {Promise<Action[]>} Array of action objects with name derived from filename
 */
export async function getActions() {
  // Check if File System Access API is supported
  if (!('showDirectoryPicker' in window)) {
    throw new Error('File System Access API not supported in this browser');
  }  
  // Get the defaultActions directory
  // Need user interaction to access file system
  const directoryHandle = await window.showDirectoryPicker();

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
  const actions = (await Promise.all(
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
        const module = await import(blobURL);
        
        // Return the action if it has a default export
        if (module.default) {
          return {
            ...module.default,
            fileName: entry.name
          };
        }

        console.error(`Action ${entry.name} has no default export`);
        return null;
      } catch (importError) {
        console.error(`Error importing action ${entry.name}:`, importError);
        throw importError;
      } finally {
        // Clean up
        URL.revokeObjectURL(blobURL);
      }
    })
  )).filter(action => action !== null);
  
  return actions;
}

