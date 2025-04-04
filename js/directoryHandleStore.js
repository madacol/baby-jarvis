/**
 * Directory Handle Storage
 * 
 * This module provides functionality to save and retrieve a directory handle
 * using IndexedDB for persistence across sessions.
 * Falls back to Origin Private File System (OPFS) when File System Access API is not available.
 */

// Constants for IndexedDB
const DB_NAME = 'baby-jarvis-db';
const DB_VERSION = 1;
const STORE_NAME = 'app-settings';
const DIR_HANDLE_KEY = 'directoryHandle';
const USING_OPFS_KEY = 'usingOPFS';

// Flag to track if we're using OPFS as fallback
let isUsingOPFS = false;

/**
 * Open the IndexedDB database
 * @returns {Promise<IDBDatabase>} The database instance
 */
async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      const target = event.target;
      if (target instanceof IDBOpenDBRequest) {
        reject(target.error);
      } else {
        reject(new Error('Unknown IndexedDB error'));
      }
    };
    
    request.onsuccess = (event) => {
      const target = event.target;
      if (target instanceof IDBOpenDBRequest) {
        resolve(target.result);
      } else {
        reject(new Error('Unknown IndexedDB error'));
      }
    };
    
    request.onupgradeneeded = (event) => {
      const target = event.target;
      if (target instanceof IDBOpenDBRequest) {
        const db = target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      }
    };
  });
}

/**
 * Checks if the Origin Private File System (OPFS) is available
 * @returns {Promise<boolean>} Whether OPFS is available
 */
export async function isOPFSAvailable() {
  try {
    // Check if the navigator.storage.getDirectory() method exists
    return typeof navigator?.storage?.getDirectory === 'function';
  } catch (e) {
    return false;
  }
}

/**
 * Get the OPFS root directory handle
 * @returns {Promise<FileSystemDirectoryHandle>} The OPFS root directory handle
 */
export async function getOPFSRoot() {
  if (!await isOPFSAvailable()) {
    throw new Error('Origin Private File System is not available in this browser');
  }
  try {
    return await navigator.storage.getDirectory();
  } catch (error) {
    if (error.name === 'SecurityError') {
      throw new Error('OPFS is not available in this browser');
    }
    throw new Error('Failed to get OPFS root directory handle');
  }
}

/**
 * Creates a wrapper around OPFS that mimics the File System Access API
 * @returns {Promise<FileSystemDirectoryHandle>} An object with similar methods to FileSystemDirectoryHandle
 */
export async function createOPFSWrapper() {
  const root = await getOPFSRoot();
  
  // Create our app directory structure in OPFS
  let appRoot;
  try {
    appRoot = await root.getDirectoryHandle('baby-jarvis', { create: true });
  } catch (error) {
    console.error('Failed to create baby-jarvis directory in OPFS:', error);
    throw error;
  }
  
  // Store that we're using OPFS
  const db = await openDatabase();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  await new Promise((resolve, reject) => {
    const request = store.put(true, USING_OPFS_KEY);
    request.onsuccess = resolve;
    request.onerror = reject;
  });
  
  isUsingOPFS = true;
  return appRoot;
}

/**
 * Save the directory handle to IndexedDB
 * @param {FileSystemDirectoryHandle} handle - The directory handle to save
 * @returns {Promise<void>}
 */
