import { atom } from "recoil";
import type FileSystem from "webnative/fs/index";

import { initialGallery, type GALLERY } from "./lib/gallery";
import { type Notification } from "./lib/notifications";
import { initialSession, type SESSION } from "./lib/session";
import { loadTheme, type THEME } from "./lib/theme";

export const filesystemStore = atom({
  key: "filesystem",
  default: null as FileSystem | null,
});

export const galleryStore = atom({
  key: "gallery",
  default: initialGallery as GALLERY,
});

export const notificationStore = atom({
  key: "notifications",
  default: [] as Notification[],
});

export const sessionStore = atom({
  key: "session",
  default: initialSession as SESSION,
});

export const themeStore = atom({
  key: "theme",
  default: loadTheme() as THEME,
});
