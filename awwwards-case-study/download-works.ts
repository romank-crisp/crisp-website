import { Storage } from "@google-cloud/storage";
import fs from "fs";

async function main() {
    const storage = new Storage({ keyFilename: 'google-credentials.json' });
    const bucket = storage.bucket('crisp-content-bucket-roman');
    const [content] = await bucket.file('works-content.json').download();
    fs.writeFileSync('temp-works-content.json', content.toString('utf-8'));
    console.log("downloaded!");
}
main();
