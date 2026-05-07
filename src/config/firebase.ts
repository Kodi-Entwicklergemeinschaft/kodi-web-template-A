import { z } from 'zod';

const FirebaseSchema = z.object({
  apiKey: z.string().min(1, '`VITE_FIREBASE_API_KEY` is missing in `.env`'),
  authDomain: z
    .string()
    .min(1, '`VITE_FIREBASE_AUTH_DOMAIN` is missing in `.env`'),
  projectId: z
    .string()
    .min(1, '`VITE_FIREBASE_PROJECT_ID` is missing in `.env`'),
  storageBucket: z
    .string()
    .min(1, '`VITE_FIREBASE_STORAGE_BUCKET` is missing in `.env`'),
  messagingSenderId: z
    .string()
    .min(1, '`VITE_FIREBASE_MESSAGING_SENDER_ID` is missing in `.env`'),
  appId: z.string().min(1, '`VITE_FIREBASE_APP_ID` is missing in `.env`'),
  measurementId: z
    .string()
    .min(1, '`VITE_FIREBASE_MEASUREMENT_ID` is missing in `.env`'),
});

const firebaseConfig = FirebaseSchema.parse({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
} satisfies z.infer<typeof FirebaseSchema>);

export default firebaseConfig;
