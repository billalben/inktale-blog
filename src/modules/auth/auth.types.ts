export interface SessionUser {
  userAuthenticated: true;
  name: string;
  username: string;
  profilePhotoURL?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
