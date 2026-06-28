import "server-only";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const MAIL_FROM = process.env.MAIL_FROM ?? process.env.SMTP_USER;

export async function sendOtpEmail(to: string, name: string, code: string) {
  await transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject: "Your MC27 Coffee reservation code",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#163b66;">MC27 Coffee</h2>
        <p>Hi ${name},</p>
        <p>Use this code to confirm your table reservation:</p>
        <p style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color:#163b66;">${code}</p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
}

export async function sendReservationConfirmedEmail(
  to: string,
  name: string,
  details: { date: string; time: string; partySize: number }
) {
  await transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject: "Your MC27 Coffee table is confirmed",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#163b66;">MC27 Coffee</h2>
        <p>Hi ${name}, your table is confirmed!</p>
        <p><strong>Date:</strong> ${details.date}</p>
        <p><strong>Time:</strong> ${details.time}</p>
        <p><strong>Party size:</strong> ${details.partySize}</p>
        <p>We look forward to seeing you.</p>
      </div>
    `,
  });
}

export async function sendContactReplyEmail(to: string, name: string, subject: string, reply: string) {
  await transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject: `Re: ${subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#163b66;">MC27 Coffee</h2>
        <p>Hi ${name},</p>
        <p>${reply.replace(/\n/g, "<br/>")}</p>
        <p>— The MC27 Coffee team</p>
      </div>
    `,
  });
}
