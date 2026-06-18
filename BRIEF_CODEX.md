# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-19-0130
active_task_id: none
active_task_name: Brak aktywnego zadania
active_task_status: idle
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-19 01:00 Europe/Warsaw
last_synced_by: Claude
last_closed: SYNC-and-deploy-completion-year
next_after_active: Decyzja użytkownika — retłumaczenie Home EN lub Formularze kontaktowe
<!-- PROJECT_SYNC_END -->

---

# AKTYWNY BRIEF: SYNC-and-deploy-completion-year

## Cel

Dwufazowa operacja:

1. **FAZA 1 — Pull (serwer → lokalnie):** ściągnięcie treści i assetów wprowadzonych przez użytkownika w CP online (dev.skalisty.pl) do lokalnego projektu
2. **FAZA 2 — Push (lokalnie → serwer):** wdrożenie lokalnych zmian kodu z `FEATURE-completion-year-sort` na serwer

Po wykonaniu obu faz użytkownik ręcznie doda wartości `completion_year` do projektów przez CP online.

---

## Dane dostępowe

- SSH user: `skalisty@skalisty.ssh.dhosting.pl`
- Hasło SSH: z pliku `server_deploy/SERWER_DOSTEP.txt`
- Katalog na serwerze: `~/skalisty_2026/` (pełna ścieżka: `/home/klient.dhosting.pl/skalisty/skalisty_2026/`)
- PHP na serwerze (SSH): `php84`
- Katalog lokalny projektu: `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/`

---

## FAZA 1 — Pull: serwer → lokalnie

### 1.1 Pull content/ (z wyjątkiem projects.yaml)

`content/collections/projects.yaml` zawiera lokalnie dodane `sort_field` i `sort_direction` — **nie nadpisywać** tą wersją z serwera.

```bash
sshpass -p 'HASŁO' rsync -av --delete \
  --exclude='collections/projects.yaml' \
  -e "ssh -o StrictHostKeyChecking=no" \
  skalisty@skalisty.ssh.dhosting.pl:skalisty_2026/content/ \
  /home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/content/
```

> Uwaga: `--delete` usuwa lokalnie pliki których nie ma na serwerze. `content/collections/projects.yaml` jest wykluczone — zostaje lokalna wersja z sort_field.

### 1.2 Pull assetów (tylko nowe pliki)

```bash
sshpass -p 'HASŁO' rsync -av \
  -e "ssh -o StrictHostKeyChecking=no" \
  skalisty@skalisty.ssh.dhosting.pl:skalisty_2026/public/assets/images/ \
  /home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/public/assets/images/
```

Bez `--delete` — dociągamy tylko nowe pliki, nie usuwamy lokalnych.

Jeżeli użytkownik wgrywał projekty (grafiki do kolekcji projects) lub inne pliki assets poza `images/` — dociągnąć analogicznie odpowiednie podkatalogi.

### 1.3 Odśwież lokalny stache

```bash
cd /home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion
php artisan statamic:stache:refresh && php artisan cache:clear
```

### 1.4 Commit lokalny

```bash
cd /home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion
git add content/ public/assets/
git status
git commit -m "sync: treści i assety z dev.skalisty.pl ($(date +%Y-%m-%d))"
```

---

## FAZA 2 — Push: lokalnie → serwer

### 2.1 Rsync kodu i konfiguracji na serwer

```bash
sshpass -p 'HASŁO' rsync -av \
  --exclude='.git' \
  --exclude='.env' \
  --exclude='node_modules/' \
  --exclude='storage/framework/cache/' \
  --exclude='storage/framework/sessions/' \
  --exclude='storage/framework/views/' \
  --exclude='storage/logs/' \
  --exclude='database/database.sqlite' \
  --exclude='public/hot' \
  --exclude='ADMIN_ACCESS.txt' \
  -e "ssh -o StrictHostKeyChecking=no" \
  /home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/ \
  skalisty@skalisty.ssh.dhosting.pl:skalisty_2026/
```

To wyśle wszystkie zmienione pliki w tym:
- `app/Providers/AppServiceProvider.php` (computed field `completion_year_sort`)
- `resources/blueprints/collections/projects/project.yaml` (pole `completion_year`)
- `content/collections/projects.yaml` (sort_field + sort_direction)
- `resources/views/page_builder/project_section.antlers.html` (sort= w 3 tagach)
- i cały content/ / assets/ już zsynchronizowany w Fazie 1

### 2.2 Komendy post-deploy na serwerze

