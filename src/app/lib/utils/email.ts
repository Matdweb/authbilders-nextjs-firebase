'use server';
import { signOut } from "../actions";
import { createVerificationEmailToken } from "./jwt";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function sendEmailVerification(email: string) {

    const token = await createVerificationEmailToken(email);

    try {
        const response = await fetch(`${baseUrl}/api/verify-email/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                redirectUrl: `${baseUrl}/verify-email?token=${token}`,
            }),
        });

        const result = await response.json();
        return {
            success: response.ok,
            message: [result?.message || "Unknown server response"],
            data: result?.data ?? null,
        };
    } catch (e) {
        return {
            success: false,
            message: ["Email server error"],
            data: null,
        };
    }
}

export async function verifyEmail(email: string) {
    try {
        const response = await fetch(`${baseUrl}/api/verify-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        await signOut();
        return response.ok;
    } catch (e) {
        return false;
    }
}
