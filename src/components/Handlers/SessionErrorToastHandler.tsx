
'use client';
import { DecodedIdToken } from "firebase-admin/auth";
import { useState } from "react";
import { SessionErrorToast } from "@/components/Alerts/Toasts";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

const SESSION_ERROR_TOAST_ID = "8o4kddxyG99eNGRj";


//we need to hanlde the session error toast in a separate component because it's executed in several parts of the code and we need to make sure just one toast is rendered

export default function SessionErrorToastHandler({
    decoded
}: {
    decoded: DecodedIdToken | undefined
}) {
    const [errorToastList, setErrorToastList] = useState<string[]>([]);
    const router = useRouter();

    const handleRedirect = (path: string) => {
        router.push(path);
    }

    const handleSessionError = () => {
        if (errorToastList.includes(SESSION_ERROR_TOAST_ID)) {
            return;
        }

        setErrorToastList((prev) => [...prev, SESSION_ERROR_TOAST_ID]);
        SessionErrorToast({
            endContent: (
                <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    onPress={() => {
                        handleRedirect('login');
                    }}
                >
                    Login
                </Button>
            )
        });

    }

    if (!decoded) {
        handleSessionError();
    }

    return (
        <></>
    );
}