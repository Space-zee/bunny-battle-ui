"use client";
import "../styles/globals.scss";
import "../styles/theme-config.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import React from "react";

import { Notification } from "../components";
import { useAtom } from "jotai";
import * as coreModels from "../core/models";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notification, setNotification] = useAtom(coreModels.$notification);
  const [WebApp] = useAtom(coreModels.$webApp);
  const onNotification = (value: boolean) => {
    setNotification({ ...notification, isOpen: value });
  };

  return (
    <html lang="en">
      <body style={{ background: "#000" }}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <Notification
          WebApp={WebApp}
          titleIcon={notification.titleIcon}
          title={notification.title}
          description={notification.description}
          isOpen={notification.isOpen}
          onOpen={onNotification}
          onClickOutside={() => onNotification(false)}
        />
        <Theme appearance="dark">{children}</Theme>
      </body>
    </html>
  );
}
