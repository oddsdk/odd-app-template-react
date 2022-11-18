import * as webnative from "webnative";
import { getRecoil, setRecoil } from "recoil-nexus";

import { sessionStore, filesystemStore } from "../stores";
import { SESSION_ERROR } from "../lib/session";
import { getBackupStatus, type BackupStatus } from "../lib/auth/backup";


const initialize = async (): Promise<void> => {
  try {
    let backupStatus: BackupStatus = null;

    const program: webnative.Program = await webnative.program({
      tag: { creator: "Fission", name: "WAT" },
      debug: false, // TODO: Add a flag or script to turn debugging on/off
    });

    if (program.session) {
      // Authed
      backupStatus = await getBackupStatus(program.session.fs)

      setRecoil(sessionStore, {
        username: program.session.username,
        session: program.session,
        authStrategy: program.auth,
        loading: false,
        backupCreated: backupStatus.created,
      });

      setRecoil(filesystemStore, program.session.fs);
    } else {
      // Not authed

      setRecoil(sessionStore, {
        username: "",
        session: null,
        authStrategy: program.auth,
        loading: false,
        backupCreated: null,
      });
    }
  } catch (error) {

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
