'use client';
import AuthForm from '@/components/Form/AuthForm'
import { passwordSchema } from '../lib/zod'
import { signUp } from '@/app/lib/actions'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <AuthForm
      title="Sign Up"
      action={signUp}
      fields={[
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          required: true,
          schema: passwordSchema,
          onValueChange: (val) => passwordSchema.safeParse(val).success || undefined
        }
      ]}
      extraContent={
        <section className="mt-8 text-gray-400">
          <p className="text-center">
            You already have an account? <Link href="/login" className="text-blue-500">Login</Link>
          </p>
        </section>
      }
    />
  )
}
