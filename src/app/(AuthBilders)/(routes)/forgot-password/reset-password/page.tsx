'use client';
import AuthForm from '@/components/(AuthBilders)/Form/AuthForm';
import { useSearchParams } from "next/navigation";
import { handlePasswordReset } from '@/app/lib/(AuthBilders)/actions';
import { passwordSchema } from '@/app/lib/(AuthBilders)/zod';
import { verifyResetPasswordToken } from '@/app/lib/(AuthBilders)/utils/jwt';

export default function Page() {
    const params = useSearchParams();
    const token = params.get("token")!;

    return (
        <AuthForm
            title="Enter new Password"
            action={handlePasswordReset}
            fields={[
                {
                    name: 'password',
                    label: 'Password',
                    type: 'password',
                    required: true,
                    schema: passwordSchema,
                    onValueChange: (val) => passwordSchema.safeParse(val).success || undefined
                }
            ]}
            sendButtonText='Change Password'
            resetFormButton={false}
            validateBeforeSubmit={(async (formData) => {
                const decoded = await verifyResetPasswordToken(token);
                if (!decoded) return { token: 'Reset token is invalid or expired' };
                formData.append('email', decoded);
                return null;
            })}
        />
    )
}
