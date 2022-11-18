import * as webnative from 'webnative';
import { getRecoil, setRecoil } from "recoil-nexus";
import type FileSystem from "webnative/fs/index";

import { filesystemStore, sessionStore } from "../../stores";
import { AREAS } from "../../routes/gallery/stores";
import { GALLERY_DIRS } from "../../routes/gallery/lib/gallery"
import { ACCOUNT_SETTINGS_DIR } from '../account-settings';
import { asyncDebounce } from '../utils';
import { getBackupStatus } from './backup';

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

export const debouncedIsUsernameAvailable = asyncDebounce(isUsernameAvailable, 300);

/**
 * Create additional directories and files needed by the app
 *
 * @param fs FileSystem
 */
const initializeFilesystem = async (fs: FileSystem): Promise<void> => {
  await fs.mkdir(webnative.path.directory(...GALLERY_DIRS[ AREAS.PUBLIC ]))
  await fs.mkdir(webnative.path.directory(...GALLERY_DIRS[ AREAS.PRIVATE ]))
  await fs.mkdir(webnative.path.directory(...ACCOUNT_SETTINGS_DIR))
}

export const register = async (
  username: string,
): Promise<boolean> => {
  const originalSession = getRecoil(sessionStore);
  const authStrategy = originalSession.authStrategy;
  const { success } = await authStrategy.register({ username });

  if (!success) return success;

  const session = await authStrategy.session();
  setRecoil(filesystemStore, session.fs);

  // TODO Remove if only public and private directories are needed
  await initializeFilesystem(session.fs);

  setRecoil(sessionStore, {
    ...originalSession,
    username,
    session,
  });

  return success;
};

export const loadAccount = async (username:string): Promise<void> => {
  const originalSession = getRecoil(sessionStore);
  const session = await originalSession.authStrategy.session();

  setRecoil(filesystemStore, session.fs);

  const backupStatus = await getBackupStatus(session.fs);

  setRecoil(sessionStore, {
    ...originalSession,
    username,
    session,
    backupCreated: !!backupStatus?.created,
  });
};
