'use server';

import { passwordSchema } from '@/app/lib/zod'
import { errorResponse, successResponse } from '@/app/lib/utils/response';
import { updateUserPassword } from '@/app/lib/firebase/admin-only'
import { AuthServerActionState } from '@/app/lib/defintions';

export async function handlePasswordReset(
  prevState: AuthServerActionState,
  formData: FormData
): Promise<AuthServerActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validated = passwordSchema.safeParse(password);
  if (!validated.success) {
    return errorResponse(["Invalid password"], {
      password: validated.error.flatten().fieldErrors[0]
    });
  }

  const updated = await updateUserPassword(email, password);
  if (!updated) {
    return errorResponse(["User not found or failed to update password"]);
  }

  return successResponse([
    "Password updated successfully",
    "You can now log in with your new password"
  ]);
}