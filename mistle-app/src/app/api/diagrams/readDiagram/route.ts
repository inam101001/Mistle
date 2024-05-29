import connect from "@/app/utils/db";
import Diagram from "@/app/models/Diagram";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const userID = await request.json();

  if (!userID) {
    return new NextResponse("User ID is required", { status: 400 });
  }

  try {
    await connect();
    const diagrams = await Diagram.find({ owner: userID });
    return NextResponse.json({ diagrams });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
