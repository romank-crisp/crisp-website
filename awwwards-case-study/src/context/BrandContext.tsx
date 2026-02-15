"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { BRANDS, BrandConfig, BrandKey } from '@/config/brands';
import { useSearchParams } from 'next/navigation';

interface BrandContextType {
    brand: BrandConfig;
    setBrand: (key: BrandKey) => void;
    currentBrandKey: BrandKey;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
    const [currentBrandKey, setCurrentBrandKey] = useState<BrandKey>('crisp');
    // We access searchParams via a client wrapper logic or just window in simple client components
    // But since this is a provider at layout level, we might rely on window or passed props.
    // However, switching logic often requires URL params.
    // Let's check window/URL in effect to set initial state if needed, or listen to changes.
    // Actually, simple URL parameter detection is good.

    useEffect(() => {
        // Check URL for ?brand=grownow OR ?mode=grownow on mount
        const params = new URLSearchParams(window.location.search);
        const mode = params.get('mode') || params.get('brand');

        if (mode === 'grownow' || mode === 'Grownow') {
            handleSetBrand('grownow');
        } else {
            handleSetBrand('crisp');
        }
    }, []);

    const handleSetBrand = (key: BrandKey) => {
        setCurrentBrandKey(key);
        // Set data attribute on document element for global CSS
        document.documentElement.setAttribute('data-brand', key);
    };

    const value = {
        brand: BRANDS[currentBrandKey],
        setBrand: handleSetBrand,
        currentBrandKey
    };

    return (
        <BrandContext.Provider value={value}>
            {children}
        </BrandContext.Provider>
    );
}

export function useBrand() {
    const context = useContext(BrandContext);
    if (context === undefined) {
        throw new Error('useBrand must be used within a BrandProvider');
    }
    return context;
}
