import * as webnative from 'webnative';
import type FileSystem from 'webnative/fs/index';
import { getRecoil, setRecoil } from "recoil-nexus";

import { filesystemStore, sessionStore } from "../../stores";
import { asyncDebounce } from '../utils';
import { getBackupStatus } from './backup';
import { AREAS, GALLERY_DIRS } from '../../lib/gallery';

export const isUsernameValid = async (username: string): Promise<boolean> => {
  return webnative.account.isUsernameValid(username);
};

const debouncedIsUsernameAvailable = asyncDebounce(
  webnative.account.isUsernameAvailable,
  300
);

export const isUsernameAvailable = async (
  username: string
): Promise<boolean> => {
  return debouncedIsUsernameAvailable(username);
};

export const register = async (
  username: string,
): Promise<boolean> => {
  const session = getRecoil(sessionStore);
  const { success } = await webnative.account.register({ username });

  if (!success) return success;

  const fs = await webnative.bootstrapRootFileSystem();
  setRecoil(filesystemStore, fs);

  // TODO Remove if only public and private directories are needed
  await initializeFilesystem(fs);

  setRecoil(sessionStore, {
    ...session,
    username,
    authed: true,
  })

  return success;
};

/**
 * Create additional directories and files needed by the app
 *
 * @param fs FileSystem
 */
const initializeFilesystem = async (fs: FileSystem): Promise<void> => {
  await fs.mkdir(webnative.path.directory(...GALLERY_DIRS[AREAS.PUBLIC]));
  await fs.mkdir(webnative.path.directory(...GALLERY_DIRS[AREAS.PRIVATE]));
};

export const loadAccount = async (username:string): Promise<void> => {
  const session = getRecoil(sessionStore);
  await checkDataRoot(username);

  const fs = await webnative.loadRootFileSystem();
  setRecoil(filesystemStore, fs);

  const backupStatus = await getBackupStatus(fs);

  setRecoil(sessionStore, {
    ...session,
    username,
    authed: true,
    backupCreated: !!backupStatus?.created,
  });
};

const checkDataRoot = async (username: string): Promise<void> => {
  let dataRoot = await webnative.dataRoot.lookup(username);

  if (dataRoot) return;

  return new Promise((resolve) => {
    const maxRetries = 20;
    let attempt = 0;

    const dataRootInterval = setInterval(async () => {
      console.warn("Could not fetch filesystem data root. Retrying.");

      dataRoot = await webnative.dataRoot.lookup(username);

      if (!dataRoot && attempt < maxRetries) {
        attempt++;
        return;
      }

      clearInterval(dataRootInterval);
      resolve();
    }, 500);
  });
};
