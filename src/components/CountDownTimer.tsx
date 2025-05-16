'use client';
import { useEffect, useState } from 'react';
import { inconsolata } from "@/app/ui/fonts";
import { usePathname } from 'next/navigation';
import { DecodedIdToken } from 'firebase-admin/auth';

const DEFAULT_TIME_FORMAT = '--:--:--';

export function CountDownTimer({
  data
}: {
  data: DecodedIdToken | undefined;
}) {
  const pathname = usePathname();
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (!data) return 0;
    return data.exp - Math.floor(Date.now() / 1000);
  });

  useEffect(() => {
    if (!data) return;

    const expiration = data.exp;
    const tick = () => {
      const now = Math.floor(Date.now() / 1000);
      const left = expiration - now;
      setTimeLeft(left > 0 ? left : 0);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [data]);

  if (["/login", "/signUp"].includes(pathname) || !data) return null;

  const formatTime = (seconds: number): string => {
    if (!seconds || seconds <= 0) return DEFAULT_TIME_FORMAT;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remaining = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-0 right-0 z-40 pt-20 pr-6">
      <div className={`${inconsolata.className} relative p-4 border-2 border-solid border-gray-800 rounded-lg`}>
        <div className="absolute inset-0 border border-solid border-gray-600 blur-md bg-gradient-to-r from-[#1d1f20] to-[#0e0e0e] rounded-lg" />
        <div className="relative flex flex-col justify-center items-center">
          <span className="text-gray-100 text-xs font-medium">Session expires in:</span>
          <span className="text-gray-100 text-2xl font-medium">{formatTime(timeLeft)}</span>
        </div>
      </div>
    </div>
  );
}
