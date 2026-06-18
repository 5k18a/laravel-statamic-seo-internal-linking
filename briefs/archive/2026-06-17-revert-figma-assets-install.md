# Brief archiwum: REVERT-figma-assets-install

**Data aktywacji:** 2026-06-17 17:36
**Data zamknięcia:** 2026-06-17 17:45
**Status końcowy:** ✅ Wykonane (Codex) + accepted (Claude)

## Cel zadania

Wycofać addon `mariohamann/statamic-figma-assets` zainstalowany kilka godzin wcześniej tego samego dnia (FEATURE-figma-assets-install, 16:50). Powód: addon nie ma browse'a/UI do wyboru pojedynczych ikon, użytkownik znalazł lepiej pasujący Iconify (`eminos/statamic-iconify`).

## Zakres pracy (8 kroków)

0. Pre-task backup (opcjonalny — Codex sam zdecydował o backup-7)
1. `composer remove mariohamann/statamic-figma-assets`
2. Usunąć path repo z `composer.json`
3. `rm -rf addons/mariohamann/`
4. `rm config/statamic-figma-assets.php`
5. Zastąp 7-liniową sekcję Figma Assets w `.env` 3-liniowym blokiem z samym `FIGMA_TOKEN` + komentarze (zachowanie tokenu na przyszłość)
6. Usuń `FIGMA_*` z `.env.example`
7. `optimize:clear`, `stache:refresh`, `view:clear`
8. `php artisan test` + HTTP smoke + CP weryfikacja

## Faktyczne wykonanie (Codex)

Wszystkie 8 kroków wykonane. Dodatkowo:

- Utworzony backup-7 (354 MB) — Codex słusznie wykonał backup mimo briefowej sugestii "pomiń", argumentując że backup-6 był sprzed cleanupu icons containers
- Pierwszy `composer remove` przerwany na braku DNS w sandboxie; po eskalacji sieciowej — sukces
- Nie zainstalował Iconify (zgodnie z 11.7 — brief explicit zakazywał, mimo że user wspomniał o "etapie 1 i 2" w wiadomości)

## Wyniki

- `composer show mariohamann/statamic-figma-assets`: package not found
- `composer.json` repositories: tylko `wysiwyg-html-fieldtype`
- `addons/mariohamann/`: nie istnieje
- `config/statamic-figma-assets.php`: nie istnieje
- `.env`: tylko `FIGMA_TOKEN=figd_...` z komentarzami
- `.env.example`: bez `FIGMA_*`
- `Statamic\Facades\Utility::all()->map->handle()`: `["cache","phpinfo","search","email","licensing"]` (brak `figma_assets`)
- HTTP `/`, `/en/`: 200, 200
- `/cp/utilities/figma-assets` jako admin: 404
- `php artisan test`: 2 passed
- Rozmiar projektu: 716 → 712 MB

## Audyt Claude (2026-06-17 17:45)

Decyzja: **accepted**

Weryfikacja niezależna potwierdziła wszystkie 8 kryteriów akceptacji.

## Następne (FEATURE-iconify-install)

Brief Iconify aktywuje się natychmiast jako osobne zadanie. `FIGMA_TOKEN` zachowany w `.env` (gdyby kiedyś znów potrzeba addonu Figma).
