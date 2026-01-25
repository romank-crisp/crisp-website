"use client";

import { useState } from "react";
import { Navbar } from "@/components/layouts/Navbar";
import { TextReveal } from "@/components/blocks/TextReveal";
import Link from "next/link";

export default function Home() {
  const [isHeroPlaying, setIsHeroPlaying] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <Navbar isHidden={isHeroPlaying} />

      {/* Simple Home Hero */}
      <section className="h-screen flex flex-col items-center justify-center text-center p-6 bg-black text-white">
        <div className="space-y-8 max-w-[1600px] mx-auto w-full">
          <TextReveal
            text="Design that defines the future of ecological innovation."
            className="text-[8vw] md:text-mega-h1 leading-[0.88] uppercase font-mega tracking-tight"
          />
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
            <Link
              href="/works/centrogreen"
              className="font-text text-xl md:text-2xl font-light hover:text-brand transition-colors"
            >
              Explore Centrogreen →
            </Link>
            <Link
              href="/works/folkeuniversitetet"
              className="font-text text-xl md:text-2xl font-light hover:text-brand transition-colors"
            >
              View Folkeuniversitetet →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
