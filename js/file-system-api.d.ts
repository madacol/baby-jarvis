// Type definitions for File System Access API
interface Window {
  showDirectoryPicker(options: {mode: 'readwrite'}): Promise<FileSystemDirectoryHandle>;
}

// Add PermissionState type
type PermissionState = 'granted' | 'denied' | 'prompt';

interface FileSystemDirectoryHandle {
  getDirectoryHandle(name: string): Promise<FileSystemDirectoryHandle>;
  getFileHandle(name: string): Promise<FileSystemFileHandle>;
  values(): AsyncIterable<FileSystemHandle>;
  requestPermission(options: { mode: 'readwrite' }): Promise<PermissionState>;
}

interface FileSystemFileHandle {
  getFile(): Promise<File>;
}

interface FileSystemHandle {
  kind: 'file' | 'directory';
  name: string;
}