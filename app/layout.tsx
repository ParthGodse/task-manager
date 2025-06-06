import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
// import { supabase } from "@/lib/supabaseClient";
// import { createBrowserClient } from "@supabase/ssr";
// import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Personalize your task management experience with Task Manager",
};

// export function Providers({ children }: { children: React.ReactNode }) {
//   const [client] = useState(() =>
//     createBrowserClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//     )
//   );

//   return <SupabaseProvider client={client}>{children}</SupabaseProvider>;
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <Providers> */}
          {children}
          <Toaster />
        {/* </Providers> */}
      </body>
    </html>
  );
}
