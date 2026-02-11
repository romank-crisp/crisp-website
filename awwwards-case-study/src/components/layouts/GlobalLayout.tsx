"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ContactFormProvider } from "@/context/ContactFormContext";
import { BrandProvider } from "@/context/BrandContext";
import { BrandSwitcher } from "@/components/ui/BrandSwitcher";
import { ContactOverlay } from "@/components/forms/ContactOverlay";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SmoothScroll } from "@/components/layouts/SmoothScroll";

export function GlobalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    useEffect(() => {
        if (isAdmin) {
            document.documentElement.classList.add('system-cursor');
        } else {
            document.documentElement.classList.remove('system-cursor');
        }

        // Cleanup on unmount or navigation
        return () => {
            // We can optionally clean up here, though Next.js navigation might handle it
            // but specifically we want to ensure it's removed if we leave admin
            if (isAdmin) {
                document.documentElement.classList.remove('system-cursor');
            }
        };
    }, [isAdmin]);

    if (isAdmin) {
        return (
            <ContactFormProvider>
                <BrandProvider>
                    {children}
                </BrandProvider>
            </ContactFormProvider>
        );
    }

    return (
        <ContactFormProvider>
            <BrandProvider>
                <CustomCursor />
                <ContactOverlay />
                <Navbar />
                <SmoothScroll>
                    {children}
                    <Footer />
                </SmoothScroll>
                <BrandSwitcher />
            </BrandProvider>
        </ContactFormProvider>
    );
}
