'use client';
import AuthForm from '@/components/(AuthBilders)/Form/AuthForm'
import { sendPasswordResetEmail } from "@/app/lib/(AuthBilders)/actions";

export default function Page() {
  return (
    <AuthForm
      title="Enter email"
      action={sendPasswordResetEmail}
      fields={[
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
        },
      ]}
      sendButtonText='Send reset link'
      resetFormButton={false}
    />
  )
}
