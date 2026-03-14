import { Storage } from "@google-cloud/storage";
import path from "path";

const storage = new Storage();
const BUCKET_NAME = process.env.GCS_BUCKET ?? "crisp-website-485112_cloudbuild";
const DATA_PREFIX = "data";
const filename = "services.json";

async function run() {
    try {
        const filePath = path.join(DATA_PREFIX, filename);
        const [files] = await storage.bucket(BUCKET_NAME).file(filePath).download();
        const data = JSON.parse(files.toString());

        data.textIterations = [
            "We combine structured strategy with AI-accelerated exploration",
            "That means broader concept testing in less time and more refined outcomes",
            "Efficiency in process, depth in execution"
        ];

        data.imageComparison = {
            beforeImage: "https://storage.googleapis.com/crisp-website-485112_cloudbuild/img/home-hero/home-hero-03.png",
            afterImage: "https://storage.googleapis.com/crisp-website-485112_cloudbuild/img/home-hero/home-hero-04-02.png"
        };

        await storage.bucket(BUCKET_NAME).file(filePath).save(JSON.stringify(data, null, 2));
        console.log("Successfully updated services.json directly in GCS.");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
