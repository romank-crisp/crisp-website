"use client";

import React from "react";
import Link from "next/link";
import { NextCaseProps } from "@/types/case-study";

export function NextCaseBlock({
    title,
    subtitle,
    link,
    videoPath,
}: NextCaseProps) {
    return (
        <Link
            href={link}
            className="group relative block w-full h-[80vh] overflow-hidden bg-black text-white cursor-none"
            data-cursor="video"
            data-cursor-text="<span>NEXT</span><span>CASE →</span>"
        >
            {/* Background Video */}
            {videoPath ? (
                <>
                    <video
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src={videoPath} type="video/webm" />
                    </video>
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700" />
                </>
            ) : (
                <div className="absolute inset-0 bg-brand/10 transition-colors duration-500 group-hover:bg-brand/20" />
            )}

            {/* Content (Hidden or Small as per request 'Remove text', user said: "instead of PLAY SHOWREEL write NEXT CASE ->" cursor logic. 
                Wait, user said "Remove text" from the block itself. 
                Currently footer had "Next Case" / "Lets work together".
                So we remove the overlay text and rely on cursor.
                But maybe keep the subtle title showing WHICH case it is?
                User said "Remove text". I will respect that strictly for the main center text.
                Maybe a small label at the bottom? I'll keep it clean as requested.
            */}
        </Link>
    );
}
