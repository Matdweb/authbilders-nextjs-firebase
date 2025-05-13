'use client';
import { useEffect, useState } from 'react';
import { verifySession } from '../lib/dal';
import { useRouter } from 'next/navigation';

export default function App() {
    const waitingText = 'Waiting for email verification...';
    const [message, setMessage] = useState(waitingText);
    const router = useRouter();

    const handleRedirect = () => {
        router.push('/');
    }

    //TODO: The verification process is completed by calling applyActionCode. or dont use continue url at all.

    useEffect(() => {
        const handleEmailVerification = async () => {
            setTimeout(async () => {
                const decoded = await verifySession();

                if (decoded) {
                    if (decoded.email_verified) {
                        setMessage('✅ Email already verified!');
                        setTimeout(() => {
                            handleRedirect();
                        }, 2000);

                    }
                } setMessage('❌ Email not verified!');
            }, 1000);
        }

        handleEmailVerification();
    }, []);

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
