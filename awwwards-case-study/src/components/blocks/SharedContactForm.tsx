"use client";

import { useState } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { ServicesData } from "@/content/services";

export function SharedContactForm({ data }: { data?: ServicesData['contactForm'] }) {
    const [isSubmitted, setIsSubmitted] = useState(false);

    return (
        <section className="w-full bg-white py-32 md:py-64 flex justify-center px-16 md:px-32">
            <div className="w-full max-w-[520px]">
                {!isSubmitted ? (
                    <>
                        <h2
                            className="font-mega text-mega-h2 uppercase mb-48 text-black text-center md:text-left"
                            dangerouslySetInnerHTML={{ __html: data?.title || "HI THERE!" }}
                        />
                        <ContactForm
                            onSuccess={() => setIsSubmitted(true)}
                        />
                    </>
                ) : (
                    <div className="text-center py-64">
                        <h2
                            className="font-mega text-mega-h2 uppercase mb-24 text-black"
                            dangerouslySetInnerHTML={{ __html: data?.successTitle || "THANK YOU!" }}
                        />
                        <p className="text-text-md text-text mb-32">
                            {data?.successMessage || "We've received your message and will get back to you soon."}
                        </p>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="text-brand underline hover:no-underline"
                        >
                            {data?.successButtonText || "Send another message"}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
