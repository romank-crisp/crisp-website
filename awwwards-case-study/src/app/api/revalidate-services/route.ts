import { forceRevalidateContent } from "@/app/actions/force-revalidate";
import { NextResponse } from "next/server";

export async function GET() {
    await forceRevalidateContent("services.json");
    return NextResponse.json({ success: true, message: "Revalidated services.json" });
}
