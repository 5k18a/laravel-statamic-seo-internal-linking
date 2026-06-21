# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-21-2300
active_task_id: FEATURE-internal-links-collection-scope-dedup
active_task_name: Internal Links — filtr kolekcji + deduplicacja linków per strona
active_task_status: active
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-21 23:00 Europe/Warsaw
last_synced_by: Claude
last_closed: FEATURE-internal-links-bard
next_after_active: Wariant B Internal Links Addon (production-ready) lub inny element z backlogu
<!-- PROJECT_SYNC_END -->

---

## Status

**AKTYWNE: FEATURE-internal-links-collection-scope-dedup**

---

## Cel zadania

Rozszerzenie addonu `skalisty/internal-links` o dwie nowe funkcjonalności:

1. **Filtr kolekcji** — każda reguła linkowania może być ograniczona do wybranych kolekcji (np. tylko `blogs`, albo tylko `faqs` + `pages`). Jeśli pole jest puste, reguła działa wszędzie (zachowanie obecne).
2. **Deduplicacja celu per strona** — każdy unikalny URL docelowy może być podlinkowany na danej stronie maksymalnie raz. Jeśli reguła A już wstawiła link do `/oferta/sztuczna-rafa`, żadna inna reguła nie doda kolejnego linka do tego samego URL na tej samej stronie.

---

## Kontekst

Addon `skalisty/internal-links` (lokalny w `addons/skalisty/internal-links/`) działa na zasadzie Antlers modifier `apply_internal_links`. Modifier jest wywoływany oddzielnie dla każdego bloku tekstu na stronie (może być wywołany 3-7 razy na jednej stronie — raz per blok wysiwyg/free_text/bard set). Deduplicacja musi działać **między wywołaniami** w obrębie jednego requestu HTTP.

Kontekst Antlers (`$context`) przekazywany do modifiera zawiera dane bieżącego wpisu, w tym `collection` — handle kolekcji bieżącej strony.

---

## Analiza gotowych rozwiązań

### Czy zadanie dotyczy nowej większej funkcjonalności?

NIE — to rozszerzenie istniejącego autorskiego addonu. Brak zewnętrznych rozwiązań — zmiana wyłącznie w kodzie `addons/skalisty/internal-links/`.

### Uzasadnienie pominięcia pełnej analizy

Obie funkcje są naturalnym rozwinięciem istniejącej architektury. Nie wymagają nowych pakietów. Decyzja architektoniczna podjęta przez Claude:
- Filtr kolekcji: pole `limit_to_collections` w blueprincie + sprawdzenie w modifierze
- Deduplicacja: statyczna właściwość PHP na klasie modifiera, zerowana per request

---

## Zakres pracy

### Zmiana 1 — Blueprint (filtr kolekcji)

Dodać pole `limit_to_collections` do blueprintu **w obu lokalizacjach** (addon + opublikowana kopia):

```yaml
-
  handle: limit_to_collections
  field:
    type: collections
    display: 'Ogranicz do kolekcji'
    instructions: 'Zostaw puste aby reguła działała na wszystkich stronach. Wybierz kolekcje aby ograniczyć tylko do nich (np. tylko blogi).'
    mode: select
    localizable: false
```

Pole wstawić **po `target_entry`, przed `keywords`**.

### Zmiana 2 — Modifier PHP (obie funkcje)

Plik: `addons/skalisty/internal-links/src/Modifiers/ApplyInternalLinks.php`

**Deduplicacja** — dodać statyczną właściwość:

```php
private static array $usedTargetUrls = [];
```

Przed pętlą keywords w metodzie `index()`: jeśli `$targetEntry->url()` jest już w `self::$usedTargetUrls` — skipować cały link (`continue` w pętli `foreach ($links as $link)`). Jeśli nie — dodać URL do `self::$usedTargetUrls` przed/po `replaceKeyword`.

**Filtr kolekcji** — w metodzie `index()`, po pobraniu `$links`, wyciągnąć kolekcję bieżącego wpisu z `$context`:

```php
$currentCollection = $this->currentCollection($context);
```

Przy iteracji po `$links` — sprawdzić `$link->get('limit_to_collections', [])`. Jeśli lista niepusta i `$currentCollection` nie jest na liście — skipować ten link (`continue`).

Dodać metodę pomocniczą:

```php
private function currentCollection($context): ?string
{
    $entry = $context['current_entry'] ?? $context['entry'] ?? null;
    if ($entry && method_exists($entry, 'collectionHandle')) {
        return $entry->collectionHandle();
    }
    return null;
}
```

---

## Pliki do sprawdzenia

- `addons/skalisty/internal-links/src/Modifiers/ApplyInternalLinks.php` — aktualny kod modifiera
- `addons/skalisty/internal-links/resources/blueprints/collections/internal_links/internal_link.yaml` — blueprint w addonie
- `resources/blueprints/collections/internal_links/internal_link.yaml` — opublikowana kopia blueprintu

## Pliki do zmiany

1. `addons/skalisty/internal-links/src/Modifiers/ApplyInternalLinks.php` — deduplicacja + filtr kolekcji
2. `addons/skalisty/internal-links/resources/blueprints/collections/internal_links/internal_link.yaml` — nowe pole
3. `resources/blueprints/collections/internal_links/internal_link.yaml` — nowe pole (kopia)

