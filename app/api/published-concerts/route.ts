import { NextResponse } from "next/server";

import { ConcertsAPI } from "@/api/concerts/concert";

export async function GET() {
  const response = await ConcertsAPI.getPublishedConcerts();

  return NextResponse.json(response);
}
