'use server';
import { createVerificationEmailToken } from "./jwt";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

type ServerResponse<T = any> = {
    success: boolean;
    message: string[];
    data?: T | null;
};

export async function useAPI(
    endpoint: string,
    payload: Record<string, unknown>
): Promise<ServerResponse> {
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
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
