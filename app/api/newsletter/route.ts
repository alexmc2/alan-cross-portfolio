// app/api/newsletter/route.ts
import { Resend } from "resend";

export const POST = async (request: Request) => {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error("Missing Resend configuration");
    return Response.json(
      { error: "Newsletter subscriptions are not configured." },
      { status: 503 }
    );
  }

  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return Response.json({ error: "Valid email is required." }, { status: 400 });
    }

    const resend = new Resend(apiKey);

    await resend.contacts.create({
      email,
      unsubscribed: false,
      audienceId,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Newsletter subscription failed", error);
    return Response.json(
      { error: "Error subscribing to updates" },
      { status: 400 }
    );
  }
};
