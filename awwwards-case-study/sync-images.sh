#!/bin/bash
set -e
echo "Syncing public/img to gs://crisp-website-485112_cloudbuild/img..."
gsutil -m rsync -r -d public/img gs://crisp-website-485112_cloudbuild/img
echo "Sync complete!"
