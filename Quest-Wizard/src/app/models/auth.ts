export type UserRole = "WIZARD" | "TOWER";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: UserRole;
  name?: string; 
  affinity?: string; 
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

export interface CurrentUserProfile {
  id: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  name?: string;
  level?: number;
  affinity?: string;
  xp?: number;
  pictureUrl?: string;
  rank?: string;
}