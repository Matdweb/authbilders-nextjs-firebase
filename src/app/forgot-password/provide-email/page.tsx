'use client';
import AuthForm from '@/components/Form/AuthForm'
import { sendPasswordResetEmail } from "@/app/lib/actions";

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
