'use client';
import { addToast, } from "@heroui/react";

interface Props {
    title?: string;
    description?: string;
    color?: "danger" | "success" | "warning",
    endContent?: React.ReactNode;
}

export const SessionErrorToast = ({ ...Props }: Props) => {
    addToast({
        title: "No valid session found",
        description: "Are you already logged in?",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
        ...Props,
    });
}

export const sendEmailVerificationToast = ({ title, description, color, ...Props }: Props) => {
    addToast({
        title: title,
        description: description,
        color: color,
        timeout: 5000,
        shouldShowTimeoutProgress: true,
        ...Props,
    });
}