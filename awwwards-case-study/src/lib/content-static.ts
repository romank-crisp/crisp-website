import fs from 'fs';
import path from 'path';

/**
 * Build-time content reader for static export.
 * Reads JSON files from the local `src/content/data/` directory
 * (synced from GCS before build via pull-content.sh).
 */
export function readContentStatic(filename: string) {
    const filePath = path.join(process.cwd(), 'src', 'content', 'data', filename);
    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
    } catch (error) {
        console.error(`[readContentStatic] Failed to read ${filePath}:`, error);
        throw new Error(`Content file not found: ${filename}`);
    }
}
