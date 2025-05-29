import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { geistSans, geistMono, ibmPlexSans } from '@/app/ui/fonts'
import { CountDownTimer } from "@/components/(AuthBilders)/CountDownTimer";
import { verifySession } from "./lib/(AuthBilders)/dal";
import { UserInfo } from "@/components/(AuthBilders)/UserInfo";
import NavHeader from "@/components/(AuthBilders)/NavHeader";
import SessionErrorToastHandler from "@/components/(AuthBilders)/Handlers/SessionErrorToastHandler";
import { AuthBilders } from "./AuthBilders";

export const metadata: Metadata = {
  title: "AuthBilders | Firabse",
  description: "Authentiaction system created using AuthBilders.dev",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const decoded = await verifySession();

  return (
    <html lang="en" className='dark'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexSans.variable} antialiased`}
      >
        <AuthBilders>
          <section className="w-full flex min-h-screen flex-col justify-start bg-gradient-to-r from-[#12222b] to-[#0e0e0e]">
            <NavHeader />
            {children}
          </section>
        </AuthBilders>
      </body>
    </html >
  );
}