Szablony Antlers — **bez zmian**.

---

## Wymagania techniczne

- `self::$usedTargetUrls` musi być `static` (nie `private`) aby utrzymywał stan między wieloma wywołaniami modifiera w jednym requeście
- Filtr kolekcji: gdy `limit_to_collections` jest pustą tablicą lub `null` — reguła działa na wszystkich kolekcjach (backwards-compatible)
- Filtr kolekcji: gdy `$currentCollection` jest `null` (np. strona niebędąca wpisem kolekcji) — reguła działa (bezpieczny fallback, nie skipować)
- Deduplicacja działa **per URL** — dwa różne URL-e mogą być oba podlinkowane na tej samej stronie
- NIE modyfikować szablonów Antlers
- NIE modyfikować ServiceProvider ani innych plików addonu
- NIE commitować — commit należy do Claude po audycie

---

## Ograniczenia

- Statyczna właściwość `$usedTargetUrls` jest współdzielona przez cały request — to oczekiwane i pożądane zachowanie
- Pole `limit_to_collections` typu `collections` w Statamic 6 zwraca tablicę handle'ów kolekcji — weryfikacja przez `in_array($currentCollection, $limitTo)` jest wystarczająca
- Nie dodawać resetowania `$usedTargetUrls` (np. w konstruktorze) — musi być trwały przez cały request

---

## Kryteria akceptacji

- [ ] Pole `limit_to_collections` widoczne w CP przy edycji wpisu `internal_links`
- [ ] Reguła z pustym `limit_to_collections` działa na wszystkich stronach (obecne zachowanie)
- [ ] Reguła z `limit_to_collections: [blogs]` podlinkuje słowo tylko na stronach bloga, nie na pages/services/projects
- [ ] Jeśli reguła A wstawiła link do URL `/x` — żadna kolejna reguła w tym samym requeście nie wstawi drugiego linka do `/x`
- [ ] Dwa różne URL-e mogą być oba podlinkowane na tej samej stronie (deduplicacja działa per URL, nie globalnie)
- [ ] `php artisan test` → 2 passed
- [ ] HTTP `GET /` → 200, `GET /en/` → 200
- [ ] Brak nowych błędów w `storage/logs/laravel.log`

---

## Testowanie

Codex powinien wykonać:

1. `php artisan view:clear && php artisan statamic:stache:refresh`
2. `php artisan test` → 2 passed
3. `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8001/` → 200

**Test filtra kolekcji:**
- Dodać testowy wpis `internal_links` z `limit_to_collections: [blogs]` i słowem, które istnieje zarówno w blogu jak i na stronie page/service
- Sprawdzić że słowo jest podlinkowane na stronie bloga, ale NIE na stronie page/service

**Test deduplicacji:**
- Dodać dwa testowe wpisy `internal_links` z różnymi słowami kluczowymi ale tym samym `target_entry`
- Sprawdzić że na stronie bloga pojawia się tylko jeden link do danego URL (pierwsze trafienie linkuje, drugie słowo kluczowe zostaje niezlinkowane)

Po testach: usunąć testowe wpisy + `statamic:stache:refresh`.

---

## Rollback

Rollbackiem są pliki w `.rollback/` (szablony Antlers — niezmienione). Dla plików PHP i YAML rollback przez `git checkout` konkretnych plików addonu:
```bash
git checkout addons/skalisty/internal-links/src/Modifiers/ApplyInternalLinks.php
git checkout addons/skalisty/internal-links/resources/blueprints/collections/internal_links/internal_link.yaml
git checkout resources/blueprints/collections/internal_links/internal_link.yaml
```

---

## Synchronizacja dokumentacji

- [x] `PROJECT_STATUS_CODEX.md` ma ten sam `active_task_id`
- [x] `PROJECT_STATUS_CODEX.md` pokazuje to zadanie w sekcji `W trakcie`
- [x] `CLAUDE_MEMORY.md` ma ten sam `active_task_id`
- [x] `CLAUDE_MEMORY.md` pokazuje ten brief jako ostatni brief dla Codex
- [x] `FEATURE-internal-links-bard` przeniesione do Wykonanych
- [x] nie ma wpisu `Brak aktywnych zadań` gdy brief jest aktywny

---

## Informacje do zapisania w CODEX_SUGGESTIONS.md

Codex po zakończeniu pracy powinien dopisać w sekcji `ACTIVE_FOR_CLAUDE_REVIEW`:

- czy `$context` zawierał `current_entry` czy `entry` (lub inny klucz) — jak wyciągnięto `collectionHandle()`
- wyniki obu testów funkcjonalnych (filtr kolekcji + deduplicacja)
- czy pole `collections` w blueprincie zwróciło oczekiwaną strukturę danych w PHP
- ewentualne ryzyka (np. edge cases przy wielokrotnym wywołaniu modifiera per request)

## Informacje do zapisania w codex-memory.md

- jak wyciągnąć handle kolekcji bieżącego wpisu z `$context` modifiera Statamic
- że `static` property jest właściwym mechanizmem per-request state w modifierze Statamic

## Informacje do zapisania w CONCLUSIONS_CODEX.md

Nie wymagane dla tej zmiany.

---

*Plik utrzymywany przez Claude. Stała lokalnego dev: frontend `http://127.0.0.1:8001/`, PHP lokalnie `php artisan` (na dhosting: `php84`).*
