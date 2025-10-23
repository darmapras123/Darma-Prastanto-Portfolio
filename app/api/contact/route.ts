// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ ok: false, error: "Message is required" }, { status: 400 });
    }

    const subject = `New message from portfolio${name ? ` — ${name}` : ""}`;

    const toEnv = process.env.CONTACT_TO;
    const fromEnv = process.env.CONTACT_FROM;

    if (!toEnv || !fromEnv) {
      return NextResponse.json(
        { ok: false, error: "Missing CONTACT_TO or CONTACT_FROM env." },
        { status: 500 }
      );
    }

    // Dukung multi-email dipisah koma (kalau hanya satu, tetap string)
    const to = toEnv.includes(",")
      ? toEnv.split(",").map((s) => s.trim()).filter(Boolean)
      : toEnv;

    const from = fromEnv;

    const html = `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system">
        <h2 style="margin:0 0 12px">New Portfolio Message</h2>
        ${name ? `<p><b>Name:</b> ${escapeHtml(name)}</p>` : ""}
        ${email ? `<p><b>Email:</b> ${escapeHtml(email)}</p>` : ""}
        <p><b>Message:</b></p>
        <pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px">${escapeHtml(message)}</pre>
      </div>
    `;

    // 🔎 DEBUG ENV (hapus setelah beres)
    const masked = (process.env.RESEND_API_KEY || "").replace(/^(.{6}).+$/, "$1********");
    console.log("ENV CHECK:", {
      hasApiKey: !!process.env.RESEND_API_KEY,
      apiKeyStartsWith: masked,
      toEnv: toEnv,
      fromEnv: fromEnv,
    });

    const { error } = await resend.emails.send({
      to,
      from,
      subject,
      html,
      replyTo: email || undefined,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ ok: false, error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("API /contact error:", err);
    return NextResponse.json({ ok: false, error: err?.message || "Invalid request" }, { status: 400 });
  }
}

// ——— helper sederhana anti XSS
function escapeHtml(input: string) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
