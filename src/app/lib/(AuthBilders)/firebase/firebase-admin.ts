import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY!);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const verifyIdToken = (token: string) => admin.auth().verifyIdToken(token);
export const revokeRefreshTokens = (uid: string) => admin.auth().revokeRefreshTokens(uid);
