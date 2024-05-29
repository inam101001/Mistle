import User from "@/app/models/User";
import connect from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User Account Not Found!" },
        { status: 400 }
      );
    }

    // Send verify password email
    await sendEmail({ email, emailType: "VERIFY", userId: user._id });

    return NextResponse.json({
      message: "Verify Email Link Sent!",
      success: true,
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
