import type { Metadata } from "next";
import "../styles/globals.scss";
import "../styles/theme-config.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import React from "react";

export const metadata: Metadata = {
  title: "Mini app",
  description: "Mini app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#000" }}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <Theme appearance="dark">{children}</Theme>
      </body>
    </html>
  );
}
