import { Storage } from '@google-cloud/storage';

const BUCKET_NAME = process.env.GCS_BUCKET || 'crisp-website-485112_cloudbuild';

async function migrate() {
    console.log(`Using bucket: ${BUCKET_NAME}`);
    const storage = new Storage();
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file('data/services.json');

    try {
        console.log('Downloading services.json...');
        const [contents] = await file.download();
        const data = JSON.parse(contents.toString());

        if (!data.hero) {
            data.hero = {
                label: "Visual Content Factory",
                title: "We Create<br />Product Visuals<br />That Convert",
                description: "Static and motion — boost products visual intensity and connect your customers to the brands"
            };
        }

        if (!data.contactForm) {
            data.contactForm = {
                title: "HI THERE!",
                successTitle: "THANK YOU!",
                successMessage: "We've received your message and will get back to you soon.",
                successButtonText: "Send another message"
            };
        }

        console.log('Uploading updated services.json...');
        await file.save(JSON.stringify(data, null, 2), {
            contentType: 'application/json',
        });

        console.log('Migration successful.');
    } catch (e) {
        console.error('Migration failed:', e);
    }
}

migrate();
