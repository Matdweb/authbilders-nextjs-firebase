'use client';

import { Tooltip, User, Chip } from "@heroui/react";
import { DecodedIdToken } from "firebase-admin/auth";
import { usePathname } from "next/navigation";
import { sendEmailVerification } from "@/app/lib/utils/email";
import { sendEmailVerificationToast } from "./Alerts/Toasts";

type UserInfoProps = {
  data: DecodedIdToken | undefined;
};

export function UserInfo({ data }: UserInfoProps) {
  const pathname = usePathname();

  if (["/login", "/signUp"].includes(pathname)) return null;

  if (!data) return null;

  const { email, name, picture, email_verified } = data;

  const handleSendEmailVerification = async () => {
    if (email_verified) return;

    const response = await sendEmailVerification(email || "");

    sendEmailVerificationToast({
      title: response.success ? "Email verification sent" : "Failed to send verification email",
      description: response.message?.[0] || (response.success ? "Check your inbox and junk" : "Try again"),
      color: response.success ? "success" : "danger",
    });
  };

  return (
    <Tooltip
      content={
        <Chip
          color={email_verified ? "success" : "danger"}
          variant="dot"
          className="border-none h-auto cursor-pointer"
        >
          {email_verified ? "Email verified" : "Email not verified"}
        </Chip>
      }
      placement="left"
    >
      <User
        avatarProps={{ src: picture || "" }}
        description={email || "@who are you?"}
        name={name || "someone"}
        className="absolute bottom-0 right-0 p-4 cursor-pointer"
        onClick={handleSendEmailVerification}
      />
    </Tooltip>
  );
}
