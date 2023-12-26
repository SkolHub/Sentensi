import type { Metadata } from "next";
import "../ui/globals.scss";
import {ReactNode} from "react";

export const metadata: Metadata = {
  title: "Sentensi",
  description: "Sentensi",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
