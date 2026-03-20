import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to combine Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Utility function to convert local asset paths to Google Cloud Storage URLs
 * Example: /img/home-hero/home-01.webm -> https://storage.googleapis.com/crisp-website-485112_cloudbuild/img/home-hero/home-01.webm
 */
export function getAssetUrl(path: string | undefined): string {
    if (!path) return "";

    // If it's already a full URL (e.g., from an external source or already transformed), return it
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    // Remove leading slash if present so it joins correctly
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    return `https://storage.googleapis.com/crisp-website-485112_cloudbuild/${cleanPath}`;
}
