const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'tmp_gcs_data');
const BUCKET_NAME = 'crisp-website-485112_cloudbuild';

// Ensure dir exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

const data = {
    quote: "We build digital products that move fast and break nothing.",
    author: "Crisp Studio"
};

const filename = "home-quote.json";
const filePath = path.join(DATA_DIR, filename);
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

try {
    try {
        execSync(`gsutil cp ${filePath} gs://${BUCKET_NAME}/data/${filename}`);
        console.log(`Uploaded ${filename} to gs://${BUCKET_NAME}/data/${filename}`);
    } catch (e) {
        console.log(`gsutil failed, trying gcloud storage cp...`);
        execSync(`gcloud storage cp ${filePath} gs://${BUCKET_NAME}/data/${filename}`);
        console.log(`Uploaded ${filename} with gcloud storage cp`);
    }
} catch (error) {
    console.error(`Failed to upload ${filename}:`, error.message);
}
