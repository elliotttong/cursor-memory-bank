# 16: DevOps & Deployment Strategy

This document outlines the development workflow, Continuous Integration (CI), and deployment processes for the Chrome Extension, Supabase backend, and Hugging Face Inference Endpoint.

## Development Workflow (Git)

*   **Repository:** Single Monorepo is recommended to manage Extension, Supabase functions/migrations, and potentially HF Endpoint configuration together.
    *   Alternative: Separate repositories if preferred, but requires more complex coordination.
*   **Branching Strategy:** Gitflow or a simplified version (e.g., GitHub Flow):
    *   `main`: Production-ready code. Protected branch.
    *   `develop`: Integration branch for features. Base for staging deployments.
    *   `feature/<feature-name>`: Branches for new features, branched off `develop`.
    *   `fix/<issue-number>`: Branches for bug fixes, branched off `develop` or `main` (for hotfixes).
    *   `release/<version>`: Optional branch for preparing production releases (tagging, final tests).
*   **Commits:** Conventional Commits standard recommended for automated changelog generation and semantic versioning.
*   **Pull Requests (PRs):**
    *   All code changes merged via PRs into `develop` (and potentially `main` for hotfixes).
    *   Require automated checks (linting, unit/integration tests) via CI.
    *   Require code reviews from at least one other team member.

## Continuous Integration (CI) - GitHub Actions

Create workflows in `.github/workflows/`:

1.  **`ci-checks.yml` (Trigger: Push to `feature/*`, `fix/*`, `develop`, PRs to `develop`):**
    *   **Jobs:**
        *   `Lint & Format`: Run ESLint/Prettier checks on extension code and Supabase function code.
        *   `Unit Tests (Extension)`: Run Jest/Vitest tests for extension TypeScript code.
        *   `Unit Tests (Backend)`: Run `deno test` for Supabase Edge Functions (mocking external services).
        *   `Build Extension`: Run the build process (e.g., `npm run build` or `tsc`) to catch compilation errors.
    *   **Purpose:** Provide fast feedback on code quality and basic correctness during development.

2.  **`integration-tests.yml` (Trigger: PR to `develop`, Push to `develop`):**
    *   **Setup:** Requires access to Supabase secrets (staging project URL, anon key, service role key) via GitHub Secrets.
    *   **Jobs:**
        *   `Setup Supabase (Local/Staging)`: Spin up local Supabase using CLI (`supabase start`) or connect to a dedicated staging project. Apply migrations (`supabase db push`). Seed test data if necessary.
        *   `Integration Tests (Backend)`: Run Deno tests for Edge Functions that interact with the staging Supabase instance (Auth, DB, Storage).
        *   `Integration Tests (Extension)`: (Optional/Complex) Run tests simulating interaction between extension components, potentially mocking backend calls initially.
    *   **Purpose:** Verify interactions between backend components and database state.

3.  **`deploy-staging.yml` (Trigger: Push to `develop`):**
    *   **Setup:** Needs Supabase Access Token, HF API Token/Endpoint info via GitHub Secrets.
    *   **Jobs:**
        *   `Deploy Supabase Functions`: Use Supabase CLI (`supabase functions deploy --project-ref <staging-ref>`) to deploy Edge Functions to the staging project.
        *   `Apply DB Migrations`: Use Supabase CLI (`supabase db push --linked`) if using local dev -> staging flow, or manage migrations via Supabase UI/manually for staging.
        *   `Deploy HF Endpoint (if applicable)`: If managing the HF endpoint config via code (e.g., custom handler Dockerfile), build and push the image, update the endpoint configuration via HF API or tooling.
    *   **Purpose:** Keep the staging environment up-to-date with the `develop` branch for E2E testing and internal previews.

4.  **`deploy-production.yml` (Trigger: Manual Dispatch on `main` or Tag Push `v*`):**
    *   **Setup:** Needs Production Supabase Access Token, Production HF info, Chrome Web Store API keys via GitHub Secrets.
    *   **Jobs:**
        *   `Deploy Supabase Functions (Prod)`: `supabase functions deploy --project-ref <prod-ref>`
        *   `Apply DB Migrations (Prod)`: Requires careful migration strategy (e.g., using Supabase migration tools, pg_migrate).
        *   `Deploy HF Endpoint (Prod)`: Update production HF endpoint if necessary.
        *   `Package Extension`: Build the extension for production, increment version number (potentially based on commit history/tags).
        *   `Upload to Web Store`: Use a tool like `chrome-webstore-upload-cli` or GitHub Actions marketplace actions to upload the packaged `.zip` file to the Chrome Web Store API.
    *   **Purpose:** Deploy validated code to production Supabase and upload the extension to the Chrome Web Store.

## Supabase Backend Deployment

*   **Migrations:** Use the Supabase CLI for managing database schema changes (`supabase migrations new <name>`, `supabase db push/remote commit`). Apply migrations via CI (`deploy-staging.yml`, `deploy-production.yml`). Use careful review and potentially manual application for production schema changes.
*   **Edge Functions:** Deploy using Supabase CLI via GitHub Actions (`supabase functions deploy`). Manage environment variables (API keys) via Supabase dashboard or CLI secrets management.
*   **pg_cron Jobs:** Manage via Supabase dashboard SQL editor or include scheduling commands in migrations.

## Hugging Face Inference Endpoint Deployment

*   **Initial Setup:** Manually create the Inference Endpoint via the HF UI, selecting the Kokoro-82M model (or a fine-tuned version) and appropriate GPU instance.
*   **Custom Handler (If Needed):** If timestamp generation requires a custom Docker container:
    *   Store the `Dockerfile` and handler code in the repository.
    *   CI (`deploy-staging.yml`, `deploy-production.yml`) builds the Docker image, pushes it to a registry (e.g., Docker Hub, HF Container Registry), and potentially uses the HF API or tooling to update the Inference Endpoint configuration to use the new image tag.
*   **Secrets:** Store the HF API Token needed for the Supabase Edge Function securely in Supabase Vault or Edge Function environment variables.

## Chrome Extension Deployment

*   **Versioning:** Increment the `version` in `manifest.json` consistently. Consider using semantic versioning (`major.minor.patch`). CI can automate patching based on commit messages.
*   **Packaging:** CI job (`deploy-production.yml`) zips the built extension files.
*   **Upload:** Use Chrome Web Store API via `chrome-webstore-upload-cli` or similar tools within the `deploy-production.yml` workflow.
    *   Requires setting up API access in the Google Cloud Console and storing credentials securely in GitHub Secrets (`CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN`, `EXTENSION_ID`).
*   **Publishing:** The upload API typically uploads a draft. Publishing (to testers or publicly) might be a manual step in the Chrome Web Store dashboard or automated via the API (`publish` command).

## Monitoring & Rollback

*   **Monitoring:**
    *   Supabase: Built-in logs, metrics, `cron.job_run_details`.
    *   Hugging Face: Inference Endpoint logs and metrics.
    *   Edge Functions: Supabase function logs.
    *   Extension: Implement basic error reporting (e.g., sending errors to a logging service via an Edge Function proxy).
    *   Stripe: Dashboard and webhook logs.
*   **Rollback:**
    *   **Supabase Functions:** Re-deploy the previous working version using Supabase CLI (`supabase functions deploy --version <commit-sha>`).
    *   **Supabase DB:** Requires careful migration design (e.g., writing reversible migrations) or point-in-time recovery (PITR) if enabled.
    *   **HF Endpoint:** Revert to a previous Docker image tag if using custom handlers.
    *   **Extension:** Upload the previous working `.zip` package version to the Chrome Web Store. 