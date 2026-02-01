"use client";

import { NavbarDesktop } from "./NavbarDesktop";
import { NavbarMobile } from "./NavbarMobile";

interface NavbarProps {
    isHidden?: boolean;
}

/**
 * Navbar component that acts as a responsive wrapper.
 * It delegates to NavbarDesktop for large screens (lg)
 * and NavbarMobile for smaller devices.
 */
export function Navbar() {
    return (
        <>
            <NavbarDesktop />
            <NavbarMobile />
        </>
    );
}
