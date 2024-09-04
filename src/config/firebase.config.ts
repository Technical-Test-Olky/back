require("dotenv").config();
import { cert, initializeApp, ServiceAccount } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { checkEnvVars } from "../utils/checkEnvVars";

const requiredEnvVars = [
  "PROJECT_ID",
  "PRIVATE_KEY",
  "CLIENT_EMAIL",
  "FIREBASE_BUCKET_NAME",
];
checkEnvVars(requiredEnvVars);

const firebaseConfig: ServiceAccount = {
  projectId: process.env.PROJECT_ID,
  privateKey: process.env.PRIVATE_KEY!.replace(/\\n/g, "\n"),
  clientEmail: process.env.CLIENT_EMAIL,
};

export const app = initializeApp({
  credential: cert(firebaseConfig),
});

const bucketName = process.env.FIREBASE_BUCKET_NAME;
export const storage = getStorage(app);
export const bucketStorage = storage.bucket(bucketName);
