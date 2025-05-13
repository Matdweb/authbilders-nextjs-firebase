import { EmailTemplate } from '@/components/EmailTemplate'
import { ReactNode } from 'react';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, redirectUrl } = await request.json();

  try {
    const { data, error } = await resend.emails.send({
      from: 'Auth.Bilders <onboarding@resend.dev>',
      to: [email],
      subject: 'Password Reset Request',
      react: EmailTemplate({ firstName: 'user', redirectUrl }) as ReactNode,
    });

    if (error) {
      return Response.json({
        success: false,
        message: error.message,
        data: null,
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: 'Email sent successfully',
      data,
    }, { status: 200 });

  } catch (error) {
    return Response.json({
      success: false,
      message: 'Failed to send email',
      data: null,
    }, { status: 500 });
  }
}