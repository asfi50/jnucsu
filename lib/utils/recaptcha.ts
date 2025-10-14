/**
 * Verifies Google reCAPTCHA v3 token with Google's API
 * @param token - The reCAPTCHA token from the client
 * @param expectedAction - The expected action name
 * @param minScore - Minimum score threshold (0.0 - 1.0, default: 0.5)
 * @returns Promise<boolean> - True if verification passes
 */
export async function verifyRecaptcha(
  token: string,
  expectedAction: string,
  minScore: number = 0.5
): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY is not configured");
      return false;
    }

    if (!token) {
      console.error("No reCAPTCHA token provided");
      return false;
    }

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      console.error("reCAPTCHA verification failed:", data["error-codes"]);
      return false;
    }

    // Check if the action matches
    if (data.action !== expectedAction) {
      console.error(
        `reCAPTCHA action mismatch. Expected: ${expectedAction}, Got: ${data.action}`
      );
      return false;
    }

    // Check if the score meets the minimum threshold
    if (data.score < minScore) {
      console.error(
        `reCAPTCHA score too low. Score: ${data.score}, Minimum: ${minScore}`
      );
      return false;
    }

    console.log(
      `reCAPTCHA verification successful. Action: ${data.action}, Score: ${data.score}`
    );
    return true;
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return false;
  }
}