export async function saveDirectoryHandle(handle) {
  try {
    // If we're using OPFS, we don't need to request permission
    if (!isUsingOPFS && handle.requestPermission) {
      const permission = await handle.requestPermission({ mode: 'readwrite' });
      if (permission !== 'granted') {
        return;
      }
    }
    
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.put(handle, DIR_HANDLE_KEY);
      
      request.onerror = (event) => {
        const target = event.target;
        if (target instanceof IDBRequest) {
          reject(target.error);
        } else {
          reject(new Error('Unknown IndexedDB error'));
        }
      };
      
      request.onsuccess = () => {
        resolve();
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Retrieve the directory handle from IndexedDB
 * @returns {Promise<FileSystemDirectoryHandle|null>} The saved directory handle or null if not found
 */
export async function getSavedDirectoryHandle() {
  try {
    const db = await openDatabase();
    
    // Check if we're using OPFS
    const isUsingOPFSStored = await new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(USING_OPFS_KEY);
      
      request.onsuccess = (event) => {
        const target = event.target;
        if (target instanceof IDBRequest) {
          resolve(target.result || false);
        } else {
          resolve(false);
        }
      };
      
      request.onerror = () => resolve(false);
    });
    
    if (isUsingOPFSStored) {
      isUsingOPFS = true;
      // If we're using OPFS, get the root OPFS directory
      return await getOPFSRoot().then(root => 
        root.getDirectoryHandle('baby-jarvis', { create: false })
      ).catch(() => null);
    }
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.get(DIR_HANDLE_KEY);
      
      request.onerror = (event) => {
        const target = event.target;
        if (target instanceof IDBRequest) {
          reject(target.error);
        } else {
          reject(new Error('Unknown IndexedDB error'));
        }
      };
      
      request.onsuccess = (event) => {
        const target = event.target;
        if (target instanceof IDBRequest) {
          resolve(target.result || null);
        } else {
          resolve(null);
        }
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    return null;
  }
}

/**
 * Copy default actions to selected directory if they don't exist
 * @param {FileSystemDirectoryHandle} directoryHandle - The selected directory handle
 * @returns {Promise<void>}
 */
export async function ensureDefaultActionsExist(directoryHandle) {
  // Create the actions directory if it doesn't exist
  let actionsHandle;
  try {
    actionsHandle = await directoryHandle.getDirectoryHandle('actions', { create: true });
  } catch (error) {
    console.error('Error creating actions directory:', error);
    return;
  }
  
  // Define default action files with their paths
  const defaultActions = [
    'createAction.js',
    'updateAction.js',
    'readAction.js',
    'runJavascript.js',
    'openActionEditor.js',
  ]

  // For each default action, check if it exists in the selected directory
  for (const actionFile of defaultActions) {
    
    // Check if the action file exists in the selected directory
    try {
      await actionsHandle.getFileHandle(actionFile);
      // If the action exists, do nothing
      continue;
    } catch (error) {
      // If the action doesn't exist, fetch it and write it to the selected directory
      // Fetch the source code of the action
      const response = await fetch(`./js/defaultActions/actions/${actionFile}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${actionFile}`);
      }
      const sourceCode = await response.text();
      
      // Create the file in the selected directory with the source code
      const fileHandle = await actionsHandle.getFileHandle(actionFile, { create: true });
      const writable = await fileHandle.createWritable();
      
      await writable.write(sourceCode);
      await writable.close();
      
      console.log(`Created ${actionFile} in the selected directory`);
    }
  }
}

/**
 * Initialize the directory handle from IndexedDB or ask user to select one
 * Falls back to OPFS if File System Access API is not available
 * @param {boolean} forceSelect - Force the user to select a directory even if one is saved
 * @returns {Promise<FileSystemDirectoryHandle>} The directory handle
 */
export async function initializeDirectoryHandle(forceSelect = false) {
  // First check if File System Access API is supported
  const hasFileSystemAccess = 'showDirectoryPicker' in window;
  const hasOPFS = await isOPFSAvailable();
  
  // If neither API is available, throw an error
  if (!hasFileSystemAccess && !hasOPFS) {
    throw new Error('Neither File System Access API nor Origin Private File System are supported in this browser');
  }
  
  // If forceSelect is false, try to get the saved directory handle
  if (!forceSelect) {
    // Try to get the saved directory handle
    const savedHandle = await getSavedDirectoryHandle();
    
    if (savedHandle) {
      try {
        if (!isUsingOPFS && savedHandle.requestPermission) {
          // Verify the handle is still valid (this will throw if permission is revoked)
          await savedHandle.requestPermission({ mode: 'readwrite' });
        }
        await ensureDefaultActionsExist(savedHandle);
        return savedHandle;
      } catch (error) {
        // Permission revoked or handle invalid, we'll get a new one
      }
    }
  }
  
  let directoryHandle;
  
  // If File System Access API is available and we're not already using OPFS, use it
  if (hasFileSystemAccess && !isUsingOPFS) {
    directoryHandle = await window.showDirectoryPicker();
  } 
  // Otherwise fall back to OPFS
  else if (hasOPFS) {
    console.log('Using Origin Private File System as fallback');
    directoryHandle = await createOPFSWrapper();
  }
  else {
    throw new Error('Neither File System Access API nor Origin Private File System are supported in this browser');
  }
  
  // Save the new handle to IndexedDB
  await saveDirectoryHandle(directoryHandle);
  
  // Ensure default actions exist in the selected directory
  await ensureDefaultActionsExist(directoryHandle);
  
  return directoryHandle;
} 