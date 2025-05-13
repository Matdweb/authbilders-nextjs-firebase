import type { CreateEmailResponseSuccess } from "resend";

export type AuthServerActionState = {
  success?: boolean;
  message?: string[];
  user?: {
    uid?: string;
    email?: string;
    displayName?: string;
  } | null;
  data?: CreateEmailResponseSuccess | null;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    [key: string]: string[] | undefined;
  };
} | undefined;

export type FirebaseUser = {
  uid?: string;
  email?: string;
  displayName?: string;
};

export type authenticateActionErrors = {
  name?: string[] | undefined;
  email?: string[] | undefined;
  password?: string[] | undefined;
};
