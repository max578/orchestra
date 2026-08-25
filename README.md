# The ORCHESTRA — site

Source of the public showcase for the ORCHESTRA, a constellation of
single-responsibility R packages for grain-crop analytics unified by one
result contract. The site explains the system, catalogues its members, and
states the study series the members are configured for.

Static site built with Astro; no client framework, no third-party requests,
self-hosted fonts, strict content-security policy.

## Develop

```sh
npm ci
npm run dev
```

## Build and check

```sh
SITE_ORIGIN=https://max578.github.io SITE_BASE=/orchestra npm run build
node scripts/site_audit.mjs dist          # markup, links, metadata, asset budget
python3 scripts/leak_guard.py dist        # nothing private leaves the build
```

`SITE_ORIGIN` and `SITE_BASE` are the only host-specific values; the same
source publishes at a root origin (leave `SITE_BASE` empty) or a sub-path.

## Publish

Pushes to `main` build and deploy to GitHub Pages through
`.github/workflows/pages.yml`.

## Licence

MIT (site source). The packages the site describes carry their own licences.
