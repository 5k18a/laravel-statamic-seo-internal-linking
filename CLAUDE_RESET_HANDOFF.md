# Claude Handoff After Hard Reset

## Read This First

This file is the post-reset source of truth for the current `skalisty-orion` project.

Anything Claude remembers from the pre-reset project based on:

- custom Laravel + Statamic adaptation of `theme-ivena`
- failed/abandoned custom page-builder migration
- previous `skalisty-laravel` direction before the reset

should be treated as obsolete for the Orion branch.

The user explicitly decided that the previous direction had gone in the wrong direction and requested a fresh restart.

## Workspace Overview

- Workspace root:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2`
- Current Orion project:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion`
- There is also a separate `skalisty-laravel` project based on Vitalis:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-laravel`
- The user is currently actively working on the Orion branch, not the old pre-reset custom Invena branch.

## Why The Hard Reset Happened

The earlier custom migration/adaptation approach became too complex and drifted away from the user's goal.

The user requested:

1. discard the previous custom implementation direction
2. keep the project memory and markdown notes
3. start from a fresh Laravel + Statamic installation
4. test alternative starter/theme baselines

This resulted in two clean post-reset branches:

- `skalisty-laravel` using Vitalis
- `skalisty-orion` using Orion

The later work in this thread focused on `skalisty-orion`.

## Fresh Orion Installation

The Orion project was rebuilt from scratch after the reset.

### Base install

- A fresh Statamic project was created:
  - `composer create-project statamic/statamic skalisty-orion`
- Current stack:
  - Laravel `13.12.0`
  - Statamic `6.20.0`
  - PHP `8.3.x`

### Theme source

- Theme/source repo used:
  - `webbycrown/orion-statamic-theme`

### How Orion was applied

This was not built as a custom migration from the previous codebase.

Instead, the Orion starter/theme export was overlaid onto the fresh Statamic install by copying the theme's exported project files into the new app.

Imported areas include:

- `routes`
- `content`
- `app/Http`
- `resources/blueprints`
- `resources/fieldsets`
- `resources/forms`
- `resources/views`
- `public/assets`
- `storage/forms`
- `package.json`
- `vite.config.js`
- `README.md`

### Frontend build

Executed:

- `npm install`
- `npm run build`

## Current Runtime / Access

- Frontend:
  - `http://127.0.0.1:8001`
- Control Panel:
  - `http://127.0.0.1:8001/cp`

Important:

- `APP_URL` was normalized to:
  - `http://127.0.0.1:8001`
- This was done to avoid host/session mismatches between `localhost` and `127.0.0.1`.

Admin credentials are stored in:

- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/ADMIN_ACCESS.txt`

## Major Post-Reset Decisions

### 1. Orion became the active exploration branch

After creating the clean Vitalis-based branch, the user requested a second clean installation based on Orion.

The user then continued working primarily on Orion.

### 2. Multisite is the chosen localization model

The project was converted to native Statamic multisite instead of using a separate plugin as the foundation for multilingual behavior.

Current configuration:

- `pl` at `/`
- `en` at `/en/`

Files:

- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/sites.yaml`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/config/statamic/system.php`

This is important:

- Polish is the default public site
- English is a secondary localized site

### 3. Content translation and UI string translation are treated as different problems

The user wants both:

- translation of entries/content
- translation of hardcoded frontend UI strings

The adopted model is:

- content translation:
  - Statamic multisite + Magic Translator
- frontend string translation:
  - Laravel/Statamic language files in `lang/*`
  - `{{ trans:... }}` in Antlers views

Frontend string translation has not been implemented yet. It is explicitly pending.

## What Was Fixed / Changed In Orion

The following sections describe actual changes made after the Orion install.

### A. Demo content compatibility fixes for Statamic 6

Problem:

- Orion appears to have been built against Statamic 5.x
- Running it on Statamic 6 caused some content/global data to load incorrectly

Observed symptom:

- some globals looked present in files but rendered as null in templates
- some assets/links rendered empty

What was done:

- global data was reorganized into the Statamic 6-compatible structure under:
  - `content/globals/default/*.yaml` where needed in earlier fixes
- root global set files were preserved as definitions
- at least one template rendering issue was corrected:
  - `resources/views/page_builder/service_section.antlers.html`

Effect:

- demo content began rendering correctly on Statamic 6
- empty asset/link behavior was reduced/fixed

### B. Scroll lock issue on the frontend was fixed

Problem:

- the page could not scroll
- newsletter/cookie popup behavior was locking the body

What was changed:

- popup-related behavior was adjusted so it no longer permanently locked page scroll

Files touched:

- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/public/assets/js/custom.js`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/partials/newsletter-popup.antlers.html`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/partials/cookie-popup.antlers.html`

Effect:

- frontend scrolling works again

### C. Yellow branding preset was introduced

The user wanted the site to move toward a yellow brand direction.

What was changed:

- the default primary theme color was changed to a yellow/golden palette
- the default active preset remained `theme-primary`, but the values behind it were adjusted
- theme persistence behavior was updated so stale local storage would not keep the older color preset

Files touched:

- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/public/assets/css/tailwind.css`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/layout.antlers.html`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/public/assets/js/custom.js`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/content/globals/pl/theme_settings.yaml`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/content/globals/en/theme_settings.yaml`

Effect:

- the project now defaults to a yellow-oriented visual identity

### D. Multisite was enabled and switched to `pl` root + `en` subpath

The user explicitly requested:

- Polish under `/`
- English under `/en`

What was done:

- Statamic multisite was enabled
- site config was updated
- routes/content/url behavior was aligned with the new site structure

Files:

- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/sites.yaml`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/config/statamic/system.php`

Effect:

- root site is Polish
- English lives at `/en`

### E. Native frontend language switcher was added

The user asked for a language switcher and later requested a dropdown because more languages are expected in the future.

Chosen approach:

- native Statamic `{{ locales }}` support
- no language-switcher plugin required

Implementation:

- a dedicated language switcher partial was created/updated
- it was attached to the active header
- later converted from a simple `PL / EN` style to a dropdown-style selector

Files:

- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/partials/language-switcher.antlers.html`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/partials/header-1.antlers.html`

Effect:

- users can switch site language on the frontend
- implementation is extensible for more locales later

### F. Hero/page-builder editability was fixed in multisite

The user reported that on the Home page:

- hero image looked present visually
- but CP did not allow selecting/replacing the asset
- other fields such as descriptions were greyed out / non-editable

Root cause:

- the localized entry inherited data from its origin
- `page_builder` was not localizable
- some hero image values were stored in a shape that the CP could render poorly for asset fields
- the hero fieldset also contained a badly chosen custom field named `type`, colliding conceptually with Replicator's own `type`

What was changed:

1. `page_builder` was made localizable
2. hero asset values were normalized so CP can render them correctly
3. conflicting custom `type` fields were removed from hero slide definitions

Files:

- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/all_page_builder.yaml`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/hero_slide_section.yaml`
- home variants under:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/content/collections/pages/pl`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/content/collections/pages/en`

Effect:

- localized page builder content became editable
- hero asset field behavior in CP became usable

### F2. Globals origin metadata was corrected for the Polish primary site

The user later found that multiple globals were editable in English but read-only in Polish.

Root cause:

- several globals metadata files had an inverted origin model
- `en` was set as the origin and `pl` inherited from it
- this was incorrect because `pl` is the primary site mounted at `/`

What was changed:

- 8 globals metadata files under `content/globals/*.yaml` were updated from:
  - `en -> null`
  - `pl -> en`
- to:
  - `en -> pl`
  - `pl -> null`

`theme_settings.yaml` was intentionally not changed because it already had the correct origin model.

After the change:

- `php artisan statamic:stache:refresh` was run
- tests still passed

Expected effect:

- globals fields for the Polish site should no longer be read-only in CP

### G. Magic Translator was installed and configured for DeepL

The user wanted an admin-side translation workflow using DeepL API.

Chosen addon:

- `el-schneider/statamic-magic-translator`

Installed version:

- `v0.1.2`

Other relevant package:

- `superinteractive/statamic-super-admin-toolbar v2.1.1`

Magic Translator setup included:

- package install
- published config
- queue configuration
- database-backed queue usage
- worker process for translations

Files/config:

- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/config/statamic/magic-translator.php`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/.env`

Important workflow notes discovered during debugging:

- CP translations are queued, so queue worker health matters
- after changing `DEEPL_API_KEY`, both of these were necessary:
  - `php artisan config:clear`
  - `php artisan queue:restart`

### H. Magic Translator initially failed because the first DeepL key was invalid for API usage

The user created test pages and reported that English localizations were being created but text remained untranslated.

What was investigated:

- localized entry files
- queue logs
- DeepL integration path

What was found:

- localizations such as `en/test2.md` were being created
- but they were basically empty except for `origin`
- frontend then appeared to show untranslated Polish content because the localized entry inherited/fell back to origin content
- logs showed `DeepL authentication failed` and `Forbidden`

This was a real API-key problem, not a Statamic content-model problem.

Later, the user supplied a new DeepL key and the issue was resolved.

New working key was written to `.env` and the queue/config were refreshed.

Final effect:

- Magic Translator is now working
- the user confirmed translation is functioning

### I. Super Admin Toolbar was installed and confirmed

The user wanted a WordPress-like frontend admin bar.

Chosen addon:

- `superinteractive/statamic-super-admin-toolbar`

What was done:

- package installed
- assets published
- toolbar tag added to the head partial

Files:

- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/partials/head-link.antlers.html`
- addon assets under:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/public/vendor/statamic-super-admin-toolbar`

Why it may still not be visible:

- likely session/host mismatch during testing
- this is why `APP_URL` was normalized to `127.0.0.1:8001`

Status:

- technically installed
- loader renders on frontend
- visually confirmed by the user as working on the frontend

## Current Multilingual Model

### Implemented

- multisite enabled
- Polish site:
  - `/`
- English site:
  - `/en`
- localized content structure in place
- content translation working through Magic Translator + DeepL
- frontend language switcher present

### Not implemented yet

- translation of hardcoded UI/frontend strings in the theme

This is a separate upcoming task and should not be confused with entry translation.

## Current Plan For Frontend String Translation

The user explicitly asked about translating hardcoded UI such as:

- `404 error`
- `Search`
- `Submit`
- `Next Post`
- `Share`

The agreed architectural direction is:

1. keep entry/content translation in Statamic multisite
2. implement UI string translation using Laravel/Statamic language files
3. use Antlers `trans` tags in templates

Planned structure:

- `lang/pl/ui.php`
- `lang/en/ui.php`

Then replace hardcoded strings in Orion views with keys like:

- `{{ trans:ui.search }}`
- `{{ trans:ui.submit }}`
- `{{ trans:ui.error_404 }}`

This is not done yet. It is intentionally pending.

## Important Files To Know

### Core project config

- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/.env`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/sites.yaml`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/config/statamic/system.php`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/config/statamic/magic-translator.php`

### Theme/UI

- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/layout.antlers.html`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/partials/head-link.antlers.html`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/partials/header-1.antlers.html`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/partials/language-switcher.antlers.html`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/public/assets/css/tailwind.css`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/public/assets/css/extra.css`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/public/assets/js/custom.js`

### Builder / content editability

- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/all_page_builder.yaml`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/hero_slide_section.yaml`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/content/collections/pages/pl`
- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/content/collections/pages/en`

### Logs and diagnostics

- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/storage/logs/laravel.log`

## Verified State

At different points after these changes, the following checks passed:

- `php artisan test`
- `php artisan statamic:stache:refresh`
- `php please search:update --all`
- `npm run build`

Frontend/control-panel routes previously verified with `200` responses include:

- `/`
- `/en`
- `/about-us`
- `/en/about-us`
- `/services`
- `/en/services`
- `/contact-us`
- `/en/contact-us`
- `/cp/auth/login`

## Open Items

### 1. Frontend string translation

Still pending. This is the next clear multilingual improvement beyond content translation.

### 2. Additional multilingual scaling

The language switcher has already been converted to a dropdown-style approach because the user expects more languages later.

Future locale additions should continue to use the same multisite model.

## What Claude Should Not Assume

Claude should not assume any of the following are still the active project direction:

- custom Invena migration work
- the old raw-HTML page-builder strategy from before the hard reset
- old pre-reset architecture notes as current truth

Those are now historical context only.

## Short Practical Summary

If Claude needs the shortest possible current understanding:

1. The old pre-reset direction was abandoned.
2. `skalisty-orion` is a fresh Laravel 13 + Statamic 6 project based on Orion.
3. Multisite is enabled with `pl` on `/` and `en` on `/en`.
4. A dropdown language switcher exists on the frontend.
5. Magic Translator + DeepL is installed and now works for content translation.
6. Yellow branding has been applied as the current default visual direction.
7. Page-builder localizability/hero editability issues were fixed.
8. Super Admin Toolbar is installed and confirmed working.
9. Frontend UI string translation is planned but not yet implemented.
