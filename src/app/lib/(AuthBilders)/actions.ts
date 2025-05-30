'use server';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as signOutFirebase,
} from "firebase/auth";
import { auth } from "./firebase/firebase";
import { cookies } from "next/headers";
import { AuthServerActionState } from "./defintions";
import { createResetPasswordToken } from "@/app/lib/(AuthBilders)/utils/jwt";
import { FormDataSchema, passwordSchema } from "./zod";
import { sendEmailVerification } from "@/app/lib/(AuthBilders)/utils/email";
import { successResponse, errorResponse } from "./utils/response";
import { setAuthCookie } from "./utils/auth";
import admin from 'firebase-admin';
import { User } from "firebase/auth";
import { extractErrorDetails } from '@/app/lib/(AuthBilders)/utils/errors'

const extractUser = (user: User) => ({
  uid: user?.uid || '',
  email: user?.email || '',
  displayName: user?.displayName || '',
})

export async function login(
  _prev: AuthServerActionState,
  formData: FormData
): Promise<AuthServerActionState> {
  const fields = FormDataSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!fields.success) {
    return errorResponse(['Login failed. Check input.'], fields.error.flatten().fieldErrors)
  }

  const { email, password } = fields.data

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    const token = (await user.getIdTokenResult()).token
    await setAuthCookie(token)

    return successResponse(['Logged in successfully'], {
      user: extractUser(user)
    })
  } catch (error) {
    const { code, message } = extractErrorDetails(error)

    return errorResponse(
      ['Login failed', code === 'auth/invalid-credential' ? 'Invalid credentials' : message],
      {}
    )
  }
}

export async function signUp(
  _prev: AuthServerActionState,
  formData: FormData
): Promise<AuthServerActionState> {
  const fields = FormDataSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!fields.success) {
    return errorResponse(['User creation failed'], fields.error.flatten().fieldErrors)
  }

  const { email, password } = fields.data

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    const emailRes = await sendEmailVerification(email)

    const baseUser = extractUser(user)

    if (!emailRes.success) {
      return errorResponse(['User created, but email failed', ...emailRes.message], {})
    }

    return successResponse(['User created', 'Verification email sent'], {
      user: baseUser,
      data: emailRes.data,
    })
  } catch (error) {
    const { code, message } = extractErrorDetails(error)

    return errorResponse(
      ['Login failed', code === 'auth/invalid-credential' ? 'Invalid credentials' : message],
      {}
    )
  }

}

export async function signOut(): Promise<AuthServerActionState> {
  try {
    await signOutFirebase(auth)
    const cookieStore = await cookies()
    cookieStore.delete('session')
    return successResponse(['Signed out successfully'])
  } catch (error) {
    console.log(error);
    return errorResponse(['Sign out failed'])
  }
}

export async function sendPasswordResetEmail(
  _prevState: AuthServerActionState,
  formData: FormData
): Promise<AuthServerActionState> {
  const email = formData.get("email") as string;
  const resetToken = await createResetPasswordToken(email);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const response = await fetch(`${baseUrl}/api/reset-password/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        redirectUrl: `${baseUrl}/forgot-password/reset-password?token=${resetToken}`
      }),
    });

    const result = await response.json();
    return {
      success: response.ok,
      message: [result?.message || "Unknown server response"],
      data: result?.data ?? null,
    };
  } catch (error) {
    const { message } = extractErrorDetails(error);
    return {
      success: false,
      message: ["Email server error", message],
      data: null,
    };
  }
}

export async function handlePasswordReset(
  _prevState: AuthServerActionState,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validated = passwordSchema.safeParse(password);
  if (!validated.success) {
    return errorResponse(["Invalid password"], {
      password: validated.error.flatten().fieldErrors[0]
    });
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    if (!user) {
      return errorResponse(["User not found"]);
    }

    await admin.auth().updateUser(user.uid, { password });

    return successResponse([
      "Password updated successfully.",
      "You can now login with your new password"
    ]);
  } catch {
    return errorResponse([
      "Failed to update password.",
      "Please try again"
    ]);
  }
}