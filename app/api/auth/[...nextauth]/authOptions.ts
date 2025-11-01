import CredentialsProvider from "next-auth/providers/credentials";
import { type AuthOptions } from "next-auth";
import { AxiosError } from "axios";

import { UserAPI } from "@/api/users/user";
import { User } from "@/types/user";
const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials): Promise<User | null> {
        const requestData = {
          email: (credentials as Record<string, string>)?.email,
          password: (credentials as Record<string, string>)?.password,
        };

        const { response, isError, error } = await UserAPI.signIn(requestData);

        if (isError) {
          // Extract error message from API response
          const axiosError = error as AxiosError<{ message?: string }>;
          const errorMessage =
            axiosError?.response?.data?.message ||
            axiosError?.message ||
            "Wrong password";

          throw new Error(errorMessage);
        }

        return response?.data as User | null;
      },
    }),
  ],
  pages: {
    signIn: "/",
    error: "/",
    signOut: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id as number;
        token.name = user.name;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.name = token?.name as string;
        session.user.email = token?.email as string;
        session.user.isAdmin = token?.isAdmin as boolean;
      }

      return session;
    },
  },
};

export default authOptions;
