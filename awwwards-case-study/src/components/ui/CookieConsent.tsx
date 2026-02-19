"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            setIsVisible(true);
            // Default to denied if no choice made
            if (typeof window !== "undefined" && (window as any).gtag) {
                (window as any).gtag("consent", "default", {
                    ad_storage: "denied",
                    analytics_storage: "denied",
                });
            }
        }
    }, []);

    const handleAccept = () => {
        setIsVisible(false);
        localStorage.setItem("cookie_consent", "granted");
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("consent", "update", {
                ad_storage: "granted",
                analytics_storage: "granted",
            });
        }
    };

    const handleDecline = () => {
        setIsVisible(false);
        localStorage.setItem("cookie_consent", "denied");
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("consent", "update", {
                ad_storage: "denied",
                analytics_storage: "denied",
            });
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 z-50 p-16 md:p-32 animate-in slide-in-from-bottom duration-500 w-full md:w-auto md:max-w-md">
            <div className="bg-white border border-black/10 rounded-2xl p-24 shadow-2xl flex flex-col gap-24">
                <div className="space-y-8">
                    <h3 className="font-heading text-h4 font-bold">We value your privacy</h3>
                    <p className="font-text text-sm opacity-60">
                        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                    </p>
                </div>
                <div className="flex flex-wrap gap-12">
                    <Button size="small" onClick={handleAccept} className="w-full justify-center">
                        Accept All
                    </Button>
                    <Button variant="outline" size="small" onClick={handleDecline} className="w-full justify-center">
                        Decline
                    </Button>
                </div>
            </div>
        </div>
    );
}