```bash
sshpass -p 'HASŁO' ssh -o StrictHostKeyChecking=no \
  skalisty@skalisty.ssh.dhosting.pl \
  "cd skalisty_2026 && php84 artisan config:clear && php84 artisan cache:clear && php84 artisan view:clear && php84 artisan statamic:stache:refresh && php84 artisan test"
```

Oczekiwany wynik: `2 passed`

### 2.3 Walidacja runtime

Sprawdź w przeglądarce:
- `https://dev.skalisty.pl/realizacje` — HTTP 200, projekty w kolejności od Tarnowskie Termy (lub jakikolwiek najnowszy) do Afrykarium (2014)
- `https://dev.skalisty.pl/` — HTTP 200, strona główna działa
- `https://dev.skalisty.pl/en/` — HTTP 200

---

## Czego NIE robić

- Nie używać `--delete` przy pushu na serwer — mogłoby usunąć pliki serwera (logi, storage sessions)
- Nie nadpisywać `.env` na serwerze — `rsync --exclude='.env'` tego pilnuje
- Nie uruchamiać `php84 artisan migrate` — baza MySQL na serwerze jest aktualna
- Nie dodawać `completion_year` ręcznie do plików MD przed pulliem — serwer i tak je nadpisze; użytkownik doda przez CP po deployu

---

## Commit po zakończeniu

```
sync: treści online→offline + deploy FEATURE-completion-year-sort na dev.skalisty.pl

Faza 1: content/ i assets z dev.skalisty.pl zsynchronizowane lokalnie
Faza 2: AppServiceProvider, blueprint, projects.yaml, project_section wdrożone na serwer
```

---

## Ostatnio zamknięte

- `FEATURE-completion-year-sort` ✅ accepted (2026-06-19)
- `BUGFIX-sticky-header-default` ✅ accepted (2026-06-18)
- `BUGFIX-slider-seamless-loop` ✅ accepted (2026-06-18)
- `FEATURE-logos-slider-with-icons` ✅ accepted (2026-06-18)
- `SETUP-git-workflow` ✅ zamknięty przez Claude (2026-06-18)

## Następne po aktywnym

- Decyzja użytkownika: retłumaczenie Home EN lub Formularze kontaktowe

## Cel

Projekty na stronie `/realizacje` mają się wyświetlać od najnowszych do najstarszych (malejąco po roku zakończenia). Obecnie kolekcja sortuje alfabetycznie po tytule.

Rozwiązanie: nowe pole `completion_year` (integer) w blueprincie kolekcji `projects` — wyłącznie do celów sortowania, niewidoczne na froncie. Istniejące pole tekstowe `Data Zakończenia` w replicatorze `details` pozostaje bez zmian (służy wyświetlaniu, nie sortowaniu).

---

## Pliki do zmiany

### 1. `resources/blueprints/collections/projects/project.yaml`

Dodaj nowe pole `completion_year` do zakładki `sidebar`, **po polu `slug`** (linia ~269):

```yaml
  sidebar:
    display: Sidebar
    sections:
      -
        fields:
          -
            handle: slug
            field:
              type: slug
              localizable: true
              validate: 'max:200'
          -
            handle: completion_year
            field:
              type: integer
              display: 'Rok zakończenia (sortowanie)'
              instructions: 'Rok używany wyłącznie do sortowania listy projektów. Nie wyświetla się na stronie. Dla projektów wieloetapowych wpisz rok ostatniego etapu.'
              localizable: false
              listable: false
              validate: 'nullable|integer|min:1990|max:2099'
```

---

### 2. `content/collections/projects.yaml`

Dodaj `sort_field` i `sort_direction` po bloku `date_behavior` (linia ~9):

**Przed:**
```yaml
date_behavior:
  past: public
  future: private
sites:
```

**Po:**
```yaml
date_behavior:
  past: public
  future: private
sort_field: completion_year
sort_direction: desc
sites:
```

---

### 3. `resources/views/page_builder/project_section.antlers.html`

Trzy tagi `{{ collection:projects }}` wymagają dodania `sort="completion_year:desc"`.

**Linia 192** (show_type = project-page-one, ma filtry wyszukiwania):

Przed:
```
{{ collection:projects as="projects" paginate="{pagination}" limit="{limit}" title:contains="{ get:s }" slug:contains="{ get:s }"  }}
```
Po:
```
{{ collection:projects as="projects" paginate="{pagination}" limit="{limit}" sort="completion_year:desc" title:contains="{ get:s }" slug:contains="{ get:s }"  }}
```

**Linia 241** (show_type = project-page-two):

