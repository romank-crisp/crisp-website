# Project Overview: Crisp Website (Awwwards Case Study)

This document outlines the current progress, structure, and technical implementation of the Crisp Website project.

## 🚀 Technology Stack

The project is built using a modern, performance-focused stack:

*   **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animations**: [GSAP](https://gsap.com/) & [Framer Motion](https://www.framer.com/motion/)
*   **3D Graphics**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
*   **Data Storage**: [Google Cloud Storage](https://cloud.google.com/storage) (JSON-first architecture)
*   **Language**: TypeScript

## 📂 Project Structure

The project follows a standard Next.js App Router structure:

*   `src/app`: Application routes and pages.
    *   `/` (Home): Main landing page.
    *   `/about`: Agency information and team.
    *   `/works`: Portfolio and case studies.
    *   `/services`: Services offered.
    *   `/contact`: Contact form and information.
    *   `/admin`: Custom CMS for content management.
*   `src/components`: Reusable UI components.
*   `src/actions`: Server actions for data fetching and mutations.
*   `src/lib`: Utility functions and configurations.

## 💾 Data Architecture (JSON-First)

We utilize a **JSON-first architecture** for content management, ensuring flexibility and speed:

*   **Storage**: All dynamic content (text, images, configurations) is stored as JSON files in a **Google Cloud Storage** bucket ([crisp-website-485112_cloudbuild/data/](https://console.cloud.google.com/storage/browser/crisp-website-485112_cloudbuild/data)).
*   **Fetching**: Server Actions (`readContent` in `src/app/actions/content.ts`) fetch these JSONs at runtime.
*   **Caching**: Next.js caching strategies are used to optimize performance, with on-demand revalidation when content updates.

## 🛠️ Admin Panel & Content Management

The project includes a custom-built **Admin Panel** (`/admin`) for real-time content updates:

*   **Route**: Accessed via `/admin`.
*   **Functionality**:
    *   **Live Editing**: Edit JSON content directly via a user-friendly interface (`JsonEditor`).
    *   **Sidebar Navigation**: Easily switch between different content sections (e.g., Locations, About, Services, Case Studies).
    *   **Instant Updates**: Saving changes updates the GCS bucket and revalidates the website cache immediately.
    *   **Live Preview Links**: Direct links to the relevant pages to verify changes instantly.

## ✨ Key Features

*   **Interactive Maps**: Custom map visualizations for locations.
*   **Team Gallery**: Infinite scrolling team member showcase.
*   **Case Studies**: Detailed project breakdowns with rich media.
*   **High-End Animations**: Scroll-triggered animations and transitions for a premium feel.

## ⚙️ Setup & Deployment

### 🔧 Git & Version Control
The project is version-controlled using **Git**. 
*   **Repository**: Hosted on [GitHub](https://github.com/romank-crisp/crisp-website).
*   **Branching Strategy**: Main branch for production, feature branches for development.
*   **Commit Protocol**: Commits should be descriptive. Deployment to production triggers automatically on merge to `main` (if CI/CD is configured).

### ☁️ Google Cloud Storage (GCS) Setup
To run the project locally or deploy, GCS credentials are required for content fetching:
1.  **Service Account**: A Google Cloud Service Account with `Storage Object Admin` permissions is required.
2.  **Environment Variables**:
    *   `GOOGLE_APPLICATION_CREDENTIALS`: Path to the service account JSON key file.
    *   `GCS_BUCKET_NAME`: `crisp-website-485112_cloudbuild` (or your specific bucket).
3.  **Local Development**: Place `service-account.json` in the root (gitignored) and set `.env.local` to point to it.

### 🚀 Build & Run
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```
