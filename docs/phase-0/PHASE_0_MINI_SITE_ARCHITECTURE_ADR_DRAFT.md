# Architectural Decision Record (ADR) Draft: Mini-Site Routing & Rendering Architecture

**Status:** PROPOSED (DRAFT FOR FOUNDER REVIEW)  
**Date:** 2026-11-18  
**Context:** YaatraSangi Phase 0 Architecture Evaluation  
**Deciders:** Senior Software Architect, Security Engineer, Product Lead

---

## 1. Context & Problem Statement

YaatraSangi provides approved partner business profiles (Hotels, Outstation Taxis, Restaurants, Tour Operators, Local Drivers) with dedicated public mini-sites accessible via subdomains (e.g., `the-grand-palace.yaatrasangi.com`) and eventually custom domains (e.g., `www.grandpalaceudaipur.com`).

The codebase currently configures `apps/traveller-web` with Next.js 16 static HTML export (`output: 'export'` in `next.config.ts`), generating static HTML/JS assets to `apps/traveller-web/out/`.

### The Core Architectural Incompatibility
The previous audit suggested implementing dynamic wildcard subdomain routing via **Next.js Edge/Server Middleware** (`middleware.ts`). However:
1. **Next.js static export (`output: 'export'`) completely disables Next.js Middleware, Dynamic Server Rewrites, and Server-Side Headers.**
2. A purely static export cannot intercept incoming HTTP Host headers (e.g. `the-grand-palace.yaatrasangi.com`) to dynamically route to tenant data without either:
   - Full client-side JavaScript host parsing and runtime client fetch, causing Cumulative Layout Shift (CLS), broken OpenGraph social cards, and severely degraded SEO; or
   - An upfront build step for every single tenant slug, which does not scale, delays content publication, and prevents on-demand updates.

Therefore, an explicit architectural decision must be made regarding how mini-sites and the traveller web application are rendered and routed.

---

## 2. Evaluation of Options

### Option 1: Unified Next.js Node.js Server Runtime (SSR / ISR) for Main Site & Mini-Sites

- **Description:** Remove `output: 'export'` from `apps/traveller-web/next.config.ts`. Run `traveller-web` as a standard Node.js server container (`standalone` mode) behind Nginx. Use Next.js Middleware (`middleware.ts`) to inspect `request.headers.get('host')`. If a subdomain or custom domain is detected, rewrite internally to `/mini-site/[slug]`. Use Incremental Static Regeneration (ISR) with `revalidatePath()` or `revalidateTag()` for instant updates upon admin content approval.
- **Compatibility with Current App:** **High**. Maintains single Next.js codebase; existing React components and Tailwind styling are preserved.
- **Deployment Complexity:** **Low to Moderate**. Requires running a Node.js process (e.g. `node server.js` in Docker) instead of pure Nginx static file hosting.
- **Wildcard DNS / Nginx / TLS:** Nginx receives `*.yaatrasangi.com` with a Wildcard Let's Encrypt certificate and proxies all matching hosts to the Next.js container passing `$host` and `$x_forwarded_proto`.
- **Content Approval / Publish Behaviour:** **Instantaneous**. When an admin approves an edit, the backend triggers Next.js On-Demand Revalidation (`revalidatePath`). The published version updates immediately without triggering a complete site rebuild. The previously approved version remains cached and served until the new version is revalidated.
- **Caching & Invalidation:** Native Next.js Data Cache / ISR cache, supported by Nginx microcaching or Cloudflare edge caching.
- **SEO & Social Sharing:** **Optimal**. Complete Server-Side Rendered (SSR) HTML with tenant-specific OpenGraph meta tags, JSON-LD structured data (schema.org/Hotel), and server-rendered WhatsApp preview cards.
- **Security & Tenant Isolation:** Logical isolation within the application router; database queries scoped strictly by verified tenant slug.
- **Operational Cost:** Low (single container, ~250MB–512MB RAM).
- **Future Custom Domains:** **Native Support**. Custom domains CNAME'd to YaatraSangi can be resolved directly in Next.js Middleware via database domain lookup and internal rewrite.

---

### Option 2: Dedicated Dynamic Mini-Site Service + Retain Static Traveller Site

- **Description:** Keep `apps/traveller-web` as a pure static export (`output: 'export'`) served by Nginx for the main directory portal (`yaatrasangi.com`). Build or deploy a dedicated dynamic Next.js or Fastify/SSR service exclusively for tenant mini-sites (`*.yaatrasangi.com` and custom domains).
- **Compatibility with Current App:** **Moderate**. Duplicates layouts, styling dependencies, and UI component libraries across two separate frontend projects.
- **Deployment Complexity:** **High**. Requires managing, deploying, and monitoring two distinct web services plus complex Nginx reverse-proxy routing rules distinguishing root domain from subdomains.
- **Wildcard DNS / Nginx / TLS:** Nginx routes root traffic (`yaatrasangi.com`, `www.yaatrasangi.com`) to static HTML files, and subdomains (`*.yaatrasangi.com`) to the dynamic mini-site container.
- **Content Approval / Publish Behaviour:** Updates to mini-sites are dynamic/instant; main directory updates require full CI static rebuilds.
- **Caching & Invalidation:** Requires separate caching layers for the static site and the dynamic service.
- **SEO & Social Sharing:** High on mini-sites; moderate on directory.
- **Security & Tenant Isolation:** Strong architectural boundary between main marketing site and tenant pages.
- **Operational Cost:** Moderate (additional container memory and management overhead).
- **Future Custom Domains:** Handled cleanly by the dedicated mini-site service.

