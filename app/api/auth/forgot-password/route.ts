import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // TODO: Implement actual password reset logic
    // For now, we'll just simulate success
    // In a real implementation, you would:
    // 1. Check if user exists with this email
    // 2. Generate a reset token
    // 3. Store the token with expiration
    // 4. Send email with reset link

    console.log(`Password reset requested for email: ${email}`);

    return NextResponse.json(
      {
        message:
          "If an account with this email exists, you will receive password reset instructions.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
