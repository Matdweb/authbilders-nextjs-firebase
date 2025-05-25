'use client';
import { useState, useActionState, useEffect, startTransition } from 'react';
import { Form, Input, Button, Alert, Spinner } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { ZodType } from 'zod';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/icons';
import { AuthServerActionState } from '@/app/lib/defintions';
import { GoogleIcon, GithubIcon } from '@/components/icons';
import { signInWithProvider } from '@/app/lib/utils/auth-providers';

interface AuthFormField {
  name: string;
  label: string;
  type: 'email' | 'password' | 'text';
  required?: boolean;
  schema?: ZodType<unknown>;
  onValueChange?: (value: string) => void;
}

export type ThirdPartyProvidersNames = "google" | "github"

interface AuthFormProps {
  title: string;
  action: (prevState: AuthServerActionState, formData: FormData) => Promise<AuthServerActionState>;
  fields: AuthFormField[];
  redirectTo?: string;
  extraContent?: React.ReactNode;
  validateBeforeSubmit?: (formData: FormData) => Promise<Record<string, string> | null>;
  resetFormButton?: boolean;
  sendButtonText?: string;
  thirdPartyProviders?: Array<ThirdPartyProvidersNames>
}

export default function AuthForm({
  title,
  action,
  fields,
  redirectTo,
  extraContent,
  validateBeforeSubmit,
  resetFormButton = true,
  sendButtonText,
  thirdPartyProviders
}: AuthFormProps) {
  const [serverResponse, formAction, isPending] = useActionState(action, undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const handleServerErrors = () => {
    if (!(serverResponse?.success)) {
      const errors = serverResponse?.errors || {};
      const formatted: Record<string, string> = {};

      for (const [key, value] of Object.entries(errors)) {
        formatted[key] = value?.[0] || '';
      }
      setErrors(formatted);
    } else {
      setErrors({});
      if (redirectTo) router.replace(redirectTo);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (validateBeforeSubmit) {
      const fieldErrors = await validateBeforeSubmit(formData);
      if (fieldErrors) {
        setErrors(fieldErrors);
        return;
      }
    }

    if (Object.keys(errors).length > 0) return;
    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    handleServerErrors();
  }, [serverResponse]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSignInWithProvider = async (provider: ThirdPartyProvidersNames) => {
    const response = await signInWithProvider(provider);

    if (!response?.success) {
      const providers = response?.errors?.['providers']?.[0] || "";
      console.log(providers)
      setErrors({
        ...errors,
        providers
      })
    } else {
      setErrors({});
      router.push(redirectTo || '/')
    }
  }

  return (
    <section className="w-full flex min-h-screen flex-col justify-start px-6 py-12 lg:px-8 bg-gradient-to-r from-[#12222b] to-[#0e0e0e]">
      <h1 className="text-2xl font-bold text-center left-0 py-8">{title}</h1>
      <Form
        className="w-full justify-center items-center space-y-4"
        validationBehavior="native"
        validationErrors={errors}
        action={formAction}
        onSubmit={handleSubmit}
        onReset={() => setErrors({})}
      >
        <div className="w-full px-8 flex flex-col gap-4 max-w-md">
          {fields.map((field) => (
            <Input
              key={field.name}
              name={field.name}
              type={field.type === 'password' && isVisible ? 'text' : field.type}
              label={field.label}
              labelPlacement="outside"
              variant="bordered"
              color="primary"
              isRequired={field.required}
              onValueChange={(val) => {
                if (field.schema) {
                  const res = field.schema.safeParse(val);
                  setErrors((prev) => {
                    if (res.success) {
                      delete prev[field.name];
                      return { ...prev }
                    }
                    return ({
                      ...prev,
                      [field.name]: res.success ? '' : res.error.issues[0]?.message || '',
                    })
                  });
                }
                field.onValueChange?.(val);
              }}
              isInvalid={field.type === "email" ? undefined : (!!errors[field.name])}
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) return `Please enter your ${field.label.toLowerCase()}`;
                if (field.type === 'email' && validationDetails.typeMismatch) return 'Please enter a valid email';
                return errors[field.name];
              }}
              endContent={field.type === 'password' ? (
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
              ) : null}
            />
          ))}
          <div className="flex gap-4">
            <Button
              className="w-full flex justify-center items-center"
              color="primary"
              type="submit"
              aria-disabled={isPending}
              isDisabled={isPending}
            >
              {isPending ? <Spinner color="white" variant="dots" /> : (sendButtonText || title)}
            </Button>
            {resetFormButton && (<Button type="reset" variant="bordered">Reset</Button>)}
          </div>
        </div>
      </Form>
      <section className='w-full flex justify-center mt-3'>
        <div className='w-full max-w-md px-8'>
          {
            thirdPartyProviders && (
              <div className="w-full">
                <div className="flex items-center justify-center my-6">
                  <div className="flex-grow h-px bg-gray-400" />
                  <span className="mx-4 text-gray-400 text-sm font-medium">
                    Or continue with
                  </span>
                  <div className="flex-grow h-px bg-gray-400" />
                </div>

                <div className="flex gap-4 justify-around">
                  {
                    thirdPartyProviders.includes("google") && (
                      <button
                        className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100 transition text-sm font-medium hover:text-gray-700"
                        onClick={() => handleSignInWithProvider("google")}
                      >
                        <GoogleIcon />
                        Google
                      </button>
                    )
                  }

                  {
                    thirdPartyProviders.includes("github") && (
                      <button
                        className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100 transition text-sm font-medium hover:text-gray-700"
                        onClick={() => handleSignInWithProvider("github")}
                      >
                        <GithubIcon />
                        GitHub
                      </button>
                    )
                  }
                </div>
              </div>
            )
          }

          {serverResponse && (
            <div className="w-full flex items-center mt-5 mb-3">
              <Alert
                color={serverResponse.success ? 'success' : 'danger'}
                title={serverResponse.message?.[0] || ''}
                description={serverResponse.message?.[1] || ''}
              />
            </div>
          )}
          {Object.entries(errors).map(([key, value]) => {
            if (key == "providers" || key == "token") {
              return <div key={key} className="w-full flex items-center mt-5 my-3">
                <Alert color="danger" title={value} description="Please try again!" />
              </div>
            }
          })}
        </div>
      </section>
      {extraContent}
    </section>
  );
}
