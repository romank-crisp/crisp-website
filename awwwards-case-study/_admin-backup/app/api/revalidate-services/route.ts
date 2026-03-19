import { forceRevalidateContent } from "@/app/actions/force-revalidate";
import { NextResponse } from "next/server";

export async function GET() {
    await forceRevalidateContent("aivisuals.json");
    return NextResponse.json({ success: true, message: "Revalidated aivisuals.json" });
}
