import { apiHandler, ApiResponse } from "@/api/apiService";
import { SignInRequest, SignInResponse } from "@/types/user";

export const UserAPI = {
  signIn: async (
    requestData: SignInRequest,
  ): Promise<ApiResponse<SignInResponse>> => {
    return apiHandler<SignInRequest, SignInResponse>({
      method: "post",
      url: "users/sign-in",
      requestData,
    });
  },
};
