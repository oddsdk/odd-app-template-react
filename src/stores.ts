import { atom } from "recoil";
import type FileSystem from "webnative/fs/index";

import type { AccountSettings } from "./lib/account-settings";
import type { Notification } from "./lib/notifications";
import { initialSession, type SESSION } from "./lib/session";
import { loadTheme, type THEME } from "./lib/theme";

export const filesystemStore = atom({
  key: "filesystem",
  default: null as FileSystem | null,
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

export const accountSettingsStore = atom({
  key: "accountSettings",
  default: {
    avatar: null,
    loading: true,
  } as AccountSettings,
});
