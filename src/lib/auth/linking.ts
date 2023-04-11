import type * as odd from "@oddjs/odd";
import { getRecoil } from "recoil-nexus";

import { sessionStore } from "../../stores";

export const createAccountLinkingConsumer = async (
  username: string
): Promise<odd.AccountLinkingConsumer> => {
  const session = getRecoil(sessionStore)
  if (session.authStrategy) return session.authStrategy.accountConsumer(username);

  // Wait for program to be initialised
  return new Promise(function (resolve) {
    (function waitForAuthStrategy() {
      const updatedSession = getRecoil(sessionStore);
      if (updatedSession.authStrategy) {
        return resolve(updatedSession.authStrategy.accountConsumer(username));
      }

      setTimeout(waitForAuthStrategy, 30);
    })();
  });
};

export const createAccountLinkingProducer = async (
  username: string
): Promise<odd.AccountLinkingProducer> => {
  const session = getRecoil(sessionStore);
  return session.authStrategy.accountProducer(username);
};
