import { headers } from 'next/headers';
import { unauthorized } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
        return (
            <html>
                <body>Server misconfiguration: ADMIN_PASSWORD not set.</body>
            </html>
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
        unauthorized();
    }

    return <>{children}</>;
}
