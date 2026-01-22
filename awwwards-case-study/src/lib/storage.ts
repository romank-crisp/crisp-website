import fs from 'fs';
import path from 'path';
import { CaseStudy } from '@/types/case-study';

const DATA_FILE = path.join(process.cwd(), 'src/data/case-studies.json');

export async function getCaseStudies(): Promise<CaseStudy[]> {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading case studies:', error);
        return [];
    }
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
    const studies = await getCaseStudies();
    return studies.find((s) => s.slug === slug);
}

export async function saveCaseStudy(study: CaseStudy): Promise<void> {
    const studies = await getCaseStudies();
    const index = studies.findIndex((s) => s.id === study.id);

    const updatedStudy = {
        ...study,
        updatedAt: new Date().toISOString(),
    };

    if (index > -1) {
        studies[index] = updatedStudy;
    } else {
        studies.push({
            ...updatedStudy,
            createdAt: new Date().toISOString(),
        });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(studies, null, 2));
}

export async function deleteCaseStudy(id: string): Promise<void> {
    const studies = await getCaseStudies();
    const filtered = studies.filter((s) => s.id !== id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
}
