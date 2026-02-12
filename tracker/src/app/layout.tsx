import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "AI Resolution Tracker",
  description: "Track progress through the 10-weekend AI Resolution Program",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-24 py-8">
              <Breadcrumb />
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
