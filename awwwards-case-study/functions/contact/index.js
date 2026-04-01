/**
 * Cloud Function: Contact Form Handler
 * 
 * Handles POST requests from the Crisp website contact form.
 * Validates input, checks for spam (honeypot + time-to-fill),
 * and sends email via Resend API.
 * 
 * Environment variables:
 *   RESEND_API_KEY      - Resend API key (via Secret Manager)
 *   CONTACT_EMAIL_TO    - Recipient email
 *   CONTACT_EMAIL_FROM  - Sender email (verified in Resend)
 *   ALLOWED_ORIGIN      - CORS origin for the static site
 */

import functions from "@google-cloud/functions-framework";

// Rate limiting store (in-memory, resets on cold start)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

function checkRateLimit(ip) {
    const now = Date.now();
    const record = rateLimitStore.get(ip);
    if (!record || now > record.resetTime) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }
    if (record.count >= MAX_REQUESTS) return false;
    record.count++;
    return true;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

async function sendContactEmail(data) {
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL_TO || "hello@crisp-studio.com";
    const fromEmail = process.env.CONTACT_EMAIL_FROM || "noreply@crisp-studio.com";

    if (!apiKey) throw new Error("RESEND_API_KEY not configured");

    const serviceLabels = {
        "branding": "Branding",
        "website": "Website",
        "digital-design": "Digital Design",
        "content-creation": "Content Creation",
    };

    const meetingTimeLabels = {
        "early-next-week": "Early next week",
        "later-this-week": "Later this week",
        "next-month": "Next month",
        "not-sure": "Not sure yet",
        "tomorrow": "Tomorrow",
        "in-2-3-days": "In 2-3 days",
        "mid-next-week": "Mid next week",
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
                    <div class="field"><div class="label">Name</div><div class="value">${escapeHtml(data.name)}</div></div>
                    <div class="field"><div class="label">Email</div><div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div></div>
                    <div class="field"><div class="label">Service</div><div class="value">${serviceLabels[data.service] || data.service}</div></div>
                    ${data.meetingTime ? `<div class="field"><div class="label">Meeting Time</div><div class="value">${meetingTimeLabels[data.meetingTime] || data.meetingTime}</div></div>` : ''}
                    <div class="field"><div class="label">Message</div><div class="value">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div></div>
                </div>
                <div class="footer"><p>Sent from the Crisp contact form.</p></div>
            </div>
        </body>
        </html>`;

    const textContent = `New Contact Form Submission\n\nName: ${data.name}\nEmail: ${data.email}\nService: ${serviceLabels[data.service] || data.service}\n${data.meetingTime ? `Meeting Time: ${meetingTimeLabels[data.meetingTime] || data.meetingTime}\n` : ''}Message:\n${data.message}`;

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
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
}

functions.http("contactForm", async (req, res) => {
    const allowedOrigin = process.env.ALLOWED_ORIGIN || "https://crisp-studio.com";

    // CORS headers
    res.set("Access-Control-Allow-Origin", allowedOrigin);
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");

    if (req.method === "OPTIONS") {
        return res.status(204).send("");
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const ip = req.headers["x-forwarded-for"] || req.ip || "unknown";
        if (!checkRateLimit(ip)) {
            return res.status(429).json({ error: "Too many requests. Please try again later." });
        }

        const body = req.body;

        // Honeypot check
        if (body.website) {
            console.log(`[Antispam] Honeypot triggered from IP: ${ip}`);
            return res.status(200).json({ success: true, message: "Message sent successfully" });
        }

        // Time-to-fill check (< 3 seconds = bot)
        if (body.timeToFill !== undefined && body.timeToFill < 3000) {
            console.log(`[Antispam] Fast fill (${body.timeToFill}ms) from IP: ${ip}`);
            return res.status(200).json({ success: true, message: "Message sent successfully" });
        }

        // Validation
        const errors = {};
        if (!body.name?.trim()) errors.name = "Name is required";
        if (!body.email?.trim()) errors.email = "Email is required";
        else if (!validateEmail(body.email)) errors.email = "Invalid email format";
        if (!body.service) errors.service = "Service selection is required";
        if (!body.message?.trim()) errors.message = "Message is required";

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ error: "Validation failed", errors });
        }

        await sendContactEmail({
            name: body.name,
            email: body.email,
            service: body.service,
            message: body.message,
            meetingTime: body.meetingTime,
        });

        return res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
        console.error("Contact form error:", error);
        return res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
});
