/** @type {Action} */
export default {
  name: "openActionEditor",
  description: "Opens a Monaco editor for a specific action file in the actions folder, with save functionality.",
  parameters: {
  "type": "object",
  "properties": {
    "actionName": {
      "type": "string",
      "description": "The name of the action file to open (without .js extension)"
    }
  },
  "required": [
    "actionName"
  ]
},
  action_fn: async ({log, directoryHandle}, {actionName}) => {
  // Type definitions for Monaco and require
  /** @typedef {any} MonacoType */
  
  /** @type {(window: Window & typeof globalThis) => Window & typeof globalThis & { monaco?: MonacoType, require?: any }} */
  const getExtendedWindow = (win) => win;
  const extWindow = getExtendedWindow(window);

  // Remove existing Monaco editor if it exists
  const existingMonaco = document.getElementById('monaco');
  if (existingMonaco) {
    existingMonaco.remove();
  }

  // Create container div
  const containerDiv = document.createElement('div');
  containerDiv.style.display = 'flex';
  containerDiv.style.flexDirection = 'column';

  // Create title and save button container
  const headerDiv = document.createElement('div');
  headerDiv.style.display = 'flex';
  headerDiv.style.justifyContent = 'space-between';
  headerDiv.style.padding = '10px';
  headerDiv.style.backgroundColor = '#f0f0f0';

  // Create title span
  const titleSpan = document.createElement('span');
  headerDiv.appendChild(titleSpan);

  // Create save button
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.style.backgroundColor = '#4CAF50';
  saveButton.style.color = 'white';
  saveButton.style.border = 'none';
  saveButton.style.padding = '10px 20px';
  saveButton.style.cursor = 'pointer';
  headerDiv.appendChild(saveButton);

  // Create Monaco container
  const monacoDiv = document.createElement('div');
  monacoDiv.id = 'monaco';
  monacoDiv.style.height = '400px';
  monacoDiv.style.width = '100%';
  monacoDiv.style.border = '1px solid grey';

  // Assemble container
  containerDiv.appendChild(headerDiv);
  containerDiv.appendChild(monacoDiv);
  document.body.appendChild(containerDiv);

  // Load Monaco from CDN if not already loaded
  async function loadMonaco() {
    // Check if Monaco is already loaded
    if (typeof monaco !== 'undefined') {
      log('Monaco is already loaded');
      return;
    }
  
    // Create a script loader function
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };
  
    // Create a link loader function for CSS
    const loadStyle = (href) => {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.href = href;
        link.rel = 'stylesheet';
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });
    };
  
    // Create the Monaco container div
    const monacoDiv = document.createElement('div');
    monacoDiv.id = 'monaco';
    monacoDiv.style.height = '400px';
    monacoDiv.style.border = '1px solid grey';
    document.body.appendChild(monacoDiv);
  
    // Load Monaco editor resources
    return Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs/loader.min.js'),
      loadStyle('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs/editor/editor.main.min.css')
    ]).then(() => {
      return new Promise((resolve) => {
        require.config({ 
          paths: { 
            vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs' 
          } 
        });
        
        require(['vs/editor/editor.main'], () => {
          resolve(monaco);
        });
      });
    }).catch(error => {
      log('Error loading Monaco Editor:', error);
    });
  }

  try {
    // Load Monaco and wait for it to be ready
    const monaco = await loadMonaco();
    if (!monaco) {
      log('Monaco Editor could not be loaded');
      return null;
    }

    // Navigate to /actions/ folder
    const actionsFolder = await directoryHandle.getDirectoryHandle('actions');
    
    // Construct full filename
    const fileName = `${actionName}.js`;

    // Try to get the specific file
    let selectedFile;
    try {
      selectedFile = await actionsFolder.getFileHandle(fileName);
    } catch (fileError) {
      log(`File ${fileName} not found in actions folder`);
      return null;
    }

    // Read the file
    const file = await selectedFile.getFile();
    const fileContent = await file.text();

    // Update title
    titleSpan.textContent = `Editing: ${fileName}`;

    // Create Monaco editor
    const editor = monaco.editor.create(monacoDiv, {
      value: fileContent,
      language: 'javascript',
      theme: 'vs-dark',
      automaticLayout: true
    });

    // Save functionality
    saveButton.onclick = async () => {
      try {
        // Get the current content from the editor
        const content = editor.getValue();

        // Create a writable stream
        const writable = await selectedFile.createWritable();
        
        // Write the content
        await writable.write(content);
        
        // Close the stream
        await writable.close();

        log(`File ${fileName} saved successfully!`);
      } catch (saveError) {
        log(`Error saving file: ${saveError.message}`);
      }
    };

    log(`Opened file: ${fileName}`);
    return editor;

  } catch (error) {
    log('Error opening file: ' + error.message);
    return null;
  }
},
  test_functions: []
};
