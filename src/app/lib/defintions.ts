import type { CreateEmailResponseSuccess } from "resend";

export type prevActionState =
  ({
    success: boolean;
    message: string[];
  });

export type resetPasswordEmailActionState =
  | ({
    data: CreateEmailResponseSuccess | null;
  } & prevActionState)
  | undefined;

export type authenticateActionState =
  | ({
    user: FirebaseUser | null;
  }
    & prevActionState
    & authenticateActionErrors)
  | undefined;

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
