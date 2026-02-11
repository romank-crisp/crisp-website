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

import { GlobalLayout } from "@/components/layouts/GlobalLayout";
import { readContent } from "@/app/actions/content";

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
        <GlobalLayout footerData={footerData} navigationData={navigationData}>
          {children}
        </GlobalLayout>
      </body>
    </html >
  );
}
