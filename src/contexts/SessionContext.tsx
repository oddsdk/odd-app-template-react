import { createContext, useState, type ReactNode } from 'react';
import { appName } from "../lib/app-info";

export type SESSION = {
  username: string;
  authed: boolean;
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

const initialSession: SESSION = {
  username: '',
  authed: false,
  loading: true,
  backupCreated: false,
}

// Create Session Context
const SessionContext = createContext({
  session: initialSession,
  updateSession: (session: SESSION) => {},
});

export default SessionContext;

// Create Session Provider
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(initialSession);

  const updateSession = (updatedSession: SESSION): void => {
    setSession(updatedSession);
  };

  return (
    <SessionContext.Provider value={{ session, updateSession }}>
      {children}
    </SessionContext.Provider>
  );
};
