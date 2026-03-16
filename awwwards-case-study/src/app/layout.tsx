import type { Metadata, Viewport } from "next";


import Script from "next/script";
import { Staatliches, DM_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layouts/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Footer } from "@/components/layouts/Footer";
import { CookieConsent } from "@/components/ui/CookieConsent";

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
  title: "Crisp Studio",
  description: "Award-winning creative studio specialising in brand identity, web design and product visualisation.",
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

import { GlobalLayout } from "@/components/layouts/GlobalLayout";
import { readContent } from "@/lib/content";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const footerData = await readContent("footer.json");
  const navigationData = await readContent("navigation.json");

  return (
    <html lang="en" className={`${staatliches.variable} ${dmSans.variable}`}>
      <body
        className="antialiased bg-white text-black"
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4376JFKLDT"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Default consent to denied
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied'
            });

            gtag('js', new Date());

            gtag('config', 'G-4376JFKLDT');
          `}
        </Script>
        <GlobalLayout footerData={footerData} navigationData={navigationData}>
          <OrganizationSchema />
          {children}
          <CookieConsent />
        </GlobalLayout>
      </body>
    </html>
  );
}
