import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    if (!isAdminRoute) return NextResponse.next();

    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
        return new NextResponse('Server misconfiguration: ADMIN_PASSWORD not set.', { status: 500 });
    }

    const authHeader = req.headers.get('authorization') ?? '';
    const [scheme, encoded] = authHeader.split(' ');

    if (scheme === 'Basic' && encoded) {
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
        const colonIdx = decoded.indexOf(':');
        const pass = colonIdx !== -1 ? decoded.slice(colonIdx + 1) : '';

        if (pass === password) {
            return NextResponse.next();
        }
    }

    return new NextResponse('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Crisp Admin", charset="UTF-8"' },
    });
}

export const config = {
    matcher: ['/admin/:path*'],
};
