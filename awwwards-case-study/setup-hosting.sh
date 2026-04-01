#!/bin/bash
# setup-hosting.sh — One-time setup for GCS static website hosting
# Run this once to create the hosting buckets for staging and production.

set -euo pipefail

PROJECT_ID="crisp-website-485112"
STAGING_BUCKET="crisp-website-static-staging"
PRODUCTION_BUCKET="crisp-website-static"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Setting up GCS static hosting...${NC}"
echo ""

# ─── Create buckets ──────────────────────────────────────────────
for BUCKET in "${STAGING_BUCKET}" "${PRODUCTION_BUCKET}"; do
    echo -e "${YELLOW}Creating bucket: gs://${BUCKET}/${NC}"

    # Create bucket (ignore if exists)
    gsutil mb -p "${PROJECT_ID}" -l europe-west1 "gs://${BUCKET}/" 2>/dev/null || echo "  Bucket already exists"

    # Enable website configuration (index.html as main, 404.html as error)
    gsutil web set -m index.html -e 404.html "gs://${BUCKET}"

    # Make bucket publicly readable
    gsutil iam ch allUsers:objectViewer "gs://${BUCKET}"

    # Set default cache headers for HTML files
    echo -e "  ${GREEN}✓ Bucket gs://${BUCKET}/ configured${NC}"
done

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════"
echo -e "  Hosting Setup Complete"
echo -e "═══════════════════════════════════════════════${NC}"
echo ""
echo "Staging URL:    http://${STAGING_BUCKET}.storage.googleapis.com"
echo "Production URL: http://${PRODUCTION_BUCKET}.storage.googleapis.com"
echo ""
echo "To use custom domains, set up a Cloud CDN Load Balancer"
echo "pointing to these buckets, or use Cloudflare as a reverse proxy."
echo ""
echo "Next steps:"
echo "  1. Deploy the site:    ./deploy-all.sh staging site"
echo "  2. Deploy the admin:   ./deploy-all.sh staging admin"
echo "  3. Deploy the function: ./deploy-all.sh staging function"
