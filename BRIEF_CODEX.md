# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-20-1006
active_task_id: none
active_task_name: Brak aktywnego zadania
active_task_status: closed
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-20 10:06 Europe/Warsaw
last_synced_by: Claude
last_closed: FEATURE-services-route-pl-oferta
next_after_active: Decyzja użytkownika
<!-- PROJECT_SYNC_END -->

---

## ZADANIE: FEATURE-services-route-pl-oferta

### Cel

Zmienić trasę URL dla pojedynczej usługi z `/service/{slug}` (globalnie) na **zlokalizowaną**:
- PL: `/oferta/{slug}`
- EN + 10 pozostałych locale: `/service/{slug}` (bez zmian)

Następnie wpiąć kolekcję `services` do istniejącego panelu **CP > Tools > Trasy URL kolekcji** analogicznie jak `projects` — żeby użytkownik mógł w CP edytować trasy dla każdego locale przez UI.

Wzorzec: dokładnie ten sam mechanizm co dla `projects` (PL `/realizacje/{slug}`, reszta `/project/{slug}`).

### Pliki do zmiany — 5 obszarów

#### 1. `content/collections/services.yaml` — zlokalizowanie trasy

**Stare:**
```yaml
title: Services
template: service/show
revisions: false
route: '/service/{slug}'
date_behavior: ...
```

**Nowe:**
```yaml
title: Services
template: service/show
revisions: false
route:
  pl: '/oferta/{slug}'
  en: '/service/{slug}'
  sv: '/service/{slug}'
  'no': '/service/{slug}'
  nl: '/service/{slug}'
  lv: '/service/{slug}'
  it: '/service/{slug}'
  fr: '/service/{slug}'
  es: '/service/{slug}'
  de: '/service/{slug}'
  da: '/service/{slug}'
  cs: '/service/{slug}'
date_behavior: ...
```

> Klucz `'no'` musi być w cudzysłowach (zgodnie z konwencją Projects).

#### 2. `app/Http/Controllers/CP/CollectionRoutesController.php` — dodać services

Linia 16 — tablica `$managedCollections`. Obecnie:
```php
private array $managedCollections = [
    'projects' => 'Projekty (Projects)',
];
```

Po zmianie:
```php
private array $managedCollections = [
    'projects' => 'Projekty (Projects)',
    'services' => 'Usługi (Services)',
];
```

Cała reszta logiki (`index`, `edit`, `update`, `readYaml`, `writeYaml`) jest collection-agnostic — żadna inna zmiana w kontrolerze nie jest potrzebna.

#### 3. Linki w 8 widokach — hardcoded `/service/` → `{{ url }}`

Obecnie 23 wystąpień hardcoded `href="/service/{{ slug }}"` (różne warianty: `{{slug}}`, `{{ slug }}`, jedno `./service/`) w 8 plikach:

| Plik | Wystąpień |
|------|-----------|
| `resources/views/page_builder/service_section.antlers.html` | 14 (linie 45, 90, 96, 107, 153, 158, 198, 250, 295, 301, 310, 355, 362 + jedno z `./service/`) |
| `resources/views/partials/header-1.antlers.html` | 1 (linia 223) |
| `resources/views/partials/header-2.antlers.html` | 1 (linia 240) |
| `resources/views/partials/header-3.antlers.html` | 1 (linia 231) |
| `resources/views/partials/header-4.antlers.html` | 1 (linia 223) |
| `resources/views/partials/footer-1.antlers.html` | 2 (linie 47, 73) |
| `resources/views/partials/footer-4.antlers.html` | 1 (linia 53) |
| `resources/views/partials/search-results.antlers.html` | 1 (linia 13) |

**Zamiana wzorca** (uniwersalna, pasuje do wszystkich wariantów odstępów):

```antlers
href="/service/{{ slug }}"   →   href="{{ url }}"
href="/service/{{slug}}"     →   href="{{ url }}"
href="./service/{{ slug }}"  →   href="{{ url }}"
```

