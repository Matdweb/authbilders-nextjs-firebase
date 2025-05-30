'use server'

import { cookies } from 'next/headers'

export async function setAuthCookie(idToken: string) {
    const cookieStore = await cookies();
    cookieStore.set('session', idToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60, 
    });
}