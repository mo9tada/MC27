import { prisma } from "@/lib/prisma";
import { generateVoucherPdf } from "@/lib/pdf";

export async function GET(_request: Request, ctx: RouteContext<"/api/wheel/[id]">) {
  const { id } = await ctx.params;

  const spin = await prisma.wheelSpin.findUnique({ where: { id } });

  if (!spin) {
    return new Response("Voucher not found", { status: 404 });
  }

  const pdfBytes = await generateVoucherPdf({ name: spin.name, prize: spin.prize, code: spin.code });

  return new Response(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="mc27-voucher-${spin.code}.pdf"`,
    },
  });
}