> **Dlaczego `{{ url }}`**: w Statamic `{{ url }}` na pojedynczym entry zwraca URL z `route` per locale automatycznie — dla PL wygeneruje `/oferta/architectural-design`, dla EN `/en/service/architectural-design`. Tak samo działa dla Projects (header-1 linia ~270: `<a href="{{ url }}">` w `{{ project_entries }}`).
> 
> Wszystkie 23 wystąpienia są wewnątrz pętli `{{ services }}` lub `{{ collection:services }}` (lub `{{ service_entries }}` w header), więc `{{ url }}` ma poprawny kontekst entry.

**Walidacja kontekstu** (przed zamianą):
```bash
grep -c 'href="\.\?/service/{{\s*slug\s*}}"' resources/views/page_builder/service_section.antlers.html resources/views/partials/*.antlers.html
# spodziewane łącznie: 23
```

**Walidacja po zamianie:**
```bash
grep -rn 'href="/service/' resources/views/
# spodziewane: 0
grep -rn 'href="./service/' resources/views/
# spodziewane: 0
```

#### 4. Linki w nawigacji PL — hardcoded yaml

`content/trees/navigation/pl/main.yaml` linia 117:
```yaml
url: /service/architectural-design
```
→ zmienić na:
```yaml
url: /oferta/architectural-design
```

`content/trees/navigation/en/main.yaml` linia 117 — **bez zmian** (EN zostaje `/en/service/architectural-design`).

Pozostałe 10 plików `content/trees/navigation/{cs,da,de,es,fr,it,lv,nl,no,sv}/main.yaml` — sprawdź gdzie URL Services jest hardcoded; jeżeli `/service/...` to **bez zmian** (te locale zostają `/service/{slug}`).

#### 5. Brak zmian w `routes/cp.php`

Routing CP dla `collection-routes` jest już zarejestrowany generycznie — żadna zmiana nie jest potrzebna (kontroler obsługuje wszystkie collection w `$managedCollections`).

### Walidacja

```bash
php artisan statamic:stache:refresh
php artisan view:clear
php artisan cache:clear
php artisan test
```

HTTP smoke test (na lokalnym `127.0.0.1:8001`):
```bash
curl -sSI -o /dev/null -w "/oferta/architectural-design (PL) → %{http_code}\n" http://127.0.0.1:8001/oferta/architectural-design
curl -sSI -o /dev/null -w "/service/architectural-design (PL, stara) → %{http_code}\n" http://127.0.0.1:8001/service/architectural-design  # spodziewane 404
curl -sSI -o /dev/null -w "/en/service/architectural-design (EN) → %{http_code}\n" http://127.0.0.1:8001/en/service/architectural-design
curl -sSI -o /dev/null -w "/ (home PL) → %{http_code}\n" http://127.0.0.1:8001/
```

**Walidacja CP** (manualna, do potwierdzenia przez użytkownika):
1. Otwórz `/cp/collection-routes` — powinno pokazać dwie pozycje: „Projekty (Projects)" i „Usługi (Services)".
2. Klik „Usługi (Services)" → tabela z 12 trasami per locale; PL ma `/oferta/{slug}`, reszta `/service/{slug}`.
3. Zmień testowo np. CS na `/sluzby/{slug}`, zapisz, sprawdź czy `content/collections/services.yaml` ma nowy klucz `cs: '/sluzby/{slug}'`.

### Ograniczenia (AGENTS.md)

- **NIE commitować** (AGENTS.md 22.2)
- Tylko 5 obszarów wymienionych powyżej — nie modyfikować innych plików
- **Nie usuwać** `route` z `services.yaml` ani nie zmieniać `template` (`service/show` zostaje)
- Po deployu Claude wykona standardowy deploy zmian na `dev.skalisty.pl`

### Stałe lokalnego dev

- Frontend: `http://127.0.0.1:8001/`
- PHP lokalnie: `php artisan` (serwer dhosting: `php84`)

### Pytania otwarte — zgłoś w `OPEN_QUESTIONS_FROM_CODEX` przed implementacją, jeżeli

- Znajdziesz hardcoded `/service/` w plikach poza listą (np. w `content/collections/services/*/show.md` body field) — wymień, ja zdecyduję.
- Trasa `/oferta/{slug}` koliduje z istniejącym entry/route (np. strona o slug `oferta` w `pages`).

---

*Brief napisany przez Claude, 2026-06-20*
