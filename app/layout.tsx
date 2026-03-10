import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import type { Metadata } from "next";
import AutoRefresh from "@/components/AutoRefresh";

export const metadata: Metadata = {
  title: "Resource Management",
  description: "Resource Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>
      <body className="bg-light">
        <AutoRefresh />
        {children}
      </body>
    </html>
  );
}
