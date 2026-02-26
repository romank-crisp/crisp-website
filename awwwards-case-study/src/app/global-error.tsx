'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[GlobalError]', error);
    }, [error]);

    return (
        <html lang="en">
            <body style={{ margin: 0, background: '#fff', fontFamily: 'sans-serif' }}>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    padding: '2rem',
                    textAlign: 'center',
                }}>
                    <h1 style={{ fontSize: '3rem', letterSpacing: '0.05em', margin: 0 }}>Something went wrong</h1>
                    <p style={{ color: '#666', maxWidth: 480 }}>
                        An unexpected error occurred. Please try again or{' '}
                        <a href="/" style={{ color: '#000', textDecoration: 'underline' }}>return home</a>.
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            padding: '0.75rem 2rem',
                            background: '#000',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
