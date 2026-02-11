export type BrandKey = 'crisp' | 'grownow';

export interface BrandConfig {
    key: BrandKey;
    name: string;
    logo: string;
    color: string; // Hex color without # for easy copy if needed, or just standard
    logoScale?: number;
}

export const BRANDS: Record<BrandKey, BrandConfig> = {
    crisp: {
        key: 'crisp',
        name: 'Crisp',
        logo: '/img/crisp-logo.svg',
        color: '#E00C33', // 224 12 51
        logoScale: 1
    },
    grownow: {
        key: 'grownow',
        name: 'Grownow',
        logo: '/img/grownow.svg',
        color: '#5327BB', // 83 39 187
        logoScale: 1.2
    }
};
