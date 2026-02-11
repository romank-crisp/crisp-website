"use client";

import { NavbarDesktop } from "./NavbarDesktop";
import { NavbarMobile } from "./NavbarMobile";
import { MenuItem } from "@/content/navigation";

interface NavbarProps {
    isHidden?: boolean;
    menuItems: MenuItem[];
}

/**
 * Navbar component that acts as a responsive wrapper.
 * It delegates to NavbarDesktop for large screens (lg)
 * and NavbarMobile for smaller devices.
 */
export function Navbar({ isHidden, menuItems }: NavbarProps) {
    return (
        <>
            <NavbarDesktop menuItems={menuItems} />
            <NavbarMobile />
        </>
    );
}
