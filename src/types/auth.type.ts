export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type AuthResponse = import("./common.type").ApiResponse<AuthData>;

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenData {
  accessToken: string;
  refreshToken: string;
}

export type RefreshTokenResponse = import("./common.type").ApiResponse<RefreshTokenData>;
