// Outreach email sending via a Hostinger-hosted mailbox over SMTP. Shared
// (require-based, CommonJS) between the Next.js API route and any standalone
// CLI scripts, same pattern as classify.js / generateParagraph.js.

const nodemailer = require("nodemailer");

function buildTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465", 10),
    secure: true, // port 465 = implicit TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function buildEmailContent(lead) {
  const location = [lead.district, lead.state].filter(Boolean).join(", ");
  const subject = `${lead.name} - a quick look at your online presence`;
  const text =
    `Hi,\n\n` +
    `We took a quick look at ${lead.name}'s online presence as part of a review of ` +
    `real estate businesses in ${location}. Attached is a short report summarizing ` +
    `what we found and what it could mean for reaching more clients online.\n\n` +
    `Best,\nSamvid Team`;
  return { subject, text };
}

async function sendReportEmail({ lead, pdfBuffer }) {
  const transport = buildTransport();
  const { subject, text } = buildEmailContent(lead);
  const safeName = lead.name.replace(/[^a-z0-9]+/gi, "_").slice(0, 60);

  const info = await transport.sendMail({
    from: process.env.EMAIL_FROM_ADDRESS,
    to: lead.email,
    subject,
    text,
    attachments: [
      {
        filename: `${safeName}-report.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  return info;
}

module.exports = { buildTransport, buildEmailContent, sendReportEmail };
