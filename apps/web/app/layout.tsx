import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Akshay DMS | Dealership operations",
  description: "Manage two-wheeler inventory, customers, sales and service in one workspace."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
