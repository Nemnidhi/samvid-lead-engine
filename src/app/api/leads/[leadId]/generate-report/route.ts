import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getDb } from "@/lib/mongodb";
import { generateParagraph } from "@/lib/generateParagraph";
import { buildReportDocument } from "@/lib/reportTemplate";

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
  const lead = await db.collection("leads").findOne({ lead_id: leadId });
  const enrichment = await db.collection("enrichment").findOne({ lead_id: leadId });
  const classification = await db.collection("classification").findOne({ lead_id: leadId });

  if (!lead || !enrichment || !classification) {
    return NextResponse.json(
      {
        error: `Missing data for lead_id ${leadId}`,
        have: { lead: !!lead, enrichment: !!enrichment, classification: !!classification },
      },
      { status: 404 }
    );
  }

  const paragraphResult = await generateParagraph(lead, enrichment, classification);
  const doc = buildReportDocument({
    lead,
    enrichment,
    classification,
    paragraph: paragraphResult.text,
  });
  const pdfBuffer = await renderToBuffer(doc);

  await db.collection("reports").updateOne(
    { lead_id: leadId },
    {
      $set: {
        lead_id: leadId,
        pdf: pdfBuffer,
        generated_at: new Date(),
        category_used: classification.category,
        paragraph_source: paragraphResult.source,
      },
    },
    { upsert: true }
  );

  await db.collection("leads").updateOne({ lead_id: leadId }, { $set: { status: "reported" } });

  return NextResponse.json({
    ok: true,
    size: pdfBuffer.length,
    paragraphSource: paragraphResult.source,
  });
}
