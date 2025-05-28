'use client';

import { Tooltip, User, Chip, Code } from "@heroui/react";
import { DecodedIdToken } from "firebase-admin/auth";
import { usePathname } from "next/navigation";
import { sendEmailVerification } from "@/app/lib/utils/email";
import { sendEmailVerificationToast } from "./Alerts/Toasts";
import { CloseIcon } from "./icons";
import { useState } from "react";

type UserInfoProps = {
  data: DecodedIdToken | undefined;
};

export function UserInfo({ data }: UserInfoProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (["/login", "/signUp"].includes(pathname)) return null;

  if (!data) return null;

  const { email, name, picture, email_verified } = data;

  const handleSendEmailVerification = async () => {
    if (email_verified) return;

    const response = await sendEmailVerification(email || "");

    sendEmailVerificationToast({
      title: response.success ? "Email verification sent" : "Failed to send verification email",
      description: (response.success ? "Check your inbox and junk" : "Try again"),
      color: response.success ? "success" : "danger",
    });
  };


  function SessionDisplay() {
    return (
      <div className=" w-full max-w-56 md:max-w-full sm:max-w-80 bg-[#0e0e0e] border border-gray-800 rounded-xl shadow-xl p-4 text-gray-100">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-gray-400">Session data:</span>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-500 hover:text-red-400 transition-colors"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
        <Code className="w-full max-h-64 overflow-auto">
          <pre className="whitespace-pre-wrap break-words text-xs">{JSON.stringify(data, null, 2)}</pre>
        </Code>
        <span className="mt-2 block text-xs font-medium text-gray-400">Email Verified:</span>
        <Chip
          color={email_verified ? "success" : "danger"}
          variant="dot"
          className="mt-2 border-none h-auto cursor-pointer py-1 bg-white/10 rounded-lg min-w-full"
          onClick={handleSendEmailVerification}
        >
          {email_verified ? "Email verified" : "Email not verified"}
        </Chip>
      </div >
    )
  }

  return (
    <Tooltip
      content={SessionDisplay()}
      placement="top"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <User
        avatarProps={{ src: picture || "" }}
        description={email || "@who are you?"}
        name={name || "someone"}
        className="absolute bottom-0 right-0 p-4 cursor-pointer"
        onClick={() => setIsOpen(true)}
      />
    </Tooltip>
  );
}
