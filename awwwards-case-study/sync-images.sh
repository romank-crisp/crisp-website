#!/bin/bash
set -e

TARGET_DIR=${1:-"public/img/services"}

# Extract the part after "public/" for the GCS destination
if [[ "$TARGET_DIR" == *"/public/"* ]]; then
    GCS_SUFFIX="${TARGET_DIR#*public/}"
elif [[ "$TARGET_DIR" == "public/"* ]]; then
    GCS_SUFFIX="${TARGET_DIR#public/}"
else
    GCS_SUFFIX="$TARGET_DIR"
fi

echo "Syncing $TARGET_DIR to gs://crisp-website-485112_cloudbuild/$GCS_SUFFIX..."
gsutil -m rsync -r -x '\.DS_Store$' "$TARGET_DIR" "gs://crisp-website-485112_cloudbuild/$GCS_SUFFIX"
echo "Sync complete!"
