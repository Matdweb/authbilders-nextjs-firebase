import admin from 'firebase-admin';

// To get the Firebase Admin SDK key:
// 1. Go to Firebase Console -> Project Settings -> Service Accounts
// 2. Click "Generate New Private Key" button
// 3. Save the downloaded JSON file
// 4. Add the entire JSON content to your .env.local as FIREBASE_ADMIN_SDK_KEY
// Example format of the JSON content:
// {
//   "type": "service_account",
//   "project_id": "your-project-id",
//   "private_key_id": "key-id",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nkey-content\n-----END PRIVATE KEY-----",
//   "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
//   "client_id": "123456789",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk..."
// }
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY!);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const verifyIdToken = (token: string) => admin.auth().verifyIdToken(token);
export const revokeRefreshTokens = (uid: string) => admin.auth().revokeRefreshTokens(uid);
