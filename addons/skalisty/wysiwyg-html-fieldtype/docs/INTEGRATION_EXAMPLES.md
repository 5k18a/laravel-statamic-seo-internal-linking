# Integration Examples

This document preserves the practical Statamic integration patterns used in the original `Skalisty-New-2 / skalisty-orion` project.

The files in `examples/statamic/` are safe, copyable examples. They are not required by the addon itself, but they show how the `wysiwyg_html` fieldtype was used in real page-builder fieldsets and Antlers views.

## Example Files

```text
examples/statamic/resources/fieldsets/wysiwyg_html_block.yaml
examples/statamic/resources/views/page_builder/wysiwyg_html_block.antlers.html

examples/statamic/resources/fieldsets/free_text_section.yaml
examples/statamic/resources/views/page_builder/free_text_section.antlers.html

examples/statamic/resources/fieldsets/columns_section.yaml
examples/statamic/resources/views/page_builder/columns_section.antlers.html

examples/statamic/resources/fieldsets/all_page_builder.yaml
```

## Standalone HTML Editor Block

`wysiwyg_html_block.yaml` defines a simple page-builder block:

- `width`: section width selector.
- `background_color`: optional section background.
- `content`: `type: wysiwyg_html`, using the `assets` container.

The matching Antlers view renders:

```antlers
{{ content }}
```

The addon augments the field to an HTML string, so this is intended for trusted editorial HTML.

## Free Text Section With Optional Columns

`free_text_section.yaml` shows a more advanced migration path from Bard/HTML split fields to one `wysiwyg_html` field.

It supports:

- `layout_mode: single`: one `wysiwyg_html` field named `content`.
- `layout_mode: columns`: a replicator where each column has its own `wysiwyg_html` `content`.
- `columns_layout`: 2, 3 or 4 columns.
- Width variants including `full_no_padding`.

The matching Antlers view switches between single-column and grid rendering.

## Separate Columns Section

`columns_section.yaml` is the cleaner long-term pattern for multi-column content:

- A dedicated page-builder set instead of overloading `free_text_section`.
- A `columns` replicator.
- One `wysiwyg_html` field per column.

This keeps editorial intent clearer and follows the roadmap note that columns should be a separate block in future iterations.

## Page Builder Registration

`all_page_builder.yaml` is copied from the host project and includes many project-specific sets from the Orion-based site. For a new project, do not copy it blindly.

Use it as a reference for adding only the relevant sets:

```yaml
wysiwyg_html_block:
  display: 'HTML Editor Block'
  fields:
    -
      import: wysiwyg_html_block
columns_section:
  display: 'Columns Section'
  fields:
    -
      import: columns_section
```

## Host Project Assumptions

The examples assume:

- A Statamic asset container named `assets`.
- A page-builder replicator based on fieldset imports.
- Tailwind-style utility classes in frontend templates.
- CSS class `.cms-content` in the host theme for editorial HTML styling.

Adjust these names/classes to the host project.

## What Not To Copy Automatically

- Do not copy the entire `all_page_builder.yaml` into a different site unless the site has all imported fieldsets.
- Do not assume `assets` is the correct asset container in every project.
- Do not copy project-specific Tailwind spacing classes if the host theme uses a different design system.

