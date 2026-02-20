# Agent Rules for crisp-website

## 🔴 CRITICAL: Never Overwrite Production GCS Data with Generated Content

**NEVER** create or write placeholder, sample, or AI-generated content to any file in the Google Cloud Storage bucket `gs://crisp-website-485112_cloudbuild/data/`.

This bucket contains **live production content** for the website. Overwriting it with dummy data will immediately break the public-facing site.

### What this means in practice:

- **DO NOT** create new JSON files on GCS unless the user explicitly provides the exact content to write.
- **DO NOT** write placeholder values like `"placeholder-1.jpg"`, `"We Create Digital Experiences"`, `["item 1", "item 2"]`, etc. to GCS.
- **DO NOT** run `updateContent()` or `gcloud storage cp` targeting the data bucket without explicit user approval of the content being written.
- **ALWAYS** read the file first (`readContent()` or `gcloud storage cat`) before deciding to create, fix or overwrite it.
- If a GCS file appears to be missing, ask the user to provide the content — **do not generate it yourself**.

### Canonical data source

The canonical backup of all GCS JSON files is stored in:
- `src/content/data/` — committed to git, use this as reference
- `tmp_gcs_data/` — additional backup

If GCS data is lost or corrupted, restore from these locations:
```bash
node -e "const {Storage}=require('@google-cloud/storage');const fs=require('fs');const storage=new Storage();const bucket=storage.bucket('crisp-website-485112_cloudbuild');const files=fs.readdirSync('src/content/data').filter(f=>f.endsWith('.json'));(async()=>{for(const f of files){await bucket.upload('src/content/data/'+f,{destination:'data/'+f});console.log('Uploaded',f);}})();"
```

### GCS Versioning

Object versioning is enabled on the bucket. To list and restore previous versions:
```bash
gcloud storage objects list gs://crisp-website-485112_cloudbuild/data/ --all-versions
```

---

## Admin Panel

The admin panel at `/admin` now shows a **confirmation dialog** before any save is written to GCS. This is intentional — do not remove it.
