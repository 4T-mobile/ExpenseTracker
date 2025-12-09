import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
} from "../types/auth.type";
import api from "./client";

export const login = (data: LoginRequest) =>
  api.post<AuthResponse>("/auth/login", data);

export const register = (data: RegisterRequest) =>
  api.post<AuthResponse>("/auth/register", data);

export const refreshToken = (data: RefreshTokenRequest) =>
  api.post<RefreshTokenResponse>("/auth/refresh", data);

export const logout = () => api.post("/auth/logout");

export const getProfile = () => api.get<User>("/auth/me");

// export const getProfile = () =>
//   api.get<User>("/auth/me");
