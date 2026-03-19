"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Dropdown } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Upload } from "lucide-react";
import { useContactForm } from "@/context/ContactFormContext";

interface FormData {
    name: string;
    email: string;
    service: string;
    message: string;
    meetingTime: string;
    gdprConsent: boolean;
    // Honeypot field for spam protection
    website: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    service?: string;
    message?: string;
    meetingTime?: string;
    gdprConsent?: string;
}

interface ContactFormProps {
    onSuccess: () => void;
    onInteractionStart?: () => void;
}

export function ContactForm({ onSuccess, onInteractionStart }: ContactFormProps) {
    const { prefillData } = useContactForm();
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        service: "",
        message: "",
        meetingTime: "",
        gdprConsent: false,
        website: "", // Honeypot
    });
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [startTime, setStartTime] = useState<number>(0);

    // Apply prefill data when it changes
    useEffect(() => {
        if (prefillData) {
            setFormData(prev => ({
                ...prev,
                service: prefillData.service ?? prev.service,
                message: prefillData.message ?? prev.message,
            }));
        }
    }, [prefillData]);

    useEffect(() => {
        setStartTime(Date.now());
    }, []);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showMeetingField, setShowMeetingField] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Responsive sizing logic for 1300px breakpoint
    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth <= 1300);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const sizeVariant = isSmallScreen ? "medium" : "large";
    const buttonSize = isSmallScreen ? "medium" : "large";

    const serviceOptions = [
        { label: "Branding", value: "branding" },
        { label: "Website", value: "website" },
        { label: "Digital Design", value: "digital-design" },
        { label: "Content Creation", value: "content-creation" },
    ];

    const meetingTimeOptions = [
        { label: "Tomorrow", value: "tomorrow" },
        { label: "In 2-3 days", value: "in-2-3-days" },
        { label: "Early next week", value: "early-next-week" },
        { label: "Mid next week", value: "mid-next-week" },
    ];

    // Show meeting field when email is entered
    useEffect(() => {
        if (formData.email.trim().length > 0 && !showMeetingField) {
            setShowMeetingField(true);
        }
    }, [formData.email, showMeetingField]);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.service) {
            newErrors.service = "Please select a service";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        }

        if (!formData.gdprConsent) {
            newErrors.gdprConsent = "You must agree to the privacy policy";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        // Check honeypot
        if (formData.website) {
            // Likely spam, silently fail
            setTimeout(() => onSuccess(), 1000);
            return;
        }

        const timeToFill = Date.now() - startTime;
        if (timeToFill < 3000) {
            // Filled too quickly, likely a bot
            setTimeout(() => onSuccess(), 1000);
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_CONTACT_API_URL || "/api/contact";
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    service: formData.service,
                    message: formData.message,
                    meetingTime: formData.meetingTime,
                    website: formData.website,
                    timeToFill: Date.now() - startTime,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to send message");
            }

            onSuccess();
        } catch (error) {
            console.error("Form submission error:", error);
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Failed to send message. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: keyof FormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-24">
            {/* All fields shown by default */}
            <div className="space-y-24">
                <Input
                    id="contact-name"
                    sizeVariant={sizeVariant}
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    onFocus={() => onInteractionStart?.()}
                    variant={errors.name ? "error" : "default"}
                    title={errors.name}
                    aria-label="Your name"
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    disabled={isSubmitting}
                />

                <Input
                    sizeVariant={sizeVariant}
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    variant={errors.email ? "error" : "default"}
                    title={errors.email}
                    aria-label="Your business email"
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    disabled={isSubmitting}
                    onFocus={() => onInteractionStart?.()}
                />

                <Dropdown
                    sizeVariant={sizeVariant}
                    placeholder="What can we do for you?"
                    options={serviceOptions}
                    value={formData.service}
                    onChange={(value) => updateField("service", value)}
                    variant={errors.service ? "error" : "default"}
                    aria-label="Select service type"
                    aria-required="true"
                    aria-invalid={!!errors.service}
                    onFocus={() => onInteractionStart?.()}
                />
                {errors.service && (
                    <p className="text-[10px] text-brand uppercase font-bold tracking-tight -mt-16">
                        {errors.service}
                    </p>
                )}

                <textarea
                    className={`w-full bg-slate-100 ${isSmallScreen ? 'h-[100px] text-h4' : 'h-[140px] text-h3'} px-16 py-12 rounded-[var(--corner-small)] transition-all duration-300 outline-none font-heading placeholder:opacity-60 focus:bg-slate-200 resize-none`}
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    aria-label="Your message"
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    disabled={isSubmitting}
                    onFocus={() => onInteractionStart?.()}
                />
                {errors.message && (
                    <p className="text-[10px] text-brand uppercase font-bold tracking-tight -mt-16">
                        {errors.message}
                    </p>
                )}

                {/* Upload files field — shown when opened from calculator */}
                {prefillData?.showUpload && (
                    <div className="space-y-8">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full flex items-center justify-center gap-8 bg-slate-100 ${isSmallScreen ? 'h-[48px] text-h4' : 'h-[56px] text-h3'} px-16 rounded-[var(--corner-small)] transition-all duration-300 font-heading placeholder:opacity-60 hover:bg-slate-200 cursor-pointer text-text/50`}
                        >
                            <Upload size={18} />
                            {uploadFiles.length > 0
                                ? `${uploadFiles.length} file${uploadFiles.length > 1 ? 's' : ''} selected`
                                : 'Upload files'
                            }
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={(e) => setUploadFiles(Array.from(e.target.files ?? []))}
                            className="hidden"
                            accept="image/*,.pdf,.zip,.psd,.ai,.fig"
                        />
                        {uploadFiles.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                                {uploadFiles.map((f, i) => (
                                    <span key={i} className="text-[10px] text-text/40 font-heading bg-slate-100 px-8 py-2 rounded">
                                        {f.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Honeypot field - hidden from users */}
            <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) => updateField("website", e.target.value)}
                style={{ position: "absolute", left: "-9999px" }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
            />

            {/* Meeting field - appears after email is entered */}
            {showMeetingField && (
                <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    <label className={`${isSmallScreen ? 'text-text-sm' : 'text-h4'} text-text/60 font-heading block`}>
                        Meet online (we will send you few slots)
                    </label>
                    <Dropdown
                        sizeVariant={sizeVariant}
                        placeholder="Select preferred time"
                        options={meetingTimeOptions}
                        value={formData.meetingTime}
                        onChange={(value) => updateField("meetingTime", value)}
                        onFocus={() => onInteractionStart?.()}
                        aria-label="Preferred meeting time"
                    />
                </div>
            )}

            {/* GDPR Consent */}
            <div className="space-y-16 pt-8">
                <label className="flex items-center gap-16 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={formData.gdprConsent}
                        onChange={(e) => updateField("gdprConsent", e.target.checked)}
                        className="w-24 h-24 rounded border-2 border-text/20 checked:bg-black checked:border-black focus:ring-2 focus:ring-black/20 cursor-pointer transition-colors"
                        aria-required="true"
                        aria-invalid={!!errors.gdprConsent}
                        disabled={isSubmitting}
                    />
                    <span className="text-text-sm text-text/60 leading-relaxed font-text">
                        I agree to the{" "}
                        <a
                            href="/privacy-policy"
                            className="text-brand underline hover:no-underline transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Privacy Policy
                        </a>
                        . Your data will be used only for reply.
                    </span>
                </label>
                {errors.gdprConsent && (
                    <p className="text-[10px] text-brand uppercase font-bold tracking-tight">
                        {errors.gdprConsent}
                    </p>
                )}
            </div>

            {/* Error Message */}
            {submitError && (
                <div className="p-16 bg-red-50 border-2 border-brand rounded-[var(--corner-small)]">
                    <p className="text-text-sm text-brand font-bold">{submitError}</p>
                </div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                variant="filled"
                size={buttonSize}
                className="w-full"
                disabled={isSubmitting}
                rightIcon={ArrowRight}
            >
                {isSubmitting ? "Sending..." : "Submit"}
            </Button>
        </form>
    );
}
