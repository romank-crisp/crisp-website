import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";

// Rate limiting store (in-memory, resets on server restart)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5; // Max 5 submissions per hour per IP

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (record.count >= MAX_REQUESTS) {
        return false;
    }

    record.count++;
    return true;
}

function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

interface ContactFormData {
    name: string;
    email: string;
    service: string;
    message: string;
    meetingTime?: string;
    website?: string;
    timeToFill?: number;
}

export async function POST(request: NextRequest) {
    try {
        // Get client IP for rate limiting
        const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

        // Check rate limit
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        const body: ContactFormData = await request.json();

        // Spam protection: honeypot and time-to-fill validation
        // 1. Honeypot check
        if (body.website) {
            console.log(`[Antispam] Blocked submission with honeypot field from IP: ${ip}`);
            // Silently accept it to deceive bots
            return NextResponse.json(
                { success: true, message: "Message sent successfully" },
                { status: 200 }
            );
        }

        // 2. Minimum time-to-fill validation (3 seconds)
        if (body.timeToFill !== undefined && body.timeToFill < 3000) {
            console.log(`[Antispam] Blocked fast submission (${body.timeToFill}ms) from IP: ${ip}`);
            // Silently accept it
            return NextResponse.json(
                { success: true, message: "Message sent successfully" },
                { status: 200 }
            );
        }

        // Server-side validation
        const errors: Record<string, string> = {};

        if (!body.name || body.name.trim().length === 0) {
            errors.name = "Name is required";
        }

        if (!body.email || body.email.trim().length === 0) {
            errors.email = "Email is required";
        } else if (!validateEmail(body.email)) {
            errors.email = "Invalid email format";
        }

        if (!body.service) {
            errors.service = "Service selection is required";
        }

        if (!body.message || body.message.trim().length === 0) {
            errors.message = "Message is required";
        }

        if (Object.keys(errors).length > 0) {
            return NextResponse.json(
                { error: "Validation failed", errors },
                { status: 400 }
            );
        }

        // Send email
        await sendContactEmail({
            name: body.name,
            email: body.email,
            service: body.service,
            message: body.message,
            meetingTime: body.meetingTime,
        });

        return NextResponse.json(
            { success: true, message: "Message sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Failed to send message. Please try again later." },
            { status: 500 }
        );
    }
}
