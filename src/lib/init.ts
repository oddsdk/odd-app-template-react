import * as odd from "@oddjs/odd";
import { getRecoil, setRecoil } from "recoil-nexus";

import { sessionStore, filesystemStore } from "../stores";
import { SESSION_ERROR } from "../lib/session";
import { getBackupStatus, type BackupStatus } from "../lib/auth/backup";
import { USERNAME_STORAGE_KEY, createDID } from "../lib/auth/account";
import { oddNamespace } from "../lib/app-info";

const initialize = async (): Promise<void> => {
  try {
    let backupStatus: BackupStatus = null;

    const program: odd.Program = await odd.program({
      namespace: oddNamespace,
      debug: process.env.NODE_ENV === "development",
    });

    if (program.session) {
      // Authed
      backupStatus = await getBackupStatus(program.session.fs);

      let fullUsername = (await program.components.storage.getItem(
        USERNAME_STORAGE_KEY
      )) as string;

      // If the user is migrating from a version odd-app-template before https://github.com/oddsdk/odd-app-template/pull/97/files#diff-a180510e798b8f833ebfdbe691c5ec4a1095076980d3e2388de29c849b2b8361R44,
      // their username won't contain a did, so we will need to manually append a DID and add it storage here
      if (!fullUsername) {
        const did = await createDID(program.components.crypto);
        fullUsername = `${program.session.username}#${did}`;
        await program.components.storage.setItem(
          USERNAME_STORAGE_KEY,
          fullUsername
        );
        window.location.reload();
      }

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
      case odd.ProgramError.InsecureContext:
        setRecoil(sessionStore, {
          ...session,
          loading: false,
          error: SESSION_ERROR.INSECURE_CONTEXT,
        });
        break;

      case odd.ProgramError.UnsupportedBrowser:
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
