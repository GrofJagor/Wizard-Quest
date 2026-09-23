export type UserRole = "WIZARD" | "TOWER";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: UserRole;
  name?: string; // required by backend only when role === "WIZARD"
  affinity?: string; // required by backend only when role === "WIZARD"
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

/** Shape returned by GET /users/me — a superset covering both Wizard and Tower fields. */
export interface CurrentUserProfile {
  id: string;
  email: string;
  role: UserRole;
  createdAt?: string;

  // Wizard-only
  name?: string;
  level?: number;
  affinity?: string;
  xp?: number;
  pictureUrl?: string;

  // Tower-only
  rank?: string;
}