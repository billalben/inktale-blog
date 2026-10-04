import bcrypt from "bcrypt";
import { User } from "../user/user.model.js";
import { generateUsername } from "../../shared/utils/username.js";
import type { LoginInput, RegisterInput, SessionUser } from "./auth.types.js";

export type AuthError =
  | { code: "duplicate_email" }
  | { code: "duplicate_username" }
  | { code: "invalid_credentials" }
  | { code: "unknown"; message: string };

export async function registerUser(input: RegisterInput): Promise<AuthError | null> {
  try {
    const username = generateUsername(input.name);
    const hashedPassword = await bcrypt.hash(input.password, 10);

    await User.create({
      name: input.name,
      email: input.email,
      username,
      password: hashedPassword,
    });

    return null;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: unknown }).code === 11000
    ) {
      const keyPattern = (error as { keyPattern?: Record<string, number> })
        .keyPattern;
      if (keyPattern?.email) return { code: "duplicate_email" };
      if (keyPattern?.username) return { code: "duplicate_username" };
    }
    return {
      code: "unknown",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function loginUser(
  input: LoginInput,
): Promise<{ user: SessionUser } | AuthError> {
  const currentUser = await User.findOne({ email: input.email });

  if (!currentUser) {
    return { code: "invalid_credentials" };
  }

  const passwordIsValid = await bcrypt.compare(
    input.password,
    currentUser.password,
  );

  if (!passwordIsValid) {
    return { code: "invalid_credentials" };
  }

  return {
    user: {
      userAuthenticated: true,
      name: currentUser.name,
      username: currentUser.username,
      profilePhotoURL: currentUser.profilePhoto?.url,
    },
  };
}
