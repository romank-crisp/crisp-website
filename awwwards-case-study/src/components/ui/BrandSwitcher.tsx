"use client";

import { useBrand } from "@/context/BrandContext";
import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Tag } from "@/components/ui/Tag";

export function BrandSwitcher() {
    const { setBrand, currentBrandKey } = useBrand();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setVisible(params.get("switch") === "on");
    }, []);

    const toggleBrand = () => {
        const nextBrand = currentBrandKey === 'crisp' ? 'grownow' : 'crisp';
        setBrand(nextBrand);
    };

    if (!visible) return null;

    return (
        <div
            className="fixed bottom-8 right-8 z-[9999] cursor-pointer"
            onClick={toggleBrand}
        >
            <Tag variant="default" className="shadow-lg hover:bg-gray-50 bg-white border-black/10 gap-2 !h-[40px] px-6">
                <RefreshCcw size={14} />
                Switch
            </Tag>
        </div>
    );
}
