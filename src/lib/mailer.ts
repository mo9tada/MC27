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
