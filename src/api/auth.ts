// src/api/auth.ts

import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/src/types/auth.type";
import api from "./client";

export const login = (data: LoginRequest) =>
  api.post<AuthResponse>("/auth/login", data);

export const register = (data: RegisterRequest) =>
  api.post<AuthResponse>("/auth/register", data);
