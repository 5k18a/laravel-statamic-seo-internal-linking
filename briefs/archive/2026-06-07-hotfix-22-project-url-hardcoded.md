# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-07-1700
active_task_id: HOTFIX-22-project-url-hardcoded
active_task_name: HOTFIX-22 — hardkodowane /project/ w szablonach
active_task_status: ready
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-07 17:00 Europe/Warsaw
last_synced_by: Claude
last_closed: FEATURE-collection-routes-panel
next_after_active: Formularze
<!-- PROJECT_SYNC_END -->

---

## Cel zadania

Zastąpić wszystkie hardkodowane `href="/project/{{ slug }}"` natywną zmienną Statamic `href="{{ url }}"` w 8 plikach szablonów Antlers.

## Kontekst

Motyw Orion konstruuje URL projektów ręcznie: `href="/project/{{ slug }}"`. Statamic ma wbudowaną zmienną `{{ url }}` na każdym obiekcie entry, która zwraca poprawny URL na podstawie konfiguracji `route` w YAML kolekcji. Po zmianie trasy PL na `/realizacje/{slug}` (FEATURE-collection-routes-panel) linki nadal wskazują na `/project/` bo szablony omijają system routowania. Rozwiązanie: mechaniczna zamiana `"/project/{{ slug }}"` → `"{{ url }}"` we wszystkich plikach.

## Analiza gotowych rozwiązań

### Czy to nowa funkcjonalność?

NIE — to naprawa hardkodowanych ścieżek. Czysta zamiana stringa w 8 plikach.

## Zakres pracy

**Tylko jedna zmiana we wszystkich plikach:**
```
href="/project/{{ slug }}"  →  href="{{ url }}"
```

### Pliki do zmiany (wszystkie 8, łącznie 29 wystąpień):

| Plik | Liczba wystąpień |
|------|-----------------|
| `resources/views/page_builder/project_section.antlers.html` | 11 |
| `resources/views/page_builder/featured_projects.antlers.html` | 3 |
| `resources/views/partials/header-1.antlers.html` | 3 |
| `resources/views/partials/header-2.antlers.html` | 3 |
| `resources/views/partials/header-3.antlers.html` | 3 |
| `resources/views/partials/header-4.antlers.html` | 3 |
| `resources/views/partials/search-results.antlers.html` | 1 |
| `resources/views/project/show.antlers.html` | 2 |

## Wymagania techniczne

- `{{ url }}` w Antlers zwraca pełny URL entry (z uwzględnieniem site prefix i kolekcji `route`)
- W każdym z tych szablonów `{{ slug }}` jest dostępny bo `{{ url }}` też jest — obydwa są właściwościami entry
- Żadne inne zmiany nie są wymagane — same atrybuty `href`

## Ograniczenia

- Zmieniać WYŁĄCZNIE wartość atrybutu `href` — nie tykać class, tekstu, struktury HTML
- Nie zmieniać żadnych innych wystąpień słowa `project` (nazwy klas CSS, komentarze, itp.)
- Nie przebudowywać CSS (`npm run build` nie jest wymagany — to zmiany tylko w `.antlers.html`)

## Kryteria akceptacji

- [ ] Żadne wystąpienie `href="/project/{{ slug }}"` nie pozostało w `resources/views/`
- [ ] Wszystkie 8 plików ma `href="{{ url }}"` w miejscach gdzie było `href="/project/{{ slug }}"`
- [ ] Strona PL: kliknięcie w projekt prowadzi do `/realizacje/{slug}`
- [ ] Strona EN: kliknięcie w projekt prowadzi do `/en/project/{slug}`

## Testowanie

Codex powinien:

1. Wykonać zamianę we wszystkich 8 plikach (może użyć `sed -i` lub edytora)
2. Zweryfikować: `grep -rn '/project/{{ slug }}' resources/views/` — powinno zwrócić brak wyników
3. Uruchomić serwer lokalnie (`php artisan serve --port=8001`) i otworzyć stronę główną
4. Sprawdzić przez Playwright MCP: kliknąć w dowolny projekt — URL powinien być `/realizacje/{slug}` na PL
5. Sprawdzić EN: `/en/` → klik w projekt → URL `/en/project/{slug}`

## Synchronizacja dokumentacji

Po zakończeniu Codex aktualizuje:
- `BRIEF_CODEX.md` — zamknąć task
- `PROJECT_STATUS_CODEX.md` — przenieść do Wykonane
- `CLAUDE_MEMORY.md` — zaktualizować state_version i etapy
- Zsynchronizować `state_version` we wszystkich trzech plikach
