import "server-only";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const NAVY = rgb(0x07 / 255, 0x15 / 255, 0x26 / 255);
const ACCENT = rgb(0xc5 / 255, 0x8d / 255, 0x5a / 255);
const WHITE = rgb(1, 1, 1);

export async function generateVoucherPdf(params: { name: string; prize: string; code: string }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([420, 240]);

  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawRectangle({ x: 0, y: 0, width: 420, height: 240, color: NAVY });
  page.drawRectangle({ x: 12, y: 12, width: 396, height: 216, borderColor: ACCENT, borderWidth: 2 });

  page.drawText("MC27 COFFEE", {
    x: 32,
    y: 188,
    size: 20,
    font: bold,
    color: ACCENT,
  });

  page.drawText("Spin & Win Voucher", {
    x: 32,
    y: 164,
    size: 12,
    font: regular,
    color: WHITE,
  });

  page.drawText(params.prize, {
    x: 32,
    y: 118,
    size: 28,
    font: bold,
    color: WHITE,
  });

  page.drawText(`Winner: ${params.name}`, {
    x: 32,
    y: 86,
    size: 11,
    font: regular,
    color: WHITE,
  });

  page.drawText(`Code: ${params.code}`, {
    x: 32,
    y: 64,
    size: 14,
    font: bold,
    color: ACCENT,
  });

  page.drawText("Present this voucher at MC27 Coffee to redeem.", {
    x: 32,
    y: 36,
    size: 9,
    font: regular,
    color: WHITE,
  });

  return pdfDoc.save();
}
