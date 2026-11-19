import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Akshay DMS",
  description: "Two-wheeler dealership management"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
