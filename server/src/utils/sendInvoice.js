import nodemailer from "nodemailer";

/* =========================================================
   EMAIL SENDER (INVOICE PDF)
   ========================================================= */

export const sendInvoiceByEmail = async ({
  to,
  subject,
  text,
  pdfBuffer,
  filename = "invoice.pdf",
}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // App password (NOT normal password)
      },
    });

    await transporter.sendMail({
      from: `"Invoice System" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      attachments: [
        {
          filename,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw new Error("Failed to send invoice email");
  }
};

/* =========================================================
   WHATSAPP SHARE (SAFE & REAL)
   ========================================================= */

export const getWhatsAppInvoiceLink = ({
  phone,
  invoiceNumber,
  amount,
  invoiceUrl,
}) => {
  const message = `
🧾 Invoice ${invoiceNumber}

Amount: ₹${amount}

Download invoice:
${invoiceUrl}

Thank you for your business!
`;

  const encodedMessage = encodeURIComponent(message.trim());

  return `https://wa.me/${phone}?text=${encodedMessage}`;
};
