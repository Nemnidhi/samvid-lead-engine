import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const { leadId: leadIdParam } = await params;
  const leadId = parseInt(leadIdParam, 10);
  if (!leadId) {
    return NextResponse.json({ error: "Invalid leadId" }, { status: 400 });
  }

  const db = await getDb();
  const report = await db.collection("reports").findOne({ lead_id: leadId });
  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const pdfValue = report.pdf;
  const pdfBuffer: Buffer = Buffer.isBuffer(pdfValue) ? pdfValue : Buffer.from(pdfValue.buffer);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${leadId}.pdf"`,
    },
  });
}
