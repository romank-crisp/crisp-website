
export interface FooterLink {
    label: string;
    path: string;
}

export interface FooterColumn {
    links: FooterLink[];
}

export interface FooterContent {
    columns: FooterColumn[];
    copyright: string;
    bottomCta: FooterLink;
}
