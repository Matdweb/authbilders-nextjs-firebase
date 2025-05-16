import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { geistSans, geistMono, ibmPlexSans } from '@/app/ui/fonts'
import { CountDownTimer } from "@/components/CountDownTimer";
import { verifySession } from "./lib/dal";
import { UserInfo } from "@/components/UserInfo";
import NavHeader from "@/components/NavHeader";
import SessionErrorToastHandler from "@/components/Handlers/SessionErrorToastHandler";

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
        <Providers>
          <section className="w-full flex min-h-screen flex-col justify-start px-6 pt-12 lg:px-8 bg-gradient-to-r from-[#12222b] to-[#0e0e0e]">
            <NavHeader />
            {children}
            {<SessionErrorToastHandler decoded={decoded} />}
            {<CountDownTimer data={decoded} />}
            {<UserInfo data={decoded} />}
          </section>
        </Providers>
      </body>
    </html >
  );
}