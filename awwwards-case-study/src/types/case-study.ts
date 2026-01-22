export interface Section {
    id: string;
    title: string;
    body: string; // Rich text
    variant?: 'default' | 'compact';
    highlight?: boolean;
}

export interface Client {
    name: string;
    location?: string;
    website?: string;
}

export interface CaseStudyMeta {
    year: number | string;
    client: Client;
    industry: string[];
    deliverables: string[];
    aiAssistedWorkflows?: string[];
}

export interface CaseStudy {
    id: string;
    slug: string;
    title: string;
    intro: string;
    coverImage?: string;
    meta: CaseStudyMeta;
    sections: Section[];
    createdAt: string;
    updatedAt: string;
}