---

### Option 3: Static Tenant Pages (Pre-rendered Static Export for Tenants)

- **Description:** Retain `output: 'export'`. Pre-render every approved partner mini-site as a static HTML file at build time (e.g., `/out/hotel/the-grand-palace/index.html`). Use Nginx configuration to map the subdomain `the-grand-palace.yaatrasangi.com` to `/var/www/html/hotel/the-grand-palace/index.html`.
- **Compatibility with Current App:** **Low to Moderate**. Requires maintaining Nginx rewrite maps or filesystem directory symlinks for every registered partner.
- **Deployment Complexity:** **High & Fragile**. Triggering a full Next.js export build whenever a partner updates their description or phone number is unviable at scale (1,000+ partners).
- **Wildcard DNS / Nginx / TLS:** Complex Nginx lua/map configuration required to dynamically map subdomains to directory paths without reloading Nginx.
- **Content Approval / Publish Behaviour:** **Poor & Lagged**. Edits remain queued until a batch static build runs, or requires complex static generator webhooks.
- **Caching & Invalidation:** Trivially simple static files, but cache busting across distributed CDNs becomes cumbersome.
- **SEO & Social Sharing:** Optimal for pre-rendered pages, but terrible for new or updated listings waiting for builds.
- **Security & Tenant Isolation:** High physical isolation of static files.
- **Operational Cost:** Very low server resources, but high CI build minutes.
- **Future Custom Domains:** Extremely complex Nginx configuration required to map arbitrary external domains to static directory structures.

---

## 3. Comparison Summary Matrix

| Evaluation Criteria | Option 1: Unified Next.js Node SSR/ISR | Option 2: Split Static + Dynamic Service | Option 3: Pure Static Tenant Pages |
| :--- | :---: | :---: | :---: |
| **Compatibility with Current App** | **High (Direct Evolution)** | Moderate (Code Duplication) | Low (Architectural Strain) |
| **Deployment Complexity** | **Low (Single Service)** | High (Two Services + Nginx Split) | High (Fragile Static Pipeline) |
| **Wildcard Subdomain Handling** | **Clean (Next Middleware)** | Moderate (Nginx Host Routing) | Complex (Filesystem Mapping) |
| **Instant Publish on Approval** | **Yes (`revalidatePath`)** | Yes | No (Requires Full Rebuild) |
| **Published Stays Live During Edit**| **Yes (Dual-State Model)** | Yes | Yes |
| **SEO & OpenGraph Cards** | **Optimal (SSR / ISR)** | Optimal | Optimal (when built) |
| **Custom Domain Readiness** | **Native Middleware Lookup** | Native Service Lookup | Fragile / Impractical |
| **Operational Overhead** | **Low** | Moderate | High Build Overhead |

---

## 4. Architectural Recommendation & Decision

### Recommended Decision: **Option 1 (Unified Next.js Node.js Server Runtime with ISR & Middleware Subdomain Routing)**

### Explicit Architectural Assumptions
1. **Switch from `output: 'export'` to `output: 'standalone'` in `apps/traveller-web/next.config.ts`:**
   Next.js standalone build bundles only necessary production dependencies and produces an ultra-lean Node.js server container (~80MB image, <150MB memory footprint).
2. **Subdomain Routing via Middleware:**
   `middleware.ts` extracts the hostname from incoming requests:
   - Root / Main Domain (`yaatrasangi.com`, `localhost:3000`): Routes to `/` (directory, search, destinations).
   - Subdomain (`<slug>.yaatrasangi.com`): Rewrites internally to `/mini-site/[slug]`.
   - Custom Domain (`www.hotel-example.com`): Queries domain cache / DB to resolve slug and rewrites internally.
3. **Dual-State Content Model with On-Demand ISR:**
   - Active approved content is cached by Next.js ISR.
   - When a partner edits their profile, changes are stored in draft status in PostgreSQL.
   - The live mini-site continues serving the approved cached version.
   - Upon admin approval, the backend sends an authenticated webhook to `/api/revalidate?slug=<slug>`, instantly busting the Next.js cache.

### Consequences & Trade-offs
- **Positive:** Single frontend repository; zero code duplication; world-class SEO and WhatsApp link previews; instant content updates upon admin approval; seamless future custom domain support.
- **Negative / Trade-off:** The frontend can no longer be hosted on pure static object storage (e.g. S3/Cloudflare Pages) without a Node.js container runtime; requires Docker/Node runtime orchestration in production.
