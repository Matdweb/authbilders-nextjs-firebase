'use client'
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
  const [timeLeft, setTimeLeft] = useState<number | undefined>(0);
  const pathname = usePathname();

  const calculateTimeLeft = () => {
    if (data) {
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = data.exp;
      const timeLeft = expirationTime - currentTime;

      return timeLeft;
    }
    return;
  }

  useEffect(() => {
    if (timeLeft === undefined || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime === undefined || prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const time = calculateTimeLeft();
    setTimeLeft(time);
  }, [data]);

  const formatTime = (seconds: number | undefined): string => {
    if (seconds === undefined || seconds <= 0 || timeLeft === undefined) return DEFAULT_TIME_FORMAT;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (pathname === "/login" || pathname === "/signUp") return;

  return (
    <div className="fixed top-0 right-0 z-40 pt-20 pr-6">
      <div className={`${inconsolata.className} relative p-4 border-2 border-solid border-gray-800 rounded-lg`}>
        <div className="absolute inset-0 border border-solid border-gray-600 blur-md bg-gradient-to-r from-[#1d1f20] to-[#0e0e0e] rounded-lg" />

        <div className="relative flex flex-col justify-center items-center">
          <span className="text-gray-100 text-xs font-medium">
            Session expires in:
          </span>
          <span className="text-gray-100 text-2xl font-medium">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    </div>
  );
}