import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body>

        {/* NAVBAR */}
        <div className="fixed top-0 left-0 w-full flex justify-between p-4 text-white z-50">
          <Link href="/">🏠 Home</Link>
          <Link href="/detect">🎯 Detect</Link>
        </div>

        <div className="pt-16">
          {children}
        </div>

      </body>
    </html>
  );
}