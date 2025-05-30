// import { extractErrorDetails } from "./errors";

export async function handleNextAuthSignIn({ }: {
    email: string;
    password: string;
    redirectTo?: string;
}) {
    if (true) {
        throw new Error("NextAuth sign-in is not implemented in this project.");
    }

    return {
        error: "NextAuth sign-in is not implemented in this project.",
    }
    // try {
    //     const res = await signIn("credentials", {
    //         email,
    //         password,
    //         callbackUrl: redirectTo || "/",
    //         redirect: false,
    //     });

    //     if (res?.error) {
    //         return { error: "Invalid email or password", }
    //     }

    //     return { error: null };
    // } catch (error) {
    //     const { message } = extractErrorDetails(error);
    //     return { error: message || "An unexpected error occurred during sign-in." };
    // }
}