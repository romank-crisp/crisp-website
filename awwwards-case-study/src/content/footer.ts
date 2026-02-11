
import footerData from "./data/footer.json";

export interface FooterLink {
    label: string;
    path: string;
}

export interface SocialLink {
    label: string;
    url: string;
}

export const footerNavigation: FooterLink[] = footerData.navigation as FooterLink[];
export const socialLinks: SocialLink[] = footerData.socials as SocialLink[];
export const footerContent = footerData.content;
