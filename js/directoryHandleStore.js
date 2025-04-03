/**
 * Directory Handle Storage
 * 
 * This module provides functionality to save and retrieve a directory handle
 * using IndexedDB for persistence across sessions.
 */

// Constants for IndexedDB
const DB_NAME = 'baby-jarvis-db';
const DB_VERSION = 1;
const STORE_NAME = 'app-settings';
const DIR_HANDLE_KEY = 'directoryHandle';

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
 * Save the directory handle to IndexedDB
 * @param {FileSystemDirectoryHandle} handle - The directory handle to save
 * @returns {Promise<void>}
 */
export async function saveDirectoryHandle(handle) {
  try {
    // Get permission to persist the handle
    // @ts-ignore - requestPermission exists on FileSystemHandle but TypeScript doesn't know about it
    if (handle.requestPermission) {
      // @ts-ignore - TypeScript doesn't know about this method
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
    'createActions.js',
    'modifyAction.js',
    'readAction.js',
    'runJs.js',
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
      const response = await fetch(`/js/defaultActions/actions/${actionFile}`);
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
 * @param {boolean} forceSelect - Force the user to select a directory even if one is saved
 * @returns {Promise<FileSystemDirectoryHandle>} The directory handle
 */
export async function initializeDirectoryHandle(forceSelect = false) {
  // Check if File System Access API is supported
  if (!('showDirectoryPicker' in window)) {
    throw new Error('File System Access API not supported in this browser');
  }

  let directoryHandle;

  // If forceSelect is true or no directoryHandle is available, ask user to select one
  if (forceSelect) {
    // Ask user to select a directory
    directoryHandle = await window.showDirectoryPicker();
    
    // Save the new handle to IndexedDB
    await saveDirectoryHandle(directoryHandle);
    
    // Ensure default actions exist in the selected directory
    await ensureDefaultActionsExist(directoryHandle);
    
    return directoryHandle;
  }

  // Try to get the saved directory handle
  const savedHandle = await getSavedDirectoryHandle();
  
  if (savedHandle) {
    try {
      // Verify the handle is still valid (this will throw if permission is revoked)
      // @ts-ignore - TypeScript doesn't know about this method
      await savedHandle.requestPermission({ mode: 'readwrite' });
      return savedHandle;
    } catch (error) {
      // Permission revoked or handle invalid, we'll get a new one
    }
  }
  
  // If we get here, we need to ask for a new directory
  directoryHandle = await window.showDirectoryPicker();
  
  // Save the new handle to IndexedDB
  await saveDirectoryHandle(directoryHandle);
  
  // Ensure default actions exist in the selected directory
  await ensureDefaultActionsExist(directoryHandle);
  
  return directoryHandle;
} 