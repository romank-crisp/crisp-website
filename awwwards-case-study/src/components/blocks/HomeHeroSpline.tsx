"use client";

import Spline from '@splinetool/react-spline/next';

export function HomeHeroSpline({ sceneUrl }: { sceneUrl: string }) {
    return (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
            <Spline
                scene={sceneUrl}
            />
        </div>
    );
}
