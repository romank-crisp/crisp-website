export const dynamic = 'force-dynamic';

import { AIVisualPriceCalculator } from "@/components/blocks/AIVisualPriceCalculator";

export default function CalcPreviewPage() {
    return (
        <main className="min-h-screen bg-[#120c2a]">
            <AIVisualPriceCalculator />
        </main>
    );
}
