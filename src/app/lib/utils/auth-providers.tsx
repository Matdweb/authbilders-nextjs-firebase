import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "@/app/lib/firebase/firebase";
import { extractErrorDetails } from './errrors';
import { setAuthCookie } from './auth';
import { errorResponse, successResponse } from './response';
import type { ThirdPartyProvidersNames } from '@/components/Form/AuthForm';

export const signInWithProvider = async (providerName: ThirdPartyProvidersNames) => {
    const provider =
        providerName == "google" ? (new GoogleAuthProvider())
            : ((providerName == "github") && new GithubAuthProvider()) as GithubAuthProvider;

    provider.setCustomParameters({ prompt: "select_account" });
    try {
        const result = await signInWithPopup(auth, provider);
        const token = await result.user.getIdToken();

        await setAuthCookie(token);

        return successResponse([(`Logged in with ${providerName}`)]);

    } catch (error) {
        const { message = "Unexpected error occurred." } = extractErrorDetails(error);
        return errorResponse([`Failed to Login with ${providerName}`], {
            providers: [message]
        })
    }
}