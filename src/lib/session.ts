import { appName } from '../lib/app-info';

export type SESSION = {
  username: string;
  authed: boolean;
  loading: boolean;
  backupCreated: boolean;
  error?: SESSION_ERROR;
};

export enum SESSION_ERROR {
  INSECURE_CONTEXT = 'Insecure Context',
  UNSUPORTED_CONTEXT = 'Unsupported Browser',
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
  username: '',
  authed: false,
  loading: true,
  backupCreated: false,
};
