import { atom } from "recoil";

import { type GALLERY } from "./lib/gallery";

export enum AREAS {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

const initialGallery: GALLERY = {
  loading: true,
  publicImages: [],
  privateImages: [],
  selectedArea: AREAS.PUBLIC,
};

export const galleryStore = atom({
  key: "gallery",
  default: initialGallery as GALLERY,
  dangerouslyAllowMutability: true,
});
