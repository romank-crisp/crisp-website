import { NextRequest, NextResponse } from 'next/server';

// Auth is handled by src/app/admin/page.tsx (Node.js server component)
export function proxy(_req: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: [],
};
