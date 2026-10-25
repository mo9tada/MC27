import "server-only";
import nodemailer from "nodemailer";
import { absoluteUrl } from "@/lib/site";

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
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? process.env.SMTP_USER;

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function sendOtpEmail(to: string, name: string, code: string) {
  await transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject: "Votre code de réservation MC27 Coffee",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#163b66;">MC27 Coffee</h2>
        <p>Bonjour ${name},</p>
        <p>Utilisez ce code pour confirmer votre réservation de table :</p>
        <p style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color:#163b66;">${code}</p>
        <p>Ce code expire dans 10 minutes.</p>
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
    subject: "Votre table MC27 Coffee est confirmée",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#163b66;">MC27 Coffee</h2>
        <p>Bonjour ${name}, votre table est confirmée !</p>
        <p><strong>Date :</strong> ${details.date}</p>
        <p><strong>Heure :</strong> ${details.time}</p>
        <p><strong>Nombre de personnes :</strong> ${details.partySize}</p>
        <p>Nous avons hâte de vous accueillir.</p>
      </div>
    `,
  });
}

export async function sendContactReplyEmail(to: string, name: string, subject: string, reply: string) {
  await transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject: `Re : ${subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#163b66;">MC27 Coffee</h2>
        <p>Bonjour ${name},</p>
        <p>${reply.replace(/\n/g, "<br/>")}</p>
        <p>— L'équipe MC27 Coffee</p>
      </div>
    `,
  });
}

// Fallback for admin push notifications when no phone could be reached.
export async function sendAdminAlertEmail(alert: { title: string; body: string; url?: string }) {
  if (!ADMIN_EMAIL) return;

  const link = absoluteUrl(alert.url ?? "/admin");

  await transporter.sendMail({
    from: MAIL_FROM,
    to: ADMIN_EMAIL,
    subject: `[MC27 Admin] ${alert.title}`,
    priority: "high",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#163b66;">${escapeHtml(alert.title)}</h2>
        <p style="font-size: 16px;">${escapeHtml(alert.body)}</p>
        <p><a href="${link}" style="color:#163b66; font-weight: 600;">Ouvrir le tableau de bord</a></p>
        <p style="color:#888; font-size: 12px;">Envoyé par e-mail car aucune notification mobile n'a pu être délivrée.</p>
      </div>
    `,
  });
}
