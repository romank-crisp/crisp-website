import { headers } from 'next/headers';
import AdminClientPage from './AdminClientPage';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const password = process.env.ADMIN_PASSWORD;

    // Fail open if password not configured — show a clear error
    if (!password) {
        return (
            <div style={{ padding: 40 }}>
                <h1>Server Error</h1>
                <p>ADMIN_PASSWORD is not configured on this server.</p>
            </div>
        );
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
        // Return a 401 response with WWW-Authenticate header
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Crisp Admin", charset="UTF-8"',
                'Cache-Control': 'no-store',
            },
        });
    }

    return <AdminClientPage />;
}
