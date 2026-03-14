export interface WhatWeOfferCard {
    id: string;
    title: string;
    description: string;
    mediaSrc: string;
    mediaType: "lottie" | "video";
    layout: "media-left" | "media-right";
}

export interface WhatWeOfferData {
    sectionTitle: string;
    cards: WhatWeOfferCard[];
}
