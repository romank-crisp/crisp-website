import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
    // Admin auth is handled by src/app/admin/layout.tsx (server-side Node.js)
    return NextResponse.next();
}

export const config = {
    matcher: [],
};
