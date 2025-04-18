export default /** @type {defineAction} */ (x=>x)({
  name: "editAction",
  description: "Opens the editor for a specific action file in the actions folder.",
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
  permissions: {
    autoExecute: true,
    autoContinue: false,
    useFileSystem: true,
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

      // Load Monaco loader and CSS in parallel
      await Promise.all([
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/loader.min.js'),
        loadStyle('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/editor/editor.main.min.css')
      ]);

      // Configure Monaco loader
      return new Promise((resolve, reject) => {
        win.require.config({
          paths: { 
            vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs'
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

      // Create container div
      const containerDiv = document.createElement('div');
      containerDiv.style.display = 'flex';
      containerDiv.style.height = '100vh';
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

      // Create button container
      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '10px';
      headerDiv.appendChild(buttonContainer);

      // Create show diff button
      const diffButton = document.createElement('button');
      diffButton.textContent = 'Show Diff';
      diffButton.style.backgroundColor = '#2196F3';
      diffButton.style.color = 'white';
      diffButton.style.border = 'none';
      diffButton.style.padding = '10px 20px';
      diffButton.style.cursor = 'pointer';
      buttonContainer.appendChild(diffButton);

      // Create save button
      const saveButton = document.createElement('button');
      saveButton.textContent = 'Save';
      saveButton.style.backgroundColor = '#4CAF50';
      saveButton.style.color = 'white';
      saveButton.style.border = 'none';
      saveButton.style.padding = '10px 20px';
      saveButton.style.cursor = 'pointer';
      buttonContainer.appendChild(saveButton);

      // Create Monaco container
      const monacoDiv = document.createElement('div');
      monacoDiv.style.flexGrow = '1';
      monacoDiv.style.border = '1px solid grey';

      // Assemble container
      containerDiv.appendChild(headerDiv);
      containerDiv.appendChild(monacoDiv);

      // Navigate to /actions/ folder
      const actionsFolder = await directoryHandle.getDirectoryHandle('actions');
      
      // Construct full filename
      const fileName = `${actionName}.js`;

      // Try to get the specific file
      const selectedFile = await actionsFolder.getFileHandle(fileName);

      // Read the file
      const file = await selectedFile.getFile();
      const fileContent = await file.text();
      
      // Store original content for diff comparison
      let originalContent = fileContent;

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

        // Update original content after save
        originalContent = content;

        log(`File ${fileName} saved successfully!`);
      };

      // Diff view functionality
      diffButton.onclick = () => {
        // Create diff modal
        const diffModal = document.createElement('div');
        diffModal.style.position = 'fixed';
        diffModal.style.top = '0';
        diffModal.style.left = '0';
        diffModal.style.width = '100%';
        diffModal.style.height = '100%';
        diffModal.style.backgroundColor = 'rgba(0,0,0,0.7)';
        diffModal.style.zIndex = '1000';
        diffModal.style.display = 'flex';
        diffModal.style.flexDirection = 'column';
        
        // Create modal header
        const modalHeader = document.createElement('div');
        modalHeader.style.display = 'flex';
        modalHeader.style.justifyContent = 'space-between';
        modalHeader.style.padding = '10px';
        modalHeader.style.backgroundColor = '#333';
        modalHeader.style.color = 'white';
        
        // Create title
        const modalTitle = document.createElement('span');
        modalTitle.textContent = 'Diff View: Current vs Saved';
        modalHeader.appendChild(modalTitle);
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.backgroundColor = '#f44336';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.padding = '5px 10px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => document.body.removeChild(diffModal);
        modalHeader.appendChild(closeButton);
        
        // Create diff container
        const diffContainer = document.createElement('div');
        diffContainer.style.flex = '1';
        diffContainer.style.overflow = 'auto';
        
        // Assemble modal
        diffModal.appendChild(modalHeader);
        diffModal.appendChild(diffContainer);
        document.body.appendChild(diffModal);
        
        // Create models for diff editor
        const originalModel = win.monaco.editor.createModel(
          originalContent,
          'javascript'
        );
        
        const modifiedModel = win.monaco.editor.createModel(
          editor.getValue(),
          'javascript'
        );
        
        // Create diff editor
        const diffEditor = win.monaco.editor.createDiffEditor(
          diffContainer,
          {
            enableSplitViewResizing: true,
            renderSideBySide: true,
            readOnly: true,
            theme: 'vs-dark',
            automaticLayout: true
          }
        );
        
        // Set the models
        diffEditor.setModel({
          original: originalModel,
          modified: modifiedModel
        });
      };

      log(`Opened file: ${fileName}`);
      return containerDiv;
    }
  },
  test_functions: []
});