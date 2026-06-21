# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-22

### Added
- Antlers modifier `apply_internal_links` for automatic keyword substitution in HTML/Bard content
- `LinkableContentParser` — HTML-aware keyword replacer that protects headings, existing links, images, figures, iframes, and WordPress embed comments from substitution
- `internal_links` Statamic collection with blueprint for managing keyword → entry mappings
- Per-locale keyword support: each keyword in the replicator has an optional `locale` field; empty = all languages, set = specific language only
- Target entry URL resolves automatically to the correct language version via Statamic's native multisite URL resolution (`Entry::in($site)`)
- Deduplication: each target URL is linked at most once per page request
- `php artisan internal-links:install` command — creates collection YAML, publishes blueprint, refreshes stache
- `vendor:publish --tag=internal-links-blueprints` for blueprint-only publish
- `vendor:publish --tag=internal-links-collection` for collection-only publish
- Blueprint fields: `target_entry`, `keywords` (replicator with `keyword` + `locale`), `weight`, `nofollow`, `open_in_new_window`, `enabled`
