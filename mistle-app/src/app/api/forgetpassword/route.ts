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
        { error: "No Linked Account Found!" },
        { status: 400 }
      );
    }

    // Generate reset token and expiry
    const resetToken = generateResetToken();
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save reset token and expiry to user
    user.forgotPasswordToken = resetToken;
    user.forgotPasswordTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset password email
    await sendEmail({ email, emailType: "RESET", userId: user._id });

    return NextResponse.json({ message: "Reset Password Link Sent!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateResetToken() {
  // Implement your token generation logic here
}
