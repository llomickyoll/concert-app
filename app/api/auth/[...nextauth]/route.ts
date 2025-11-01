import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

import authOptions from "@/app/api/auth/[...nextauth]/authOptions";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      isAdmin: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
  }
}

declare module "next-auth" {
  interface User {
    name: string;
    email: string;
    id: number;
    isAdmin: boolean;
  }
}

const handler = async (
  req: NextRequest,
  res: NextResponse,
): Promise<void | Response> => {
  const maxAge = Number(process.env.NEXT_AUTH_SESSIONS || 2592000);

  return await NextAuth(
    req as unknown as NextApiRequest,
    res as unknown as NextApiResponse,
    {
      ...authOptions,
      session: { strategy: "jwt", maxAge: maxAge },
    },
  );
};

export { handler as GET, handler as POST };
