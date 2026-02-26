'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[Error boundary]', error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
            <h1 className="font-heading text-6xl md:text-8xl uppercase tracking-widest">Oops</h1>
            <p className="text-gray-500 max-w-md">
                Something went wrong loading this page. Please try again.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-black text-white text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                    Try again
                </button>
                <Link
                    href="/"
                    className="px-6 py-3 border border-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-colors"
                >
                    Go home
                </Link>
            </div>
        </div>
    );
}
