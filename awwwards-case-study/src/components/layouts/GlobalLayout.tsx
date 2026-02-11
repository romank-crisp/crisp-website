"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ContactFormProvider } from "@/context/ContactFormContext";
import { BrandProvider } from "@/context/BrandContext";
import { BrandSwitcher } from "@/components/ui/BrandSwitcher";
import { ContactOverlay } from "@/components/forms/ContactOverlay";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer, FooterProps } from "@/components/layouts/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SmoothScroll } from "@/components/layouts/SmoothScroll";
import { MenuItem } from "@/content/navigation";

export function GlobalLayout({ children, footerData, navigationData }: { children: React.ReactNode, footerData: FooterProps['data'], navigationData: MenuItem[] }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    // Ensure cursor state is set correctly on initial mount
    useEffect(() => {
        // Force initial state check on client-side
        if (!isAdmin) {
            document.documentElement.classList.remove('system-cursor');
        }
    }, []);

    useEffect(() => {
        if (isAdmin) {
            document.documentElement.classList.add('system-cursor');
        } else {
            document.documentElement.classList.remove('system-cursor');
        }

        // Cleanup on unmount - always remove the class
        return () => {
            document.documentElement.classList.remove('system-cursor');
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
                <Navbar menuItems={navigationData} />
                <SmoothScroll>
                    {children}
                    <Footer data={footerData} />
                </SmoothScroll>
                <BrandSwitcher />
            </BrandProvider>
        </ContactFormProvider>
    );
}
