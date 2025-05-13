'use client'
import { useState, } from "react";
import { Input, Button, Spinner, Form, Alert } from "@heroui/react";
import { useActionState } from "react"
import { sendPasswordResetEmail } from "@/app/lib/actions";

export default function App() {
    const [email, setEmail] = useState<string>("");
    const [serverResponse, formAction, isPending] = useActionState(
        sendPasswordResetEmail,
        undefined,
    );

    return (
        <section className="w-full flex min-h-screen flex-col justify-start px-6 py-12 lg:px-8 bg-gradient-to-r from-[#12222b] to-[#0e0e0e]">
            <h1 className="text-2xl font-bold text-center left-0 py-8">Enter email</h1>
            <Form
                className="w-full justify-center items-center space-y-4"
                validationBehavior="native"
                action={formAction}
            >
                <div className="w-full px-8 flex flex-col gap-4 max-w-md">
                    <Input
                        isRequired
                        errorMessage={({ validationDetails }) => {
                            if (validationDetails.valueMissing) {
                                return "Please enter your email";
                            }
                            if (validationDetails.typeMismatch) {
                                return "Please enter a valid email address";
                            }

                            return;
                        }}
                        label="Email"
                        labelPlacement="outside"
                        name="email"
                        type="email"
                        variant="bordered"
                        color="primary"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
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
                                "Send reset link"
                        }
                    </Button>

                    {
                        serverResponse && (
                            serverResponse.success ? (
                                <div className="w-full flex items-center my-3">
                                    <Alert
                                        color={"success"}
                                        title={serverResponse.message[0]}
                                        description={"Check your inbox and junk"}
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
                </div>
            </Form>
        </section >
    );
}