#!/bin/bash
# deploy-all.sh — Master deployment script for the Crisp headless architecture
# Usage: ./deploy-all.sh [staging|production] [component]
# Components: site, admin, function, all

set -euo pipefail

ENVIRONMENT="${1:-staging}"
COMPONENT="${2:-all}"

PROJECT_ID="crisp-website-485112"
REGION="europe-west1"

# ─── Bucket names ────────────────────────────────────────────────
STAGING_BUCKET="crisp-website-static-staging"
PRODUCTION_BUCKET="crisp-website-static"

# ─── Colors ──────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════╗"
echo -e "║        Crisp Deploy — ${ENVIRONMENT^^}            ║"
echo -e "╚══════════════════════════════════════════════╝${NC}"
echo ""

# ─── Deploy Static Site ─────────────────────────────────────────
deploy_site() {
    local bucket="${STAGING_BUCKET}"
    local contact_url="https://${REGION}-${PROJECT_ID}.cloudfunctions.net/contact-form-staging"

    if [ "$ENVIRONMENT" = "production" ]; then
        bucket="${PRODUCTION_BUCKET}"
        contact_url="https://${REGION}-${PROJECT_ID}.cloudfunctions.net/contact-form"
    fi

    echo -e "${YELLOW}📦 Building static site for ${ENVIRONMENT}...${NC}"

    # Pull latest content from GCS
    bash pull-content.sh

    # Build with environment-specific config
    NEXT_PUBLIC_CONTACT_API_URL="${contact_url}" npm run build

    # Sync to GCS
    echo -e "${YELLOW}📤 Uploading to gs://${bucket}/...${NC}"
    gsutil -m rsync -r -d out/ "gs://${bucket}/"

    # Set cache headers
    gsutil -m setmeta -h "Cache-Control:public, max-age=3600" "gs://${bucket}/**/*.html"
    gsutil -m setmeta -h "Cache-Control:public, max-age=31536000, immutable" "gs://${bucket}/_next/static/**"

    echo -e "${GREEN}✅ Static site deployed to gs://${bucket}/${NC}"
}

# ─── Deploy Admin App ───────────────────────────────────────────
deploy_admin() {
    local service_name="crisp-admin"
    if [ "$ENVIRONMENT" = "staging" ]; then
        service_name="crisp-admin-staging"
    fi

    echo -e "${YELLOW}🔧 Building and deploying admin to Cloud Run...${NC}"

    cd admin

    gcloud builds submit \
        --project="${PROJECT_ID}" \
        --tag "${REGION}-docker.pkg.dev/${PROJECT_ID}/cloud-run-source-deploy/${service_name}" \
        --timeout=600s

    gcloud run deploy "${service_name}" \
        --project="${PROJECT_ID}" \
        --region="${REGION}" \
        --image="${REGION}-docker.pkg.dev/${PROJECT_ID}/cloud-run-source-deploy/${service_name}" \
        --platform=managed \
        --allow-unauthenticated \
        --set-env-vars="GCS_BUCKET=crisp-website-485112_cloudbuild" \
        --set-secrets="ADMIN_PASSWORD=ADMIN_PASSWORD:latest,RESEND_API_KEY=RESEND_API_KEY:latest,GOOGLE_GENERATIVE_AI_API_KEY=GOOGLE_GENERATIVE_AI_API_KEY:latest" \
        --memory=512Mi \
        --cpu=1 \
        --min-instances=0 \
        --max-instances=2

    cd ..
    echo -e "${GREEN}✅ Admin deployed to Cloud Run as ${service_name}${NC}"
}

# ─── Deploy Cloud Function ──────────────────────────────────────
deploy_function() {
    local function_name="contact-form"
    local allowed_origin="https://crisp-studio.com"

    if [ "$ENVIRONMENT" = "staging" ]; then
        function_name="contact-form-staging"
        allowed_origin="https://staging.crisp-studio.com"
    fi

    echo -e "${YELLOW}⚡ Deploying contact form Cloud Function...${NC}"

    cd functions/contact

    gcloud functions deploy "${function_name}" \
        --gen2 \
        --runtime=nodejs22 \
        --trigger-http \
        --allow-unauthenticated \
        --region="${REGION}" \
        --project="${PROJECT_ID}" \
        --set-secrets="RESEND_API_KEY=RESEND_API_KEY:latest" \
        --set-env-vars="CONTACT_EMAIL_TO=hello@crisp-studio.com,CONTACT_EMAIL_FROM=noreply@crisp-studio.com,ALLOWED_ORIGIN=${allowed_origin}" \
        --memory=256Mi

    cd ../..
    echo -e "${GREEN}✅ Cloud Function deployed as ${function_name}${NC}"
}

# ─── Execute ─────────────────────────────────────────────────────
case "${COMPONENT}" in
    site)
        deploy_site
        ;;
    admin)
        deploy_admin
        ;;
    function)
        deploy_function
        ;;
    all)
        deploy_function
        deploy_site
        deploy_admin
        ;;
    *)
        echo -e "${RED}Unknown component: ${COMPONENT}${NC}"
        echo "Usage: ./deploy-all.sh [staging|production] [site|admin|function|all]"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════"
echo -e "  Deploy complete: ${ENVIRONMENT} / ${COMPONENT}"
echo -e "═══════════════════════════════════════════════${NC}"
