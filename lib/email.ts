/*
John 1:5
The light shines in darkness, but the darkness has not understood it 
*/
import nodemailer from "nodemailer"

// Email configuration
export function createEmailTransporter() {
  return nodemailer.createTransport({
    host: "mail.neontek.co.ke",
    port: 465,
    secure: true, 
    auth: {
      user: "blog@neontek.co.ke",
      pass: process.env.EMAIL_PASSWORD, 
    },
  })
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html?: string
  text?: string
}) {
  try {
    const transporter = createEmailTransporter()

    // Test the connection
    await transporter.verify()

    const mailOptions = {
      from: '"NeonTek Blog" <blog@neontek.co.ke>',
      to,
      subject,
      ...(html && { html }),
      ...(text && { text }),
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendBulkEmail({
  emails,
  subject,
  html,
  text,
}: {
  emails: string[]
  subject: string
  html?: string
  text?: string
}) {
  try {
    const transporter = createEmailTransporter()

    // Test the connection
    await transporter.verify()

    const results = []

    for (const email of emails) {
      try {
        const mailOptions = {
          from: '"NeonTek Blog" <blog@neontek.co.ke>',
          to: email,
          subject,
          ...(html && { html }),
          ...(text && { text }),
        }

        const result = await transporter.sendMail(mailOptions)
        results.push({ email, success: true, messageId: result.messageId })
      } catch (error) {
        console.error(`Error sending email to ${email}:`, error)
        results.push({ email, success: false, error: error instanceof Error ? error.message : "Unknown error" })
      }
    }

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.filter((r) => !r.success).length

    return {
      success: true,
      results,
      summary: {
        total: emails.length,
        successful: successCount,
        failed: failureCount,
      },
    }
  } catch (error) {
    console.error("Error in bulk email sending:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