Przed:
```
{{ collection:projects as="projects" paginate="{pagination}" limit="{limit}" }}
```
Po:
```
{{ collection:projects as="projects" paginate="{pagination}" limit="{limit}" sort="completion_year:desc" }}
```

**Linia 305** (show_type = project-page-three):

Przed:
```
{{ collection:projects as="projects" paginate="{pagination}" limit="{limit}" }}
```
Po:
```
{{ collection:projects as="projects" paginate="{pagination}" limit="{limit}" sort="completion_year:desc" }}
```

---

### 4. Uzupełnienie danych — 10 plików treści PL

Dodaj `completion_year: <rok>` do frontmattera każdego pliku (po kluczu `blueprint: project`, przed `title:`):

| Plik | completion_year |
|------|----------------|
| `content/collections/projects/pl/afrykarium.md` | 2014 |
| `content/collections/projects/pl/oceanika.md` | 2015 |
| `content/collections/projects/pl/tarnowskie-termy.md` | 2024 |
| `content/collections/projects/pl/woliera-argusa.md` | 2018 |
| `content/collections/projects/pl/baseny-tropikalne.md` | 2019 |
| `content/collections/projects/pl/orientarium-lwy-azjatyckie.md` | 2019 |
| `content/collections/projects/pl/wybieg-wydry-europejskiej.md` | 2019 |
| `content/collections/projects/pl/woliera-dzioborozca-zoo-warszawa.md` | 2019 |
| `content/collections/projects/pl/ogrod-w-alpach.md` | 2021 |
| `content/collections/projects/pl/grota-z-lourdes.md` | 2022 |

Uwaga: Tarnowskie Termy mają w polu wyświetlanym wartość `'2015 i 2024'` (dwa etapy). Do sortowania użyto roku **2024** (ostatni etap). Jeśli użytkownik woli 2015 — zmiana w CP lub w pliku MD.

17 pozostałych projektów (demo) **nie dostaje** `completion_year` — będą miały wartość `null` i Statamic automatycznie wyrzuci je na koniec listy za realnymi projektami z datą.

---

## Czego NIE robić

- Nie modyfikować pola `details` ani wartości `Data Zakończenia` w żadnym projekcie — to pole służy wyświetlaniu na stronie i pozostaje bez zmian
- Nie dodawać `completion_year` do plików EN, CS, DE i pozostałych lokalizacji — pole jest `localizable: false`, dziedziczone z PL
- Nie modyfikować szablonów `project/show.antlers.html`, `project/index.antlers.html` — `completion_year` nie ma się wyświetlać na froncie
- Nie zmieniać kolejności parametrów w tagach `{{ collection:projects }}` poza dodaniem `sort=`

---

## Walidacja po implementacji

```bash
php artisan statamic:stache:refresh
```

Następnie w przeglądarce (lokalnie `http://127.0.0.1:8001`):

1. Wejdź na `/realizacje` — projekty powinny być posortowane: Grota z Lourdes (2022), Ogród w Alpach (2021), projekty z 2019 (4 sztuki), Woliera Argusa (2018), Oceanika/Termy (2015), Afrykarium (2014), demo projekty na końcu
2. Sprawdź `/en/project` — ten sam sort (bo `completion_year` jest `localizable: false`)
3. W CP → Collections → Projects: kolejność wpisów w listingu powinna odpowiadać sortowaniu malejącemu
4. Sprawdź że CP → edit projektu → zakładka Sidebar zawiera nowe pole `Rok zakończenia (sortowanie)` z wpisaną wartością

```bash
php artisan test
```

---

## Commit po zakończeniu

```
feat: sortowanie projektów po roku zakończenia (completion_year)

- blueprint projects/project.yaml: nowe pole completion_year (integer, sidebar)
- content/collections/projects.yaml: sort_field: completion_year, sort_direction: desc
- project_section.antlers.html: sort="completion_year:desc" w 3 tagach collection:projects
- 10 plików treści PL: uzupełniono completion_year (2014–2024)
```

---

## Ostatnio zamknięte

- `BUGFIX-sticky-header-default` ✅ accepted (2026-06-18)
- `BUGFIX-slider-seamless-loop` ✅ accepted (2026-06-18)
- `FEATURE-logos-slider-with-icons` ✅ accepted (2026-06-18)
- `ICONIFY-prefix-extension` ✅ accepted (2026-06-17)
- `FEATURE-icon-box-with-text` ✅ accepted (2026-06-17)
- `SETUP-git-workflow` ✅ zamknięty przez Claude (2026-06-18)

## Następne po aktywnym

- Decyzja użytkownika: retłumaczenie Home EN lub Formularze kontaktowe
