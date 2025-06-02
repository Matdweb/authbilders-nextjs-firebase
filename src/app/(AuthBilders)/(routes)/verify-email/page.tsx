'use client';
import { useEffect, useState } from 'react';
import { verifyVerificationEmailToken } from '@/app/lib/(AuthBilders)/utils/jwt';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/app/lib/(AuthBilders)/utils/email';

export default function App() {
    const waitingText = 'Waiting for email verification...';
    const [message, setMessage] = useState(waitingText);
    const router = useRouter();
    const params = useSearchParams();
    const token = params.get('token')!;

    const handleRedirect = () => {
        router.push('/');
    }

    useEffect(() => {
        const handleEmailVerification = async () => {
            const email = await verifyVerificationEmailToken(token);
            setTimeout(async () => {
                if (email) {
                    const verified = await verifyEmail(email);
                    if (verified) setMessage('✅ Email already verified!'); return;
                } setMessage('❌ Email not verified!');
            }, 1000);
        }

        handleEmailVerification();
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (message !== waitingText) handleRedirect();
        }, 2000);

        return () => clearTimeout(timer);
    }, [message]);

    return (
        <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-r from-[#12222b] to-[#0e0e0e]">
            <h1 className="text-5xl font-semibold tracking-tight text-center text-balance text-gray-100 sm:text-7xl">{message}</h1>
            <p className=" text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">You will be redirected...</p>
        </div>
    )
}
