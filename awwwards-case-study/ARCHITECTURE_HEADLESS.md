# Technical Architecture: Headless Static Migration

This document provides a deep dive into the architectural shift from a Server-Side Rendered (SSR) monolith to a Decoupled Headless Static architecture.

## 1. Overview

The migration separates the project into three distinct layers, optimizing for performance, reliability, and security.

### 1.1 Components

- **Static Public Site**: Built with Next.js using `output: 'export'`. Serves as a collection of static HTML, CSS, and JS files. Hosted on Google Cloud Storage (GCS) with a CDN.
- **Standalone Admin App**: A decoupled Next.js application residing in the `admin/` directory. It manages GCS JSON content and triggers site rebuilds. Deployed on Cloud Run.
- **Serverless Contact API**: A Google Cloud Function (`functions/contact/`) that handles POST requests from the static site's contact form.

## 2. Data Flow

### 2.1 Content Management (Write)
1. User logs into the **Admin App**.
2. User edits content (JSON).
3. Admin App writes directly to **GCS Content Bucket**.
4. User clicks "Publish" in the Admin Dashboard.
5. Admin App triggers a **Cloud Build** via the Google Cloud Build API.

### 2.2 Site Generation (Build)
1. Cloud Build starts a new build process.
2. It runs `pull-content.sh`, which downloads all JSON files from the **GCS Content Bucket** to `src/content/data/`.
3. It runs `npm run build` (Next.js Static Export).
4. Next.js reads the local JSON files and pre-renders all pages.
5. Cloud Build syncs the `out/` directory to the **Public Hosting Bucket**.

### 2.3 Public Site Content (Read)
1. The browser requests a static HTML page from the CDN.
2. The page is served instantly with zero server-side computation.
3. Interactive elements (like the contact form) call the **Cloud Function API**.

## 3. Infrastructure & Deployment

### 3.1 Google Cloud Platform (GCP)
- **Cloud Run**: Hosts the Admin App (Dockerized).
- **Cloud Functions (Gen2)**: Hosts the contact form handler.
- **Cloud Storage (GCS)**:
    - `crisp-website-static`: Production public site hosting.
    - `crisp-website-static-staging`: Staging public site hosting.
    - `crisp-website-485112_cloudbuild`: Content storage (JSON files).
- **Cloud Build**: The orchestration engine for static site generation.

### 3.2 Security
- **Admin**: Protected by HTTP Basic Auth and session-based logic. It is isolated from the public site.
- **Contact API**: Uses CORS to only allow requests from the designated public site origins. Employs honeypot and rate-limiting.
- **Public Site**: No server-side code, drastically reducing the attack surface.

## 4. Local Development

### 4.1 Running the Public Site
```bash
# Sync latest content from GCS
bash pull-content.sh

# Start dev server
npm run dev
```

### 4.2 Running the Admin App
```bash
cd admin
npm install
npm run dev
```

## 5. Benefits of this Architecture
- **Performance**: Sub-second page loads due to static delivery.
- **Cost**: Hosting static files on GCS is significantly cheaper than running an SSR server 24/7.
- **Reliability**: The site remains live even if the database (GCS) or Admin app experiences downtime.
- **Independence**: The Admin panel can be moved or replaced without affecting the public-facing site.
