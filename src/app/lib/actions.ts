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
import type { CreateEmailResponseSuccess } from "resend";
import { useAPI } from "@/app/lib/utils/api";
import { FormDataSchema, passwordSchema } from "./zod";
import { sendEmailVerification } from "@/app/lib/utils/email";
import { successResponse, errorResponse } from "./utils/response";

export async function loginOnFirebase(
  {
    email, password
  }: {
    email: string,
    password: string
  }) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    // Get user's ID token
    // Get token result which contains expiration time
    const tokenResult = await user.getIdTokenResult();
    const idToken = tokenResult.token;

    // Set secure HTTP-only cookie with token
    const cookieStore = await cookies();
    cookieStore.set("session", idToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, //1 hour
    });
    // Return success state with user details
    return {
      success: true,
      errors: {},
      message: ["User signed In succesfully"],
      user: {
        uid: user.uid || "",
        email: user.email || "",
        displayName: user.displayName || "",
      },
    };
  } catch (error: any) {
    // 5. On auth failure
    const errorCode = error?.code || "";
    const errorMessage = error?.message || "";

    return {
      success: false,
      errors: {},
      message: [
        "Something went wrong. Failed to sign in.",
        errorCode == "auth/invalid-credential"
          ? "Invalid credentials"
          : errorMessage,
      ],
      user: null,
    };
  }
}

export async function login(
  prevState: AuthServerActionState,
  formData: FormData
) {
  // 1. Validate form data against schema (email format and password length)
  const validatedFields = FormDataSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  // 2. If validation fails, return error state with field-specific messages
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: ["Something seems odd. Failed to sign in."],
      user: null,
    };
  }

  // 3. If validation passes, attempt Firebase email/password authentication
  const { email, password } = validatedFields.data;

  return await loginOnFirebase({ email, password });
}

export async function signUp(
  prevState: AuthServerActionState,
  formData: FormData
): Promise<AuthServerActionState> {
  const validatedFields = FormDataSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!validatedFields.success) {
    return errorResponse(
      ["Something seems odd. Failed to create the user"],
      validatedFields.error.flatten().fieldErrors
    );
  }

  const { email, password } = validatedFields.data;

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    const emailResult = await sendEmailVerification(email);

    const firebaseUser = {
      uid: user.uid || "",
      email: user.email || "",
      displayName: user.displayName || "",
    };

    if (!emailResult.success) {
      return errorResponse(
        ["User created successfully", ...emailResult.message],
        {}
      );
    }

    return successResponse(
      ["User created successfully", "Please check your inbox or junk"],
      {
        user: firebaseUser,
        data: emailResult.data,
      }
    );
  } catch (error: any) {
    const code = error?.code || "";

    return errorResponse(
      ["Failed to create user", code],
      {
        email:
          code === "auth/email-already-in-use"
            ? ["Email already in use"]
            : [""],
      }
    );
  }
}

export async function signOut() {
  try {
    await signOutFirebase(auth);
    const cookieStore = await cookies();
    cookieStore.delete("session");
    return { success: true, message: "" };

  } catch (error: any) {
    console.log(error);
    return { success: false, message: error };
  }
}

export async function sendPasswordResetEmail(
  prevState: AuthServerActionState,
  formData: FormData
): Promise<AuthServerActionState> {
  const email = formData.get("email") as string;
  const token = await createResetPasswordToken(email);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const result = await useAPI("/api/reset-password/send", {
    email,
    redirectUrl: `${baseUrl}/forgot-password/reset-password?token=${token}`
  });

  if (!result.success) {
    return errorResponse(
      result.message,
    );
  }

  return successResponse(
    ["Email sent successfully", "Check your inbox and junk"],
    { data: result.data }
  );
}
