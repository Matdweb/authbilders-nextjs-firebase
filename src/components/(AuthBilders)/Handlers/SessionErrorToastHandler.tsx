'use client';
import { DecodedIdToken } from "firebase-admin/auth";
import { useEffect, useRef } from "react";
import { SessionErrorToast } from "@/components/(AuthBilders)/Alerts/Toasts";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function SessionErrorToastHandler({
  decoded,
}: {
  decoded: DecodedIdToken | undefined;
}) {
  const toastShownRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (decoded || toastShownRef.current) return;

    toastShownRef.current = true;

    SessionErrorToast({
      endContent: (
        <Button
          size="sm"
          variant="flat"
          color="danger"
          onPress={() => router.push("/login")}
        >
          Login
        </Button>
      ),
    });
  }, [decoded, router]);

  return null;
}
