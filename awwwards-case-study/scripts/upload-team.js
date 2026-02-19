const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

const storage = new Storage();
const BUCKET_NAME = "crisp-website-485112_cloudbuild";
const DATA_PREFIX = "data";
const FILENAME = "team.json";
const LOCAL_PATH = path.join(__dirname, '../src/content/data', FILENAME);

async function upload() {
    try {
        console.log(`Reading from ${LOCAL_PATH}`);
        const fileContent = fs.readFileSync(LOCAL_PATH);
        const destination = path.join(DATA_PREFIX, FILENAME);

        console.log(`Uploading to gs://${BUCKET_NAME}/${destination}...`);

        await storage.bucket(BUCKET_NAME).file(destination).save(fileContent);

        console.log('Upload successful!');
    } catch (error) {
        console.error('Upload failed:', error);
        process.exit(1);
    }
}

upload();
