export interface TeamMember {
    id: string;
    name: string;
    position: string;
    photo: string;
    inlineLogoUrl?: string;
    bio: string;
    tags: string[];
    visible: boolean;
}
