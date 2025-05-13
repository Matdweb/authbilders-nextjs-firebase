"use server";
import { z } from "zod";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as signOutFirebase,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./firebase";
import { cookies } from "next/headers";
import { authenticateActionState, prevActionState, resetPasswordEmailActionState } from "./defintions";
import admin from "firebase-admin";
import { createResetPasswordToken } from "@/app/lib/jwt-utils";
import type { CreateEmailResponseSuccess } from "resend";

const passwordSchema = z.string({
  required_error: "Password is required",
})
  .min(6, { message: "Password must be 6 characters or more" })
  .refine((value) => (
    (value.match(/[A-Z]/g) || []).length < 1 ? false : true
  ), {
    message: "Password needs at least 1 uppercase letter"
  })
  .refine((value) => (
    (value.match(/[^a-z0-9]/gi) || []).length < 1 ? false : true
  ), {
    message: "Password needs at least 1 symbol"
  });

const FormDataSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

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
  prevState: authenticateActionState,
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
  prevState: authenticateActionState,
  formData: FormData
) {
  const validatedFields = FormDataSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: ["Something seems odd. Failed to create User."],
      user: null,
    };
  }

  const { email, password } = validatedFields.data;
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const response = await loginOnFirebase({
      email,
      password,
    });

    if (response.success) {
      // Send email verification
      await sendEmailVerification(user, {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`,
      });
    }

    return {
      success: true,
      errors: {},
      message: ["User created successfully."],
      user: {
        uid: user.uid || "",
        email: user.email || "",
        displayName: user.displayName || "",
      },
    };
  } catch (error: any) {
    const errorCode = error?.code || "";
    const errorMessage = error?.message || "";

    return {
      success: false,
      errors: {
        email:
          errorCode === "auth/email-already-in-use"
            ? ["Email already in use."]
            : [""],
      },
      message: ["Something went wrong. Failed to create user.", errorCode],
      user: null,
    };
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
  prevState: resetPasswordEmailActionState,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const resetToken = await createResetPasswordToken(email);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const response = await fetch(`${baseUrl}/api/reset-password/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      redirectUrl: `${baseUrl}/forgot-password/reset-password?token=${resetToken}`,
    }),
  });


  if (!response.ok) {
    return {
      success: false,
      message: ["Failed to send email"],
      data: null,
    }
  }

  const data: CreateEmailResponseSuccess = await response.json();

  return {
    success: true,
    message: ["Email sent successfully"],
    data,
  }
}

export async function handlePasswordReset(
  prevState: prevActionState | undefined,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = passwordSchema.safeParse(password);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors)
    return {
      success: false,
      message: ["Password does not meet the requirements."],
    };
  }

  const user = await admin.auth().getUserByEmail(email);

  if (!user) {
    return {
      success: false,
      message: ["No user was found with the email provided."],
    };
  }

  const data = await admin.auth().updateUser(user.uid, { password });
  if (!data) {
    return {
      success: false,
      message: ["Failed to update password."],
    };
  }

  return {
    success: true,
    message: ["Password updated successfully."],
  };
}
