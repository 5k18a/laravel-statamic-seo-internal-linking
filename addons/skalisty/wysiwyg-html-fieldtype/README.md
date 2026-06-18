# WYSIWYG HTML Fieldtype for Statamic 6

Statamic addon providing a custom `wysiwyg_html` fieldtype for editors who need a visual editor and raw HTML source editing in one field.

The field stores a single HTML string and lets the editor switch between:

- WYSIWYG mode powered by TipTap 3.
- HTML/source mode powered by CodeMirror 5 when available in the Statamic Control Panel, with a textarea fallback.
- Native Statamic asset browser integration for inserting images.

This repository was extracted from the `Skalisty-New-2` Statamic/Laravel project. The current code is based on local package version `wysiwyg-html-fieldtype-v1.1`; historical project notes are preserved in `docs/`.

## Requirements

- PHP compatible with Laravel 13 / Statamic 6.
- Statamic CMS `^6.0`.
- Node/Vite for rebuilding Control Panel assets.

## Installation

For local development in a Statamic project, add the package as a path repository:

```json
{
  "repositories": [
    {
      "type": "path",
      "url": "addons/skalisty/wysiwyg-html-fieldtype"
    }
  ],
  "require": {
    "skalisty/wysiwyg-html-fieldtype": "*"
  }
}
```

Then run:

```bash
composer update skalisty/wysiwyg-html-fieldtype
```

When published to a VCS/Packagist-compatible source, install with:

```bash
composer require skalisty/wysiwyg-html-fieldtype
```

## Development

Install JS dependencies and build the Control Panel bundle:

```bash
npm install
npm run build
```

The built bundle is committed at `resources/dist/addon.js`, because Statamic loads it through the addon service provider.

## Usage

Use the `wysiwyg_html` fieldtype in a Statamic blueprint or fieldset:

```yaml
-
  handle: content
  field:
    type: wysiwyg_html
    display: Content
    container: assets
    placeholder: Write HTML content...
```

Field configuration:

- `container`: optional Statamic asset container handle used by the asset browser. Defaults to `assets`.
- `placeholder`: optional editorial placeholder text.

On the frontend, the field augments to an `HtmlString`, so render it in templates where trusted editorial HTML is expected.

## Current Feature Set

- TipTap 3 editor with headings, bold, italic, underline, strike, lists, links, alignment, blockquote, inline code, horizontal rule and images.
- HTML source mode with CodeMirror 5 or textarea fallback.
- WYSIWYG/source synchronization through TipTap `getHTML()` and `setContent()`.
- Fullscreen editing mode.
- Image URL editing and image alignment controls.
- Native Statamic `asset-browser` modal integration.
- Asset container preload from PHP fieldtype config.

## Repository Notes

- `src/` and `resources/` are the addon source.
- `resources/dist/addon.js` is the built CP script loaded by Statamic.
- `examples/statamic/` contains copyable fieldset and Antlers examples from the original host project.
- `docs/project/` contains project-level decision notes from the original Skalisty work.
- `docs/history/v1.0/` contains preserved v1.0 planning/history documents. The v1.1 code is the current mainline.
- `docs/INTEGRATION_EXAMPLES.md` explains the example fieldsets/views and their host-project assumptions.

## Known Follow-Ups

- Add dedicated tests for PHP fieldtype processing/augmentation.
- Remove debug `\Log::` calls from `WysiwygHtml::preload()` or guard them behind a `APP_DEBUG` flag before public marketplace release.
- Verify clean installation in a fresh Statamic 6 project through Composer VCS/path repository.
- Publish to Packagist when ready for wider use.
