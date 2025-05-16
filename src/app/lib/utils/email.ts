'use server';
import { createVerificationEmailToken } from "./jwt";
import { useAPI } from "./api";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function sendEmailVerification(email: string) {
    const token = await createVerificationEmailToken(email);
    return useAPI("/api/verify-email/send", {
        email,
        redirectUrl: `${baseUrl}/verify-email?token=${token}`,
    });
}

export async function verifyEmail(email: string) {
    const res = await useAPI("/api/verify-email", { email });
    return res.success;
}
