import { WhereWeCanHelp } from "@/components/blocks/WhereWeCanHelp";
import { readContent } from "@/app/actions/content";

export default async function TestWhereWeCanHelpPage() {
    // Fetch the data needed by the component
    const servicesData = await readContent("home-services.json");

    return (
        <div className="min-h-screen">
            {/* Simple spacer to allow scrolling into view */}
            <div className="h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Test: Where We Can Help</h1>
                    <p className="text-lg text-gray-600">Scroll down to see the component</p>
                    <div className="mt-8 text-sm text-gray-500">
                        <p>Expected behavior:</p>
                        <ul className="list-disc list-inside mt-2">
                            <li>Title should pin at top</li>
                            <li>Dots should morph between shapes</li>
                            <li>Service text should fade in/out</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* The component to test */}
            <WhereWeCanHelp data={servicesData} />

            {/* Bottom spacer */}
            <div className="h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-2xl font-bold">End of test page</p>
            </div>
        </div>
    );
}
