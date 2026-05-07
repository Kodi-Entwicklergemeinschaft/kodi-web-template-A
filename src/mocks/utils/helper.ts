import { HttpResponse } from 'msw';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Standard success wrapper
const success = <T>(data: T, status: number = 200) =>
  HttpResponse.json(
    { success: true, ...data },
    { status, headers: { 'Content-Type': 'application/json' } }
  );

// Standard error wrapper
const error = (message: string, status: number = 500) =>
  HttpResponse.json(
    { success: false, error: message },
    { status, headers: { 'Content-Type': 'application/json' } }
  );

export { error, sleep, success };
