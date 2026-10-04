function required(name: keyof typeof process.env): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function numeric(name: keyof typeof process.env, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number(raw);
  if (Number.isNaN(n)) {
    throw new Error(
      `Environment variable ${name} must be a number, got: ${raw}`,
    );
  }
  return n;
}

export const env = {
  PORT: numeric("PORT", 3000),
  MONGO_CONNECTION_URI: required("MONGO_CONNECTION_URI"),
  CORS_ORIGIN: required("CORS_ORIGIN"),
  SESSION_SECRET: required("SESSION_SECRET"),
  SESSION_MAX_AGE: numeric("SESSION_MAX_AGE", 1000 * 60 * 60 * 24 * 7),
  CLOUDINARY_CLOUD_NAME: required("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: required("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: required("CLOUDINARY_API_SECRET"),
} as const;
