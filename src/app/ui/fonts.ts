import { Geist, Geist_Mono, IBM_Plex_Sans, Inconsolata } from "next/font/google";

export const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });
  
export const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
  });
  
export const ibmPlexSans = IBM_Plex_Sans({
    variable: "--font-ibm-plex-sans",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
  });

export const inconsolata = Inconsolata({
    variable: "--font-inconsolata",
    subsets: ['latin'],
    weight: ['400']    
})
  