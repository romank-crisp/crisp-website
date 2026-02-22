const { Storage } = require('@google-cloud/storage');
const path = require('path');

async function update() {
    const storage = new Storage();
    const bucket = storage.bucket('crisp-website-485112_cloudbuild');
    const file = bucket.file('data/works-content.json');

    try {
        const [content] = await file.download();
        const data = JSON.parse(content.toString());
        
        data.steps = [
            "Design challenge?\nStarting with us is easy!",
            "We identify your goal and\npropose a solution to it",
            "Get tangible results in\ndays, not weeks."
        ];

        await file.save(JSON.stringify(data, null, 2));
        console.log("Successfully updated data/works-content.json");
    } catch (e) {
        console.error("Failed", e);
    }
}

update();
