# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-18-1200
active_task_id: none
active_task_name: Brak aktywnego zadania
active_task_status: none
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-18 12:00 Europe/Warsaw
last_synced_by: Claude
last_closed: AUDYT-2026-06-17-tasks
next_after_active: Decyzja użytkownika — retłumaczenie Home EN lub Formularze kontaktowe
<!-- PROJECT_SYNC_END -->

## Status

**BRAK AKTYWNEGO ZADANIA** — Iconify zainstalowany i działa, pierwsza sekcja Page Buildera oparta o `iconify` została wdrożona. Dokumentacja poniżej została uzupełniona przez Codex w trybie zastępczym za Claude; Claude ma po powrocie przeprowadzić audyt i ewentualnie skorygować statusy zgodnie z `AGENTS.md`.

## Ostatnio zamknięte (dzisiaj — duża sesja porządkowa)

- `ICONIFY-prefix-extension` ✅ accepted (2026-06-17) — rozszerzono `config/statamic-iconify.php` o prefixy `map`, `temaki`, `maki`, `game-icons`, `bx`, `bxs`, `bxl`; `mdi` było już obecne; `php artisan optimize:clear` OK; `config("statamic-iconify.allowed_prefixes")` pokazuje pełną listę.
- `BACKUP-8-after-iconify-docs` ✅ created (2026-06-17 20:33) — `backup-projekt/skalisty-orion-backup-8.tar.gz` (354 MB); zawiera `skalisty-orion/` oraz główne pliki dokumentacji workspace (`AGENTS.md`, `BRIEF_CODEX.md`, `PROJECT_STATUS_CODEX.md`, `CLAUDE_MEMORY.md`, `CODEX_SUGGESTIONS.md`, `CONCLUSIONS_CODEX.md`, `codex-memory.md`, `CHANGE-LOG.md`); wykluczone: `node_modules`, `.git`, cache/sessions/views/logs.
- `FEATURE-icon-box-with-text` ✅ accepted by user (2026-06-17) — nowy set Page Buildera `Icon Box With Text Section`; fieldset `icon_box_with_text_section.yaml`, widok `page_builder/icon_box_with_text_section.antlers.html`, rejestracja w `all_page_builder.yaml`; layout 3/4 boxy nad itemami; ikony przez `iconify` + `store_as: svg_data`; użytkownik potwierdził, że działa dobrze.
- `ICONIFY-magic-translator-check` ✅ verified (2026-06-17) — Magic Translator widzi nowy set i wyciąga `section_title`, `items.*.title`, `items.*.description`; celowo pomija `layout` i `icon`; Home PL jest `stale` względem EN i wymaga `--include-stale` albo `--overwrite`, jeżeli ma przepisać nowy blok do EN.
- `FEATURE-iconify-install` ✅ accepted (2026-06-17) — `eminos/statamic-iconify` v2.1.0 (MIT, natywny ^6.0); 7 setów w `allowed_prefixes` (tabler, heroicons, mdi, ph, fa6-solid, fa6-brands, lucide); `default_store_as: svg_data` (offline render); 2 korekty techniczne Codex (svg→svg_data + poprawna fasada Statamic 6); 0 modyfikacji blueprintów; brief w `briefs/archive/2026-06-17-feature-iconify-install.md`
- `REVERT-figma-assets-install` ✅ accepted (2026-06-17) — usunięty addon Figma Assets; `FIGMA_TOKEN` zachowany w `.env` na przyszłość; backup-7 (354 MB)
- `CLEANUP-icons-containers-remove` ✅ accepted (2026-06-17) — kontenery Tabler + Hugeicons usunięte (9590 SVG, ~46 MB redukcji); backup-6
- `FEATURE-figma-assets-install` ✅ accepted (2026-06-17) — instalacja addonu Figma Assets (wycofany 3h później)
- `Workflow-CODEX_SUGGESTIONS-extension` ✅ (2026-06-17) — AGENTS.md 11.9 + 11.10 (pełna dwukierunkowa komunikacja); pierwszy praktyczny test cyklu NOTES_FROM_CLAUDE → potwierdzenie Codex zadziałał

## Następne kroki (decyzja użytkownika)

1. **Audyt Claude po powrocie** — sprawdzić zmiany wykonane przez Codex bez bieżącego udziału Claude, w szczególności dokumentację, `Icon Box With Text Section`, Magic Translator i rozszerzenie prefixów Iconify.
2. **Decyzja użytkownika: tłumaczenie Home PL -> EN** — nowy blok `icon_box_with_text_section` istnieje w PL Home, ale EN Home jeszcze go nie zawiera; dry-run pokazuje `1 will re-translate (stale)`.
3. **Wdrożenie cleanup icons na serwer** `dev.skalisty.pl` (per sugestia Codex po CLEANUP) — bez tego serwer nadal może mieć kontenery `icons`/`icons2` z 2026-06-01.
4. **Formularze kontaktowe** — backlog priorytet (Statamic Forms vs addon).
5. **POC Figma z faktycznym tokenem** — `FIGMA_TOKEN` jest w `.env`; gdyby kiedyś znów pojawiła się potrzeba batch importu z konkretnego pliku Figma, addon `mariohamann/statamic-figma-assets` można reinstalować analogicznie do wzorca w archiwum.

## Uwaga dla kolejnego briefu wdrożenia iconify

W polach blueprintu używać `store_as: svg_data` (nie `svg`) — addon używa wartości `svg_data`. Brief instalacji miał błąd, Codex skorygował.
