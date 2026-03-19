"use server";

import { revalidateTag } from "next/cache";

export async function forceRevalidateContent(filename: string) {
    revalidateTag(`content-${filename}`, "default");
    return { success: true };
}
