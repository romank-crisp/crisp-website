
export interface FooterLink {
    label: string;
    path: string;
}

export interface SocialLink {
    label: string;
    url: string;
}

export interface FooterContent {
    ctaText: string;
    copyrightSuffix: string;
    navigation: FooterLink[];
    socials: SocialLink[];
}
