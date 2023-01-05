import type * as webnative from "webnative";

import { appName } from "../lib/app-info";

type USERNAME = {
  full: string;
  hashed: string;
  trimmed: string;
};

export type SESSION = {
  username: USERNAME;
  session: webnative.Session | null;
  authStrategy: webnative.AuthenticationStrategy | null;
  program: webnative.Program
  loading: boolean;
  backupCreated: boolean;
  error?: SESSION_ERROR;
};

export enum SESSION_ERROR {
  INSECURE_CONTEXT = "Insecure Context",
  UNSUPORTED_CONTEXT = "Unsupported Browser",
}

export type SESSION_STORE = {
  session: SESSION;
  updateSession: (session: SESSION) => void;
};

export const errorToMessage = (error: SESSION_ERROR): string => {
  switch (error) {
    case SESSION_ERROR.INSECURE_CONTEXT:
      return `${appName} requires a secure context (HTTPS)`;

    case SESSION_ERROR.UNSUPORTED_CONTEXT:
      return `Your browser does not support ${appName}`;
  }
};

export const initialSession: SESSION = {
  username: null,
  session: null,
  authStrategy: null,
  program: null,
  loading: true,
  backupCreated: false,
};
