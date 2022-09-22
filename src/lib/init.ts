import * as webnative from "webnative";
import { setup } from "webnative";
import type FileSystem from "webnative/fs/index";

import { SESSION_ERROR, type SESSION_STORE } from "../contexts/SessionContext";
import { getBackupStatus, type BackupStatus } from "../lib/auth/backup";

// TODO: Add a flag or script to turn debugging on/off
setup.debug({ enabled: false });

type Initialize = SESSION_STORE & {
  updateFilesystem: (fs: FileSystem | null) => void;
}

const initialize = async ({
  session,
  updateSession,
  updateFilesystem,
}: Initialize): Promise<void> => {
  try {
    let backupStatus: BackupStatus = null;

    const state: webnative.AppState = await webnative.app({ useWnfs: true });

    switch (state.scenario) {
      case webnative.AppScenario.NotAuthed:
        updateSession({
          username: '',
          authed: false,
          loading: false,
          backupCreated: false,
        });
        break;

      case webnative.AppScenario.Authed:
        backupStatus = await getBackupStatus(state.fs);

        updateSession({
          username: state.username,
          authed: state.authenticated,
          loading: false,
          backupCreated: !!backupStatus?.created,
        });

        updateFilesystem(state.fs as FileSystem);
        break;

      default:
        break;
    }
  } catch (error) {
    switch (error) {
      case webnative.InitialisationError.InsecureContext:
        updateSession({
          ...session,
          loading: false,
          error: SESSION_ERROR.INSECURE_CONTEXT,
        });
        break;

      case webnative.InitialisationError.UnsupportedBrowser:
        updateSession({
          ...session,
          loading: false,
          error: SESSION_ERROR.UNSUPORTED_CONTEXT,
        });
        break;
    }
  }
};

export default initialize;
