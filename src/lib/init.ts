import * as webnative from "webnative";
import { setup } from "webnative";
import type FileSystem from "webnative/fs/index";
import { getRecoil, setRecoil } from "recoil-nexus";

import { sessionStore, filesystemStore } from "../stores";
import { SESSION_ERROR } from "../lib/session";
import { getBackupStatus, type BackupStatus } from "../lib/auth/backup";

// TODO: Add a flag or script to turn debugging on/off
setup.debug({ enabled: false });

const initialize = async (): Promise<void> => {
  try {
    let backupStatus: BackupStatus = null;

    const state: webnative.AppState = await webnative.app({ useWnfs: true });

    switch (state.scenario) {
      case webnative.AppScenario.NotAuthed:
        setRecoil(sessionStore, {
          username: "",
          authed: false,
          loading: false,
          backupCreated: false,
        });
        break;

      case webnative.AppScenario.Authed:
        backupStatus = await getBackupStatus(state.fs as FileSystem);

        setRecoil(sessionStore, {
          username: state.username,
          authed: state.authenticated,
          loading: false,
          backupCreated: !!backupStatus?.created,
        });

        setRecoil(filesystemStore, state.fs as FileSystem);
        break;

      default:
        break;
    }
  } catch (error) {

    const session = getRecoil(sessionStore);

    switch (error) {
      case webnative.InitialisationError.InsecureContext:
        setRecoil(sessionStore, {
          ...session,
          loading: false,
          error: SESSION_ERROR.INSECURE_CONTEXT,
        });
        break;

      case webnative.InitialisationError.UnsupportedBrowser:
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
