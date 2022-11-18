import * as webnative from 'webnative';
import { getRecoil } from "recoil-nexus";
import type FileSystem from "webnative/fs/index";

import { filesystemStore } from '../../stores';

export type BackupStatus = { created: boolean } | null;

export const setBackupStatus = async (
  status: BackupStatus
): Promise<void> => {
  const fs = getRecoil(filesystemStore);
  const backupStatusPath = webnative.path.file('private', 'backup-status.json');
  await fs.write(
    backupStatusPath,
    new TextEncoder().encode(JSON.stringify(status))
  );

  await fs?.publish();
};

export const getBackupStatus = async (fs: FileSystem): Promise<BackupStatus> => {
  const backupStatusPath = webnative.path.file('private', 'backup-status.json');

  if (await fs?.exists(backupStatusPath)) {
    const fileContent = await fs?.read(backupStatusPath);

    try {
      return JSON.parse(new TextDecoder().decode(fileContent)) as BackupStatus;
    } catch (err) {
      console.warn(`Unable to load backup status: ${err.message || err}`);
    }

    return { created: false };
  } else {
    return { created: false };
  }
};
