

'use client'
import { useState, } from "react";
import { z } from "zod";
import { Input, Button, Spinner, Form, Alert, form } from "@heroui/react";
import { useActionState, startTransition } from "react"
import { handlePasswordReset } from "@/app/lib/actions";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import { useSearchParams } from "next/navigation";
import { verifyResetPasswordToken } from "@/app/lib/jwt-utils";

const passwordSchema = z.string({
    required_error: "Password is required",
})
    .min(6, { message: "Password must be 6 characters or more" })
    .refine((value) => (
        (value.match(/[A-Z]/g) || []).length < 1 ? false : true
    ), {
        message: "Password needs at least 1 uppercase letter"
    })
    .refine((value) => (
        (value.match(/[^a-z0-9]/gi) || []).length < 1 ? false : true
    ), {
        message: "Password needs at least 1 symbol"
    });


export default function App() {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isVisible, setIsVisible] = useState(false);
    const [serverResponse, formAction, isPending] = useActionState(
        handlePasswordReset,
        undefined,
    );
    const params = useSearchParams();
    const token = params.get("token")!;

    const validatePassword = (value: string) => {

        const { password, ...rest } = errors;
        if (value.length === 0 && password) {
            setErrors({
                ...rest
            });
            return;
        }

        const result = passwordSchema.safeParse(value);

        if (!result.success) {
            setErrors({
                ...errors,
                password: result.error?.issues[0].message
            });
            return;
        } else {
            setErrors({
                ...rest
            });
        }

        return null;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const decoded = await verifyResetPasswordToken(token);
        
        if (!decoded) {
            setErrors({
                token: "Reset token is invalid or expired"
            });
            return;
        }
        const formData = new FormData(event.target as HTMLFormElement);
        formData.append("email", decoded);

        startTransition(() => {
            formAction(formData)
        });
    }

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <section className="w-full flex min-h-screen flex-col justify-start px-6 py-12 lg:px-8 bg-gradient-to-r from-[#12222b] to-[#0e0e0e]">
            <h1 className="text-2xl font-bold text-center left-0 py-8">Enter new Password</h1>
            <Form
                className="w-full justify-center items-center space-y-4"
                validationBehavior="native"
                onSubmit={handleSubmit}
            >
                <div className="w-full px-8 flex flex-col gap-4 max-w-md">
                    <Input
                        isRequired
                        errorMessage={({ validationDetails }) => {
                            if (validationDetails.valueMissing) {
                                return "Please enter your password";
                            }

                            return errors.password;
                        }}
                        label="Password"
                        labelPlacement="outside"
                        name="password"
                        type={isVisible ? "text" : "password"}
                        variant="bordered"
                        color="primary"
                        onValueChange={validatePassword}
                        isInvalid={errors.password !== undefined}
                        endContent={
                            <button
                                aria-label="toggle password visibility"
                                className="focus:outline-none"
                                type="button"
                                onClick={toggleVisibility}
                            >
                                {!isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                    />

                    <Button
                        className="w-full flex justify-center items-center"
                        color="primary"
                        type="submit"
                        aria-disabled={isPending}
                        isDisabled={isPending}
                    >
                        {
                            isPending ?
                                <Spinner color="white" variant="dots" />
                                :
                                "Change Password"
                        }
                    </Button>

                    {
                        serverResponse && (
                            serverResponse.success ? (
                                <div className="w-full flex items-center my-3">
                                    <Alert
                                        color={"success"}
                                        title={serverResponse.message[0]}
                                        description={"You can now login with your new password"}
                                    />
                                </div>
                            ) : (
                                <div className="w-full flex items-center my-3">
                                    <Alert
                                        color={"danger"}
                                        title={serverResponse.message[0]}
                                        description={"Please try again"}
                                    />
                                </div>
                            )
                        )
                    }
                    {
                        errors.token && (
                            <div className="w-full flex items-center my-3">
                                <Alert
                                    color={"danger"}
                                    title={errors.token}
                                    description={"Please resend email"}
                                />
                            </div>
                        )
                    }
                </div>
            </Form>
        </section >
    );
}