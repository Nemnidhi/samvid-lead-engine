import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { sendReportEmail } from "@/lib/sendEmail";

const DAILY_SEND_LIMIT = parseInt(process.env.SEND_DAILY_LIMIT || "10", 10);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const { leadId: leadIdParam } = await params;
  const leadId = parseInt(leadIdParam, 10);
  if (!leadId) {
    return NextResponse.json({ error: "Invalid leadId" }, { status: 400 });
  }

  const db = await getDb();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const sentToday = await db
    .collection("outreach_log")
    .countDocuments({ sent_at: { $gte: startOfToday } });

  if (sentToday >= DAILY_SEND_LIMIT) {
    return NextResponse.json(
      { error: `Daily send limit reached (${sentToday}/${DAILY_SEND_LIMIT}). Try again tomorrow.` },
      { status: 429 }
    );
  }

  const lead = await db.collection("leads").findOne({ lead_id: leadId });
  const report = await db.collection("reports").findOne({ lead_id: leadId });

  if (!lead) {
    return NextResponse.json({ error: `Lead ${leadId} not found` }, { status: 404 });
  }
  if (!lead.email) {
    return NextResponse.json({ error: `Lead ${leadId} has no email address on file` }, { status: 400 });
  }
  if (!report) {
    return NextResponse.json(
      { error: `No report generated yet for lead ${leadId} - generate one first` },
      { status: 400 }
    );
  }

  const pdfValue = report.pdf;
  const pdfBuffer: Buffer = Buffer.isBuffer(pdfValue) ? pdfValue : Buffer.from(pdfValue.buffer);

  const info = await sendReportEmail({ lead, pdfBuffer });

  await db.collection("outreach_log").insertOne({
    lead_id: leadId,
    sent_at: new Date(),
    opened: false,
    replied: false,
    channel: "email",
    message_id: info.messageId,
  });

  await db.collection("leads").updateOne({ lead_id: leadId }, { $set: { status: "sent" } });

  return NextResponse.json({ ok: true, messageId: info.messageId, sentToday: sentToday + 1, DAILY_SEND_LIMIT });
}
