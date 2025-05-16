'use server';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as signOutFirebase,
} from "firebase/auth";
import { auth } from "./firebase/firebase";
import { cookies } from "next/headers";
import { AuthServerActionState } from "./defintions";
import { createResetPasswordToken } from "@/app/lib/utils/jwt";
import { FormDataSchema, passwordSchema } from "./zod";
import { sendEmailVerification } from "@/app/lib/utils/email";
import { successResponse, errorResponse } from "./utils/response";
import { setAuthCookie } from "./utils/auth";
import admin from 'firebase-admin';

const extractUser = (user: any) => ({
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
  } catch (error: any) {
    return errorResponse(
      ['Login failed', error.code === 'auth/invalid-credential' ? 'Invalid credentials' : error.message],
      {}
    )
  }
}

// SIGN UP
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
  } catch (error: any) {
    const code = error.code || ''
    return errorResponse(
      ['Failed to create user', code],
      {
        email: code === 'auth/email-already-in-use' ? ['Email already in use'] : ['']
      }
    )
  }
}

export async function signOut(): Promise<AuthServerActionState> {
  try {
    await signOutFirebase(auth)
    const cookieStore = await cookies()
    cookieStore.delete('session')
    return successResponse(['Signed out successfully'])
  } catch (e) {
    return errorResponse(['Sign out failed'])
  }
}
export async function sendPasswordResetEmail(
  prevState: AuthServerActionState,
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
  } catch (e) {
    return {
      success: false,
      message: ["Email server error"],
      data: null,
    };
  }
}

export async function handlePasswordReset(
  prevState: AuthServerActionState,
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