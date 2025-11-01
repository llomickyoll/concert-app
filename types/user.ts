export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  data: User;
  message: string;
  status: number;
  isError: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}
