"use client";

import { Navbar } from "@/components/layouts/Navbar";

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar isHidden={false} />

            <section className="h-screen flex flex-col items-center justify-center p-6 bg-black text-white">
                <h1 className="font-mega text-mega-h1 uppercase">Services</h1>
                <p className="mt-8 text-xl md:text-2xl font-light opacity-70">Coming Soon</p>
            </section>
        </main>
    );
}
