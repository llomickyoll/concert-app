import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AxiosError } from "axios";

import { ReservationAPI } from "@/api/reservations/reservation";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { isError: true, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const response = await ReservationAPI.getReservations(userId);

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        isError: true,
        error:
          (error as AxiosError<{ message: string }>) || "Internal server error",
      },
      { status: 500 },
    );
  }
}
