# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-20-0800
active_task_id: none
active_task_name: Brak aktywnego zadania
active_task_status: closed
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-20 07:30 Europe/Warsaw
last_synced_by: Claude
last_closed: STYLE-bard-nested-sections-padding-half-v2
next_after_active: Decyzja użytkownika
<!-- PROJECT_SYNC_END -->

---

## ZADANIE: STYLE-bard-nested-sections-padding-half-v2

### Cel

Pierwsza iteracja (`STYLE-bard-nested-sections-padding-half`, zamknięta) zmniejszyła padding o połowę, ale klient nadal widzi za duży odstęp. Zmniejszamy **kolejne 50% od aktualnych wartości** — czyli docelowo 25% oryginału.

### Plik

```
resources/views/service/show.antlers.html
```

### Stan obecny — 9 wystąpień jednego patternu

Po iteracji 1, w pliku jest 9 linii (linie: 18, 36, 48, 61, 85, 105, 123, 141, 188) z klasą:

```html
<div class="container 2xl:py-[35px] 1xl:py-8 lg:py-7 sm:py-5 py-4">
```

### Zmiana — exact replace_all

Zastąp **wszystkie 9 wystąpień** dokładnie tej linii:

**Stare:**
```
<div class="container 2xl:py-[35px] 1xl:py-8 lg:py-7 sm:py-5 py-4">
```

**Nowe:**
```
<div class="container 2xl:py-[18px] 1xl:py-4 lg:py-3.5 sm:py-2.5 py-2">
```

**Mapowanie wartości (w pikselach):**

| Klasa | Stara | Nowa |
|-------|-------|------|
| `2xl:py-[35px]` → `2xl:py-[18px]` | 35px | 18px (≈ 17.5, zaokrąglone w górę) |
| `1xl:py-8` → `1xl:py-4` | 32px | 16px |
| `lg:py-7` → `lg:py-3.5` | 28px | 14px |
| `sm:py-5` → `sm:py-2.5` | 20px | 10px |
| `py-4` → `py-2` | 16px | 8px |

> 35/2 = 17.5 — wartość `2xl:py-[18px]` to zaokrąglenie matematyczne w górę. Wszystkie pozostałe to dokładne połówki.

Użyj `Edit` z `replace_all: true` lub `sed -i`.

### Walidacja po zmianie

```bash
grep -c "container 2xl:py-\[18px\] 1xl:py-4 lg:py-3.5 sm:py-2.5 py-2" resources/views/service/show.antlers.html
# oczekiwany: 9
grep -c "container 2xl:py-\[35px\] 1xl:py-8 lg:py-7 sm:py-5 py-4" resources/views/service/show.antlers.html
# oczekiwany: 0
```

### Build CSS — **WYMAGANE**

Nowe klasy (`2xl:py-[18px]`, `1xl:py-4`, `lg:py-3.5`, `sm:py-2.5`, `py-2`) nie są jeszcze w `public/assets/css/output.css`. Tailwind 4 skanuje pliki w `@source "../views"`, więc po zmianie szablonu:

```bash
npm run build
```

Następnie:
```bash
php artisan view:clear
php artisan test
```

### Walidacja runtime

```bash
curl -sSI -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:8001/
```

> Lokalny dev serwer Statamic działa na **`127.0.0.1:8001`** (nie `8000`). Lokalna komenda PHP: `php artisan` (na serwerze dhosting: `php84`).

### Ograniczenia (AGENTS.md)

- **NIE commitować** (AGENTS.md 22.2)
- Tylko `service/show.antlers.html` — nie dotykać innych szablonów ani `service_section.antlers.html`
- Po akceptacji audytu — Claude wykona deploy szablonu + zbudowany CSS na `dev.skalisty.pl`

---

*Brief napisany przez Claude, 2026-06-20*
