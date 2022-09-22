import { createContext, useState, type ReactNode } from 'react';
import type FileSystem from "webnative/fs/index";

type FILESYSTEM_CONTEXT = {
  fs: FileSystem | null;
  updateFilesystem: (filesystem: FileSystem | null) => void;
}

// Create Filesystem Context
const FilesystemContext = createContext<FILESYSTEM_CONTEXT>({
  fs: null,
  updateFilesystem: (filesystem) => {},
});

export default FilesystemContext;

// Create Filesystem Provider
export function FilesystemProvider({ children }: { children: ReactNode }) {
  const [filesystem, setFilesystem] = useState<FileSystem | null>(null);

  const updateFilesystem = (updatedFilesystem: FileSystem | null): void => {
    setFilesystem(updatedFilesystem);
  };

  return (
    <FilesystemContext.Provider value={{ fs: filesystem, updateFilesystem }}>
      {children}
    </FilesystemContext.Provider>
  );
}
