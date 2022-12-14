import * as webnative from "webnative";
import { getRecoil, setRecoil } from "recoil-nexus";

import { sessionStore, filesystemStore } from "../stores";
import { SESSION_ERROR } from "../lib/session";
import { getBackupStatus, type BackupStatus } from "../lib/auth/backup";
import { USERNAME_STORAGE_KEY } from "../lib/auth/account";

export const NAMESPACE = { creator: "Fission", name: "WAT" };

const initialize = async (): Promise<void> => {
  try {
    let backupStatus: BackupStatus = null;

    const program: webnative.Program = await webnative.program({
      namespace: NAMESPACE,
      debug: process.env.NODE_ENV === "development",
    });

    if (program.session) {
      // Authed
      backupStatus = await getBackupStatus(program.session.fs)

      const fullUsername = (await program.components.storage.getItem(
        USERNAME_STORAGE_KEY
      )) as string;

      setRecoil(sessionStore, {
        username: {
          full: fullUsername,
          hashed: program.session.username,
          trimmed: fullUsername.split("#")[0],
        },
        session: program.session,
        authStrategy: program.auth,
        program,
        loading: false,
        backupCreated: backupStatus.created,
      });

      setRecoil(filesystemStore, program.session.fs);
    } else {
      // Not authed

      setRecoil(sessionStore, {
        username: null,
        session: null,
        authStrategy: program.auth,
        program,
        loading: false,
        backupCreated: null,
      });
    }
  } catch (error) {
    console.error(error)

    const session = getRecoil(sessionStore);

    switch (error) {
      case webnative.ProgramError.InsecureContext:
        setRecoil(sessionStore, {
          ...session,
          loading: false,
          error: SESSION_ERROR.INSECURE_CONTEXT,
        });
        break;

      case webnative.ProgramError.UnsupportedBrowser:
        setRecoil(sessionStore, {
          ...session,
          loading: false,
          error: SESSION_ERROR.UNSUPORTED_CONTEXT,
        });
        break;
    }
  }
};

export default initialize;
