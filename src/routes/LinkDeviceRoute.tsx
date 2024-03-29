import * as odd from "@oddjs/odd";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { addNotification } from "../lib/notifications";
import { createAccountLinkingConsumer } from "../lib/auth/linking";
import { loadAccount } from "../lib/auth/account";
import type { LinkDeviceView } from "../lib/views";
import FilesystemActivity from "../components/common/FilesystemActivity";
import LinkDevice from "../components/auth/link-device/LinkDevice";

const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};

let accountLinkingConsumer: odd.AccountLinkingConsumer;

const LinkDeviceRoute = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<LinkDeviceView>("link-device");
  const [displayPin, setDisplayPin] = useState<string>("");
  // const [accountLinkingConsumer, setAccountLinkingConsumer] =
  //   useState<account.AccountLinkingConsumer>();

  const query = useQuery();
  const hashedUsername = query.get('hashedUsername') as string;
  const fullUsername = decodeURIComponent(
    query.get('username') as string
  );

  const initAccountLinkingConsumer = async () => {
    const accountLinkingConsumer = await createAccountLinkingConsumer(hashedUsername);
    // setAccountLinkingConsumer(updatedAccountLinkingConsumer)

    accountLinkingConsumer?.on("challenge", ({ pin }) => {
      setDisplayPin(pin.join(""));
    });

    accountLinkingConsumer?.on("link", async ({ approved }) => {
      if (approved) {
        setView("load-filesystem");

        await loadAccount(hashedUsername, fullUsername);

        addNotification({ msg: "You're now connected!", type: "success" });
        navigate("/");
      } else {
        addNotification({
          msg: "The connection attempt was cancelled",
          type: "info",
        });
        navigate("/");
      }
    });
  };

  const cancelConnection = async () => {
    addNotification({
      msg: "The connection attempt was cancelled",
      type: "info",
    });

    accountLinkingConsumer?.cancel();
    navigate("/");
  };

  const useMountEffect = () =>
    useEffect(() => {
      initAccountLinkingConsumer();
    }, []);

  useMountEffect();

  return (
    <>
      <input
        type="checkbox"
        id="my-modal-5"
        defaultChecked
        className="modal-toggle"
      />

      {view === "link-device" && (
        <LinkDevice pin={displayPin} cancelConnection={cancelConnection} />
      )}
      {view === "load-filesystem" && <FilesystemActivity activity="Loading" />}
    </>
  );
};

export default LinkDeviceRoute;
