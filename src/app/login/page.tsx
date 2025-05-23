'use client';
import AuthForm from '@/components/Form/AuthForm'
import { passwordSchema } from '../lib/zod'
import { login } from '@/app/lib/actions'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <AuthForm
      title="Login"
      action={login}
      redirectTo='/'
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
      thirdPartyProviders={['google', 'github']}
      extraContent={
        <section className="mt-8 text-gray-400">
          <p className="text-center">
            Don&apos;t have an account? <Link href="/signUp" className="text-blue-500">Sign Up</Link>
          </p>
          <p className="text-center">
            A lot in mind? <Link href="/forgot-password/provide-email" className="text-blue-500 cursor-pointer">Forgot password</Link>
          </p>
        </section>
      }
    />
  )
}
