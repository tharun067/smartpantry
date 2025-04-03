import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";


export async function GET(request) {
    const session = await getSession({ req: request });
    if (!session) {
        return NextResponse.json({ error: 'Not Authenticated' }, { status: 401 });
    }
    return NextResponse.json(session.user);
}