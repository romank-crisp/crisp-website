export interface ServicesCTAData {
    videoSrc: string;
    headline: {
        text1: string;
        text2: string;
        text3: string;
    };
    buttons: {
        id: string;
        text: string;
        link: string;
        icon: "Calendar" | "Mail" | "MessageCircle";
        variant: "filled" | "outline";
        action?: "contact-form" | "link";
    }[];
}

export const DEFAULT_SERVICES_CTA: ServicesCTAData = {
    videoSrc: "/img/showreel-cta.webm",
    headline: {
        text1: "BRING",
        text2: "YOUR",
        text3: "PRODUCT TO MARKET FASTER."
    },
    buttons: [
        {
            id: "btn-1",
            text: "Schedule a meeting",
            link: "",
            icon: "Calendar",
            variant: "filled",
            action: "contact-form"
        },
        {
            id: "btn-2",
            text: "Email us",
            link: "mailto:hello@crisp.studio",
            icon: "Mail",
            variant: "outline",
            action: "link"
        },
        {
            id: "btn-3",
            text: "WhatsApp",
            link: "https://wa.me/41794540545",
            icon: "MessageCircle",
            variant: "outline",
            action: "link"
        }
    ]
};
