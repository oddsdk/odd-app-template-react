import * as uint8arrays from "uint8arrays";
import * as webnative from "webnative";
import type FileSystem from "webnative/fs/index";
import { sha256 } from "webnative/components/crypto/implementation/browser";
import { publicKeyToDid } from "webnative/did/transformers";
import type { Crypto } from "webnative";
import { getRecoil, setRecoil } from "recoil-nexus";

import { filesystemStore, sessionStore } from "../../stores";
import { AREAS } from "../../routes/gallery/stores";
import { GALLERY_DIRS } from "../../routes/gallery/lib/gallery";
import { ACCOUNT_SETTINGS_DIR } from "../account-settings";
import { asyncDebounce } from "../utils";
import { getBackupStatus } from "./backup";

export const USERNAME_STORAGE_KEY = "fullUsername";

export enum RECOVERY_STATES {
  Ready,
  Processing,
  Error,
  Done,
}

export const isUsernameValid = async (username: string): Promise<boolean> => {
  const session = getRecoil(sessionStore);
  return session.authStrategy.isUsernameValid(username);
};

export const isUsernameAvailable = async (
  username: string
): Promise<boolean> => {
  const session = getRecoil(sessionStore);
  return session.authStrategy.isUsernameAvailable(username);
};

export const debouncedIsUsernameAvailable = asyncDebounce(
  isUsernameAvailable,
  300
);

/**
 * Create additional directories and files needed by the app
 *
 * @param fs FileSystem
 */
const initializeFilesystem = async (fs: FileSystem): Promise<void> => {
  await fs.mkdir(webnative.path.directory(...GALLERY_DIRS[AREAS.PUBLIC]));
  await fs.mkdir(webnative.path.directory(...GALLERY_DIRS[AREAS.PRIVATE]));
  await fs.mkdir(webnative.path.directory(...ACCOUNT_SETTINGS_DIR));
};

export const createDID = async (
  crypto: Crypto.Implementation
): Promise<string> => {
  const pubKey = await crypto.keystore.publicExchangeKey();
  const ksAlg = await crypto.keystore.getAlgorithm();

  return publicKeyToDid(crypto, pubKey, ksAlg);
};

export const prepareUsername = async (username: string): Promise<string> => {
  const normalizedUsername = username.normalize("NFD");
  const hashedUsername = await sha256(
    new TextEncoder().encode(normalizedUsername)
  );

  return uint8arrays.toString(hashedUsername, "base32").slice(0, 32);
};

export const register = async (hashedUsername: string): Promise<boolean> => {
  const originalSession = getRecoil(sessionStore);
  const {
    authStrategy,
    program: {
      components: { storage },
    },
  } = originalSession;
  const { success } = await authStrategy.register({ username: hashedUsername });

  if (!success) return success;

  const session = await authStrategy.session();
  setRecoil(filesystemStore, session.fs);

  // TODO Remove if only public and private directories are needed
  await initializeFilesystem(session.fs);

  const fullUsername = (await storage.getItem(
    USERNAME_STORAGE_KEY
  )) as string;


  setRecoil(sessionStore, {
    ...originalSession,
    username: {
      full: fullUsername,
      hashed: hashedUsername,
      trimmed: fullUsername.split("#")[0],
    },
    session,
  });

  return success;
};

export const loadAccount = async (
  hashedUsername: string,
  fullUsername: string
): Promise<void> => {
  const originalSession = getRecoil(sessionStore);
  const {
    authStrategy,
    program: {
      components: { storage },
    },
  } = originalSession;
  const session = await authStrategy.session();

  setRecoil(filesystemStore, session.fs);

  const backupStatus = await getBackupStatus(session.fs);

  await storage.setItem(USERNAME_STORAGE_KEY, fullUsername);

  setRecoil(sessionStore, {
    ...originalSession,
    username: {
      full: fullUsername,
      hashed: hashedUsername,
      trimmed: fullUsername.split("#")[0],
    },
    session,
    backupCreated: !!backupStatus?.created,
  });
};
