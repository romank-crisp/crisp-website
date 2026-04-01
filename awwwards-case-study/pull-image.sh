#!/bin/bash
set -e

TARGET_DIR=${1:-"public/img"}

# Extract the part after "public/" for the GCS source
if [[ "$TARGET_DIR" == *"/public/"* ]]; then
    GCS_SUFFIX="${TARGET_DIR#*public/}"
elif [[ "$TARGET_DIR" == "public/"* ]]; then
    GCS_SUFFIX="${TARGET_DIR#public/}"
else
    GCS_SUFFIX="$TARGET_DIR"
fi

echo "Pulling from gs://crisp-website-485112_cloudbuild/$GCS_SUFFIX to $TARGET_DIR..."
gsutil -m rsync -r -d "gs://crisp-website-485112_cloudbuild/$GCS_SUFFIX" "$TARGET_DIR"
echo "Pull complete!"
