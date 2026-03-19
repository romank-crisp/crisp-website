#!/bin/bash
# pull-content.sh — Sync all content JSON from GCS to local src/content/data/
# Run this before `npm run build` to ensure all content is available at build time.

set -euo pipefail

BUCKET="crisp-website-485112_cloudbuild"
GCS_PREFIX="data"
LOCAL_DIR="src/content/data"

echo "📥 Pulling content from gs://${BUCKET}/${GCS_PREFIX}/ → ${LOCAL_DIR}/"
echo "──────────────────────────────────────────────"

# Ensure local directory exists
mkdir -p "${LOCAL_DIR}"
mkdir -p "${LOCAL_DIR}/case-studies"
mkdir -p "${LOCAL_DIR}/seo"

# Sync GCS → local (mirror mode: delete local files not in GCS)
gsutil -m rsync -r "gs://${BUCKET}/${GCS_PREFIX}/" "${LOCAL_DIR}/"

echo "──────────────────────────────────────────────"
echo "✅ Content sync complete. Files:"
find "${LOCAL_DIR}" -name "*.json" | sort | while read f; do
    echo "   $(echo $f | sed "s|${LOCAL_DIR}/||")"
done
echo ""
echo "Total: $(find "${LOCAL_DIR}" -name "*.json" | wc -l | tr -d ' ') JSON files"
