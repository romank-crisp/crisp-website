import type { Metadata } from "next";
import { Staatliches, DM_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layouts/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Footer } from "@/components/layouts/Footer";

const staatliches = Staatliches({
  weight: "400",
  variable: "--font-staatliches",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "CentroGreen Case Study",
  description: "Brand identity, Website and Product Visualization",
};

import { ContactFormProvider } from "@/context/ContactFormContext";
import { ContactOverlay } from "@/components/forms/ContactOverlay";
import { Navbar } from "@/components/layouts/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${staatliches.variable} ${dmSans.variable}`}>
      <body
        className="antialiased bg-white text-black"
      >
        <ContactFormProvider>
          <CustomCursor />
          <ContactOverlay />
          <Navbar />
          <SmoothScroll>
            {children}
            <Footer />
          </SmoothScroll>
        </ContactFormProvider>
      </body>
    </html>
  );
}
