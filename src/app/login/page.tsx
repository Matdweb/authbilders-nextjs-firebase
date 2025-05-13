'use client'
import { useState, useActionState, useEffect, startTransition } from "react";
import { z } from "zod";
import { Form, Input, Button, Alert, Spinner } from "@heroui/react";
import Link from "next/link";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import { useRouter } from "next/navigation";
import { login } from "@/app/lib/actions";
import { authenticateActionErrors } from "../lib/defintions";

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
  const [serverResponse, formAction, isPending] = useActionState(
    login,
    undefined,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

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

  const formatErrors = () => {
    const errors: authenticateActionErrors = serverResponse?.errors || {};
    const formattedErrors = {};

    for (const [key, value] of Object.entries(errors)) {
      Object.assign(formattedErrors, { [key]: (value[0] || "") })
    }

    return formattedErrors;
  }

  const handleServerErrors = () => {
    if (!(serverResponse?.success)) {
      setErrors(formatErrors());
    } else {
      setErrors({});
      router.push("/");
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (Object.keys(errors).length > 0) {
      return; // Don't submit if there are errors
    }

    startTransition(() => {
      formAction((new FormData(event.target as HTMLFormElement)))
    });
  }

  useEffect(() => {
    handleServerErrors();
  }, [serverResponse]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <section className="w-full flex min-h-screen flex-col justify-start px-6 py-12 lg:px-8 bg-gradient-to-r from-[#12222b] to-[#0e0e0e]">
      <h1 className="text-2xl font-bold text-center left-0 py-8">Login</h1>
      <Form
        className="w-full justify-center items-center space-y-4"
        validationBehavior="native"
        validationErrors={errors}  //This way the error message an invalid fields will be handled automaticly
        action={formAction}
        onSubmit={handleSubmit}
        onReset={() => {
          setErrors({});
        }}
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

              return errors.email;
            }}
            label="Email"
            labelPlacement="outside"
            name="email"
            type="email"
            variant="bordered"
            color="primary"
          />
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
            onValueChange={validatePassword}
            isInvalid={errors.password !== undefined}
            variant="bordered"
            color="primary"
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
          <div className="flex gap-4">
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
                  "Login"
              }
            </Button>
            <Button
              type="reset"
              variant="bordered"
            >
              Reset
            </Button>
          </div>

          {
            serverResponse && (
              serverResponse.success ? (
                <div className="w-full flex items-center my-3">
                  <Alert
                    color={"success"}
                    title={"Successfully signed in"}
                    description={"User is authenticated"}
                  />
                </div>
              ) : (
                <div className="w-full flex items-center my-3">
                  <Alert
                    color={"danger"}
                    title={serverResponse.message[0]}
                    description={serverResponse.message[1] || ""}
                  />
                </div>
              )
            )
          }
        </div>
      </Form>
      <section className="mt-8 text-gray-400">
        <p className="text-center">
          Don't have an account? <Link href="/signUp" className="text-blue-500">Sign Up</Link>
        </p>
        <p className="text-center">
          A lot in mind? <Link href="/forgot-password/provide-email" className="text-blue-500 cursor-pointer">Forgot password</Link>
        </p>
      </section>
    </section>
  );
}