/** @type {Action} */
export default {
  name: "openActionEditor",
  description: "Opens a Monaco editor for a specific action file in the actions folder, with save functionality.",
  parameters: {
    type: "object",
    properties: {
      actionName: {
        type: "string",
        description: "The name of the action file to open (without .js extension)"
      }
    },
    required: [
      "actionName"
    ]
  },
  action_fn: async ({log, directoryHandle}, {actionName}) => {
    // Validate directoryHandle
    if (!directoryHandle) {
      throw new Error('No directory handle available');
    }

    // Function to load a script
    /**
     * @param {string} src
     * @returns {Promise<void>}
     */
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = ()=>resolve();
        script.onerror = ()=>reject();
        document.body.appendChild(script);
      });
    };

    // Function to load a stylesheet
    /**
     * @param {string} href
     * @returns {Promise<void>}
     */
    const loadStyle = (href) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`link[href="${href}"]`)) {
          resolve();
          return;
        }
        const link = document.createElement('link');
        link.href = href;
        link.rel = 'stylesheet';
        link.onload = ()=>resolve();
        link.onerror = ()=>reject();
        document.head.appendChild(link);
      });
    };

    /** @type {Window & typeof globalThis & { monaco?: any, require?: any }} */
    const win = window;

    // Ensure Monaco resources are loaded
    if (typeof win.monaco === 'undefined') {
      log('Loading Monaco Editor resources...');
      
      // Load Monaco loader
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs/loader.min.js');
      
      // Load Monaco CSS
      await loadStyle('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs/editor/editor.main.min.css');

      // Configure Monaco loader
      return new Promise((resolve, reject) => {
        win.require.config({
          paths: { 
            vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs' 
          } 
        });
        
        win.require(['vs/editor/editor.main'], () => {
          log('Monaco Editor loaded successfully');
          resolve(initEditor());
        }, reject);
      });
    }

    // If Monaco is already loaded, directly initialize
    return initEditor();

    // Editor initialization function
    async function initEditor() {
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

      // Navigate to /actions/ folder
      const actionsFolder = await directoryHandle.getDirectoryHandle('actions');
      
      // Construct full filename
      const fileName = `${actionName}.js`;

      // Try to get the specific file
      const selectedFile = await actionsFolder.getFileHandle(fileName);

      // Read the file
      const file = await selectedFile.getFile();
      const fileContent = await file.text();

      // Update title
      titleSpan.textContent = `Editing: ${fileName}`;

      // Create Monaco editor
      const editor = win.monaco.editor.create(monacoDiv, {
        value: fileContent,
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true
      });

      // Save functionality
      saveButton.onclick = async () => {
        // Get the current content from the editor
        const content = editor.getValue();

        // Create a writable stream
        const writable = await selectedFile.createWritable();
        
        // Write the content
        await writable.write(content);
        
        // Close the stream
        await writable.close();

        log(`File ${fileName} saved successfully!`);
      };

      log(`Opened file: ${fileName}`);
      return editor && "success";
    }
  },
  test_functions: []
};