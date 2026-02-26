import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
        return new NextResponse('Server misconfiguration: ADMIN_PASSWORD not set.', { status: 500 });
    }

    const headersList = await headers();
    const authHeader = headersList.get('authorization') ?? '';
    const [scheme, encoded] = authHeader.split(' ');

    let authorized = false;
    if (scheme === 'Basic' && encoded) {
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
        const colonIdx = decoded.indexOf(':');
        const pass = colonIdx !== -1 ? decoded.slice(colonIdx + 1) : '';
        authorized = pass === password;
    }

    if (!authorized) {
        return new NextResponse('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Crisp Admin", charset="UTF-8"',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    }

    return <>{children}</>;
}
