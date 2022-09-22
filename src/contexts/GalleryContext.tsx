import { createContext, useState, type ReactNode } from 'react';

export enum AREAS {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export type Image = {
  cid: string;
  ctime: number;
  name: string;
  private: boolean;
  size: number;
  src: string;
};

export type GALLERY = {
  publicImages: Image[];
  privateImages: Image[];
  selectedArea: AREAS;
  loading: boolean;
};

export const GALLERY_DIRS: {
  [key: string]: string[];
} = {
  [AREAS.PUBLIC]: ["public", "gallery"],
  [AREAS.PRIVATE]: ["private", "gallery"],
};

const initialGallery: GALLERY = {
  loading: true,
  publicImages: [],
  privateImages: [],
  selectedArea: AREAS.PUBLIC,
};

// Create Gallery Context
const GalleryContext = createContext({
  gallery: initialGallery,
  updateGallery: (gallery: GALLERY) => {},
});

export default GalleryContext;

// Create Gallery Provider
export function GalleryProvider({ children }: { children: ReactNode }) {
  const [gallery, setGallery] = useState(initialGallery);

  const updateGallery = (updatedGallery: GALLERY): void => {
    setGallery(updatedGallery);
  };

  return (
    <GalleryContext.Provider value={{ gallery, updateGallery }}>
      {children}
    </GalleryContext.Provider>
  );
};
