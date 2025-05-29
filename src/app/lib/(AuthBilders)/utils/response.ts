import type {
    AuthServerActionState,
    AuthServerActionStateUser,
    AuthServerActionStateData,
    AuthServerActionStateErrors
} from "../defintions";

type AuthServerActionStateExtras = {
    user?: AuthServerActionStateUser;
    data?: AuthServerActionStateData;
    errors?: AuthServerActionStateErrors;
};

export const successResponse = (
    message: string[] = [],
    extras?: Omit<AuthServerActionStateExtras, 'errors'>
): AuthServerActionState => ({
    success: true,
    message,
    ...(extras || {}),
});

export const errorResponse = (
    message: string[] = [],
    errors?: AuthServerActionStateErrors
): AuthServerActionState => ({
    success: false,
    message,
    errors,
});
