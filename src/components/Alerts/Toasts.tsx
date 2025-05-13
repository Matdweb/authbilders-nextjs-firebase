'use client';
import { addToast, } from "@heroui/react";

interface ToastProps {
    endContent?: React.ReactNode;
}

export const SessionErrorToast = ({ ...Props }: ToastProps) => {
    addToast({
        title: "No valid session found",
        description: "Are you already logged in?",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
        ...Props,
    });
}