import admin from 'firebase-admin';

export const updateUserPassword = async (email: string, password: string) => {
    const user = await admin.auth().getUserByEmail(email);
    if (!user) return null;
    return admin.auth().updateUser(user.uid, { password });
};

export const verifyEmailInFirebase = async (email: string) => {
    const user = await admin.auth().getUserByEmail(email);
    if (user.emailVerified) return true;
    await admin.auth().updateUser(user.uid, { emailVerified: true });
    return true;
};