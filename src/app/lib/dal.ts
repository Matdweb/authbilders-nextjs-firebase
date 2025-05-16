// import 'server-only';
'use server'
import { cache } from 'react';
import { verifyIdToken } from './firebase/firebase-admin';
import { cookies } from 'next/headers';

export const verifySession = cache(async () => {
    const cookieStore = await cookies();
    try {
        const token = cookieStore.get("session")?.value || "";
        const decoded = await verifyIdToken(token);
        return decoded;

    } catch (error: any) {
        console.log(error);
        return;
    }
})