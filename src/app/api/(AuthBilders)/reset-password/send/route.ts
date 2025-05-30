import { ResetPasswordEmail } from '@/components/(AuthBilders)/EmailTemplates/ResetPasswordEmail'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { ReactNode } from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { email, redirectUrl } = await request.json()

  try {
    const { data, error } = await resend.emails.send({
      from: 'Auth.Bilders <onboarding@resend.dev>',
      to: [email],
      subject: 'Password Reset Request',
      react: ResetPasswordEmail({ firstName: 'user', redirectUrl }) as ReactNode,
    });

    if (error) {
      return NextResponse.json({
        message: error.message,
        data: null
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Email sent successfully',
      data,
    }, { status: 200 });
  } catch {
    return NextResponse.json({
      message: 'Failed to send email',
      data: null
    }, { status: 500 });
  }
}
