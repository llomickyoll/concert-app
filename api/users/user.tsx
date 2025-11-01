import { apiHandler, ApiResponse } from "@/api/apiService";
import { SignInRequest, SignInResponse, SignUpRequest } from "@/types/user";

export const UserAPI = {
  signIn: async (
    requestData: SignInRequest
  ): Promise<ApiResponse<SignInResponse>> => {
    return apiHandler<SignInRequest, SignInResponse>({
      method: "post",
      url: "users/sign-in",
      requestData,
    });
  },

  signUp: async (
    userId: number,
    requestData: SignUpRequest
  ): Promise<ApiResponse<void>> => {
    return apiHandler<SignUpRequest, void>({
      method: "post",
      url: "users",
      requestData,
      userId,
    });
  },
};
