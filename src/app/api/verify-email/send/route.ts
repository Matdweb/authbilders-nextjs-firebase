import { EmailVerificationTemplate } from '@/components/EmailTemplates/EmailVerificationTemplate'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { ReactNode } from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email, redirectUrl } = await req.json()

  try {
    const { data, error } = await resend.emails.send({
      from: 'Auth.Bilders <onboarding@resend.dev>',
      to: [email],
      subject: 'Email Verification',
      react: EmailVerificationTemplate({ firstName: 'user', redirectUrl }) as ReactNode,
    });

    if (error) {
      return NextResponse.json({ message: error.message, data: null }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Email sent successfully',
      data,
    }, { status: 200 });
  } catch {
    return NextResponse.json({
      message: 'Failed to send email',
      data: null,
    }, { status: 500 });
  }
}
