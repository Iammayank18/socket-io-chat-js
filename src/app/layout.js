import { ReactNode } from "react";
import AppWrappers from "./AppWrapper";
import "./globals.css";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body id={"root"}>
        <AppWrappers>{children}</AppWrappers>
        <Script src="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js"></Script>
      </body>
    </html>
  );
}
