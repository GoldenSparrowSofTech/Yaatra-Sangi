# ADR-002: Unified Next.js Node Runtime for Main Website and Partner Mini-Sites

- **Status:** Accepted by founder; implementation subject to version-specific technical validation
- **Decision date:** 2026-11-18
- **Project:** YaatraSangi
- **Decision owner:** Product owner / founder

## Context

`apps/traveller-web` currently uses Next.js 16.3.6 with `output: 'export'`. The Phase 0 build report confirms that the current build generates 42 static/SSG pages and that detail pages use small `generateStaticParams()` mock-data sets.

The product requires:
- Main website at the root domain (for example, `yaatrasangi.com`).
- One public mini-site for each approved partner business profile, using a unique subdomain (for example, `business.yaatrasangi.com`).
- Approved content remains public while new edits await admin approval.
- Publishing an approved revision should update the public mini-site without requiring a full static export deployment.
- Custom domains are a future extension, not an initial-release requirement.

Pure static export is not a suitable default for dynamically resolving arbitrary partner subdomains and publishing partner updates at scale.

## Decision

Use **one unified `apps/traveller-web` Next.js application deployed as a Node.js server runtime**, serving:
1. The main traveller website on the root/www host.
2. Partner mini-sites on wildcard subdomains.

The target build mode is Next.js `standalone` output, subject to confirmation against the exact installed Next.js version and deployment configuration.

### Request resolution

- Normalize and validate the incoming hostname using an explicit trusted-host policy.
- Root/www/approved local development hosts resolve to the main website.
- A valid `<slug>.yaatrasangi.com` host resolves internally to the mini-site route for that slug.
- Unknown, reserved or malformed subdomains return a safe not-found response.
- Do not trust arbitrary forwarded-host headers unless the reverse proxy is configured to overwrite and sanitize them.
- Do not expose internal rewrite routes as a tenant-isolation boundary.

### Content publication

Use a dual-state content model:
- **Published revision:** the currently approved revision served publicly.
- **Draft/review revision:** partner edits awaiting admin review.

Editing must never overwrite the currently published revision. Upon approval, the system atomically changes the published revision pointer and triggers cache invalidation/revalidation.

### Cache invalidation

The exact Next.js 16.3.6 revalidation and request interception APIs must be verified against the installed package and official version-matched documentation before implementation.

If the backend triggers revalidation:
- Use a private authenticated endpoint or signed internal event.
- Verify signature, timestamp and replay protection.
- Validate the slug/revision and authorize the caller.
- Never expose a general unauthenticated cache-purge endpoint.
- Ensure cache keys include tenant identity and content revision.
- Define safe fallback behaviour if revalidation fails.

## Required technical validation before implementation

1. Inspect `apps/traveller-web/package.json`, lockfile and installed Next.js version.
2. Verify whether the version uses `middleware.ts`, `proxy.ts`, or another supported request interception convention. Do not copy obsolete examples.
3. Verify whether `output: 'standalone'` is supported and how it interacts with the app's build scripts and deployment.
4. Verify route handler/server component support and on-demand revalidation behaviour in this version.
5. Verify that dynamic hostname resolution works in the intended Node runtime and reverse-proxy topology.
6. Verify the interaction with existing static `generateStaticParams()` routes and remove mock-only assumptions only when replaced with real data.
7. Document wildcard DNS, wildcard TLS certificate requirements, root-domain routing and Nginx proxy headers.
8. Confirm a local development strategy for tenant subdomains (for example, controlled host mapping or a documented local hostname convention).

If any assumption fails, stop and present the evidence plus a compatible implementation alternative. Do not silently switch to a separate service.

## Consequences

### Positive
- One frontend codebase and shared UI/business presentation.
- Dynamic partner subdomain resolution.
- Search-engine-friendly server-rendered partner pages.
- Approved content can be published without rebuilding the entire static website.
- Future custom-domain mapping can be added without committing to it now.

### Negative / trade-offs
- The website requires a Node.js runtime; pure static hosting is no longer sufficient.
- Runtime operations, caching and server security become production responsibilities.
- Wildcard DNS and TLS must be configured correctly.
- Hostname routing and cache isolation require security tests.

## Out of scope for this ADR

- Custom domains in the initial release.
- Separate mini-site frontend service.
- Partner subscription policy/pricing.
- Final visual templates and SEO content model.

## Acceptance criteria

- [ ] Main website continues to render on root/www host.
- [ ] Valid partner subdomains resolve to the correct partner mini-site.
- [ ] Unknown/reserved subdomains do not reveal another tenant's data.
- [ ] Tenant resolution is not based on an untrusted client-supplied slug alone.
- [ ] Draft edits do not change published content.
- [ ] Admin approval publishes the approved revision and invalidates the correct cache.
- [ ] Cache invalidation endpoint/event is authenticated and replay-resistant.
- [ ] Version-specific Next.js implementation details are documented and tested.
- [ ] Build and production container run in Node standalone mode.
