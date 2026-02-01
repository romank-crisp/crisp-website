/**
 * Email utility for sending contact form submissions
 * 
 * This uses Resend (https://resend.com) as the email provider.
 * To use a different provider, replace the implementation below.
 * 
 * Environment variables required:
 * - RESEND_API_KEY: Your Resend API key
 * - CONTACT_EMAIL_TO: Email address to receive contact form submissions
 * - CONTACT_EMAIL_FROM: Email address to send from (must be verified in Resend)
 */

interface ContactEmailData {
    name: string;
    email: string;
    service: string;
    message: string;
    meetingTime?: string;
}

export async function sendContactEmail(data: ContactEmailData): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL_TO || "hello@crisp.com";
    const fromEmail = process.env.CONTACT_EMAIL_FROM || "noreply@crisp.com";

    if (!apiKey) {
        console.warn("RESEND_API_KEY not configured. Email will not be sent.");
        // In development, just log the email
        if (process.env.NODE_ENV === "development") {
            console.log("📧 Contact Form Submission:", data);
            return;
        }
        throw new Error("Email service not configured");
    }

    const serviceLabels: Record<string, string> = {
        "branding": "Branding",
        "website": "Website",
        "digital-design": "Digital Design",
        "content-creation": "Content Creation",
    };

    const meetingTimeLabels: Record<string, string> = {
        "early-next-week": "Early next week",
        "later-this-week": "Later this week",
        "next-month": "Next month",
        "not-sure": "Not sure yet",
    };

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #120c2a; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #e00c33; color: white; padding: 30px; text-align: center; }
                .content { background-color: #f9fafb; padding: 30px; }
                .field { margin-bottom: 20px; }
                .label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
                .value { margin-top: 5px; font-size: 16px; }
                .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="label">Name</div>
                        <div class="value">${escapeHtml(data.name)}</div>
                    </div>
                    <div class="field">
                        <div class="label">Email</div>
                        <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
                    </div>
                    <div class="field">
                        <div class="label">Service Interested In</div>
                        <div class="value">${serviceLabels[data.service] || data.service}</div>
                    </div>
                    ${data.meetingTime ? `
                    <div class="field">
                        <div class="label">Preferred Meeting Time</div>
                        <div class="value">${meetingTimeLabels[data.meetingTime] || data.meetingTime}</div>
                    </div>
                    ` : ''}
                    <div class="field">
                        <div class="label">Message</div>
                        <div class="value">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
                    </div>
                </div>
                <div class="footer">
                    <p>This email was sent from the Crisp contact form.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const textContent = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Service: ${serviceLabels[data.service] || data.service}
${data.meetingTime ? `Preferred Meeting Time: ${meetingTimeLabels[data.meetingTime] || data.meetingTime}\n` : ''}
Message:
${data.message}

---
This email was sent from the Crisp contact form.
    `;

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                from: fromEmail,
                to: toEmail,
                reply_to: data.email,
                subject: `New Contact: ${data.name} - ${serviceLabels[data.service] || data.service}`,
                html: htmlContent,
                text: textContent,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
        }

        const result = await response.json();
        console.log("Email sent successfully:", result);
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
}

function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}
