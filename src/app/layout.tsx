import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Construction Material Tracker",
  description: "Track construction materials with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}