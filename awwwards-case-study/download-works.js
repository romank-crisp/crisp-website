const { Storage } = require('@google-cloud/storage');
const fs = require('fs');

async function download() {
  const storage = new Storage({ keyFilename: 'google-credentials.json' });
  const bucketName = 'crisp-content-bucket-roman';
  const file = storage.bucket(bucketName).file('works-content.json');
  
  const [content] = await file.download();
  fs.writeFileSync('temp-works-content.json', content);
  console.log('Downloaded works-content.json');
}

download().catch(console.error);
