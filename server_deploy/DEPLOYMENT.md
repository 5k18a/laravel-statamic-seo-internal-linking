# DEPLOYMENT.md
# Dokumentacja wdrożenia — dev.skalisty.pl (dhosting)
# Ostatnia aktualizacja: 2026-06-18

---

## Środowisko docelowe

| Parametr | Wartość |
|----------|---------|
| Domena | https://dev.skalisty.pl |
| Hosting | dhosting.pl |
| SSH | `skalisty@skalisty.ssh.dhosting.pl` |
| Skrypt SSH | `/home/pestycyd/Insync/biuro@skalisty.pl/OneDrive/Linux/bin/skalisty-ssh` uruchamiany przez `bash` |
| Katalog projektu na serwerze | `~/skalisty_2026/` (pełna ścieżka: `/home/klient.dhosting.pl/skalisty/skalisty_2026/`) |
| Document root subdomeny | `~/skalisty_2026/public/` |
| PHP | 8.4.21 (binarka: `php84`) |
| Baza danych | MySQL — dane dostępowe w `server_deploy/SERWER_DOSTEP.txt` |

> Dane wrażliwe (hasła SSH, MySQL) przechowywane wyłącznie w `server_deploy/SERWER_DOSTEP.txt` oraz w lokalnym skrypcie SSH użytkownika — nie przepisywać haseł do dokumentacji.

> Uwaga operacyjna 2026-06-17: `/usr/bin/skalisty-ssh` nie był użyty przez Codex do deploymentu, bo w trybie automatycznym zwracał `Permission denied`. Działający wariant to skrypt z katalogu `Insync/.../Linux/bin`, uruchamiany jako `/bin/bash '/home/pestycyd/Insync/biuro@skalisty.pl/OneDrive/Linux/bin/skalisty-ssh' 'komenda'`.

---

## Struktura repozytorium lokalnego związana z deploymentem

```
/home/pestycyd/Dokumenty/Skalisty-New-2/
├── skalisty-orion/               ← aktywny projekt (źródło deployu)
├── backup-projekt/               ← backupy projektu (docelowa, stała lokalizacja)
│   ├── skalisty-orion-backup-2.tar.gz  ← backup v2 (2026-06-06, 358 MB)
│   ├── skalisty-orion-backup-4.tar.gz  ← backup v4 (2026-06-07, 348 MB)
│   └── skalisty-orion-backup-8.tar.gz  ← backup v8 (2026-06-17, 354 MB) ← AKTUALNY
├── server_deploy/
│   ├── www-5.tar.gz              ← paczka deploymentowa (stan 2026-06-06)
│   ├── baza_danych/              ← backup SQLite (2026-06-01)
│   ├── baza_danych-2/            ← backup SQLite (2026-06-02)
│   ├── baza_danych-2.tar.gz
│   ├── .env.production           ← szablon .env dla serwera (bez APP_KEY)
│   └── SERWER_DOSTEP.txt         ← WRAŻLIWE — dane dostępowe, nie commitować
└── DEPLOYMENT.md                 ← ten plik
```

---

## Pierwsze wdrożenie (2026-06-01)

### 1. Przygotowanie paczki lokalnie

Paczka tworzona przez rsync z katalogu `skalisty-orion/` do `server_deploy/www/`:

```bash
rsync -av --copy-links \
  --exclude='node_modules/' \
  --exclude='.git' \
  --exclude='.env' \
  --exclude='ADMIN_ACCESS.txt' \
  --exclude='BRIEF_CODEX.md' \
  --exclude='CONCLUSIONS_CODEX.md' \
  --exclude='PROJECT_STATUS_CODEX.md' \
  --exclude='storage/logs/*.log' \
  --exclude='storage/framework/cache/data/' \
  --exclude='storage/framework/sessions/' \
  --exclude='storage/framework/views/' \
  --exclude='database/database.sqlite' \
  --exclude='public/hot' \
  skalisty-orion/ server_deploy/www/
```

Flaga `--copy-links` jest konieczna — zamienia symlinki na rzeczywiste pliki (dotyczy m.in. `public/vendor/wysiwyg-html-fieldtype/js/addon.js`).

### 2. Archiwizacja i upload na serwer

```bash
cd server_deploy
tar -czf www.tar.gz www/
# upload przez panel dhosting lub scp do ~/
scp www.tar.gz skalisty@skalisty.ssh.dhosting.pl:~/
```

### 3. Rozpakowanie na serwerze

```bash
cd ~/
tar -xzf www.tar.gz
mv www skalisty_2026
```

### 4. Konfiguracja subdomeny w panelu dhosting

- Subdomena: `dev.skalisty.pl`
- Document root: `skalisty_2026/public`
- Wersja PHP: 8.4

---

## Deploy przyrostowy — 2026-06-19 — completion-year-sort + sync treści

### Zakres wdrożenia

- `FEATURE-completion-year-sort`: pole `completion_year` w blueprincie projects, computed field `completion_year_sort` w AppServiceProvider, `sort_field` w projects.yaml, `sort="completion_year_sort:desc"` w 3 tagach project_section
- 2 nowe projekty zsynchronizowane z serwera: `djurs-sommerland`, `osada-jaworzyny-spa` (PL + 11 locale)
- aktualizacja nawigacji PL (mega menu projektów) zsynchronizowana z serwera

### Metoda

Rsync bezpośredni SSH (bez pośredniej paczki tar.gz):

```bash
sshpass -p '...' rsync -av \
  --exclude='.git' --exclude='.env' --exclude='node_modules/' \
  --exclude='storage/framework/cache/' --exclude='storage/framework/sessions/' \
  --exclude='storage/framework/views/' --exclude='storage/logs/' \
  --exclude='database/database.sqlite' --exclude='public/hot' --exclude='ADMIN_ACCESS.txt' \
  -e "ssh -o StrictHostKeyChecking=no" \
  skalisty-orion/ skalisty@skalisty.ssh.dhosting.pl:skalisty_2026/
```

### Komendy post-deploy

```bash
php84 artisan config:clear && php84 artisan cache:clear && php84 artisan view:clear
php84 artisan statamic:stache:refresh
php84 artisan test  # → 2 passed
```

### Walidacja

- `https://dev.skalisty.pl/realizacje` — 200, projekty posortowane malejąco po roku ✅
- `https://dev.skalisty.pl/` — 200 ✅
- blueprint field `completion_year` widoczny w CP → projekt → Sidebar ✅

---

## Deploy przyrostowy — 2026-06-17 — Iconify + Icon Box With Text

### Zakres wdrożenia

Wdrożono na `dev.skalisty.pl` dzisiejszy stan lokalnego projektu po pracach Codex:

- addon `eminos/statamic-iconify` v2.1.0
- `config/statamic-iconify.php` z `default_store_as: svg_data`
- prefixy Iconify: `tabler`, `heroicons`, `mdi`, `map`, `temaki`, `maki`, `game-icons`, `bx`, `bxs`, `bxl`, `ph`, `fa6-solid`, `fa6-brands`, `lucide`
- nowy set Page Buildera `Icon Box With Text Section`
- fieldset `resources/fieldsets/icon_box_with_text_section.yaml`
- widok `resources/views/page_builder/icon_box_with_text_section.antlers.html`
- rejestracja setu w `resources/fieldsets/all_page_builder.yaml`
- bieżący content lokalny, w tym Home PL z nowym blokiem `icon_box_with_text_section`

### Pre-check serwera

Przed synchronizacją sprawdzono:

- katalog docelowy: `/home/klient.dhosting.pl/skalisty/skalisty_2026`
- `php84 artisan --version`: Laravel Framework 13.12.0
- na serwerze nie było jeszcze `vendor/eminos/statamic-iconify`
- na serwerze nie było jeszcze `config/statamic-iconify.php`
- na serwerze nie było jeszcze `public/vendor/statamic-iconify`
- stare kontenery `icons` i `icons2` nadal istniały po stronie serwera

### Backup i cleanup remote

Przed usunięciem starych zdalnych kontenerów ikon wykonano backup:

```text
/home/klient.dhosting.pl/skalisty/skalisty_2026-icons-containers-before-delete-2026-06-17.tar.gz
```

Następnie usunięto z serwera:

```text
~/skalisty_2026/public/assets/icons/
~/skalisty_2026/public/assets/icons2/
~/skalisty_2026/content/assets/icons.yaml
~/skalisty_2026/content/assets/icons2.yaml
```

### Synchronizacja

Deployment wykonano przez `rsync` bez `--delete`, z wykluczeniem plików środowiskowych, cache, logów, sesji, `.git`, `node_modules`, `users/` i dokumentów roboczych agentów.

Wynik właściwego `rsync`:

```text
Number of files: 26,262
Number of created files: 123
Number of deleted files: 0
Number of regular files transferred: 1,575
Total file size: 463,870,148 bytes
Total transferred file size: 24,789,996 bytes
Total bytes sent: 922,265
Total bytes received: 197,066
speedup: 414.42
```

### Komendy po deployu

Na serwerze wykonano:

```bash
php84 artisan package:discover --ansi
php84 artisan optimize:clear
php84 artisan config:clear
php84 artisan cache:clear
php84 artisan view:clear
php84 artisan statamic:stache:refresh
php84 artisan test
```

Wynik:

- package discovery: OK, addon Iconify widoczny
- cache/config/view clear: OK
- `statamic:stache:refresh`: OK
- `php84 artisan test`: 2 passed

### Walidacja po deployu

- `vendor/eminos/statamic-iconify`: istnieje na serwerze
- `config/statamic-iconify.php`: istnieje na serwerze
- `public/vendor/statamic-iconify`: istnieje na serwerze
- `public/assets/icons`: usunięte
- `public/assets/icons2`: usunięte
- `content/assets/icons.yaml`: usunięte
- `content/assets/icons2.yaml`: usunięte
- `config('statamic-iconify.default_store_as')`: `svg_data`
- prefix `map`: aktywny
- prefix `mdi`: aktywny
- `https://dev.skalisty.pl/`: 200
- `https://dev.skalisty.pl/en/`: 301 do `https://dev.skalisty.pl/en`, po redirect 200
- `https://dev.skalisty.pl/cp/login`: 302
- HTML strony głównej zawiera nową sekcję i box `Konsulting i Planowanie`

### Uwagi

- Wdrożenie wykonał Codex bez bieżącego audytu Claude, na prośbę użytkownika.
- Claude powinien po powrocie zweryfikować dokumentację i status zgodnie z `AGENTS.md`.
- Jeżeli Home EN ma dostać nowy blok, nadal potrzebne jest osobne tłumaczenie/synchronizacja PL -> EN z `--include-stale` albo `--overwrite`.

---

## Konfiguracja po uploadzeniu (czynności na serwerze)

Wszystkie komendy wykonywane przez SSH z katalogu `~/skalisty_2026/`.

### 4.1. Utwórz brakujące katalogi storage

Katalogi `storage/framework/views/`, `storage/framework/sessions/` i `storage/framework/cache/data/` są wykluczone z rsync (zawierają pliki tymczasowe specyficzne dla środowiska). Trzeba je utworzyć ręcznie po każdym świeżym deployu.

```bash
mkdir -p storage/framework/views
mkdir -p storage/framework/sessions
mkdir -p storage/framework/cache/data
chmod -R 775 storage
```

**Dlaczego to konieczne:** Laravel przechowuje tam skompilowane widoki Blade/Antlers i dane sesji. Bez tych katalogów aplikacja zgłasza `InvalidArgumentException: Please provide a valid cache path.`

### 4.2. Utwórz plik .env

Skopiuj szablon i uzupełnij:

```bash
cp .env.production .env
```

Następnie wygeneruj `APP_KEY`:

```bash
php84 artisan key:generate --force
```

### 4.3. Uruchom migracje bazy danych

**Ważne:** baza MySQL jest pusta na serwerze — nie importować pliku `.sqlite` z lokalnego środowiska (inny format). Migracje Laravel tworzą tabele od zera:

```bash
php84 artisan migrate --force
```

Tabele tworzone przez migracje:
- `migrations` — rejestr migracji
- `users` — konta użytkowników Laravel
- `cache` + `cache_locks` — cache plikowy/DB
- `jobs` + `job_batches` + `failed_jobs` — kolejka zadań

Statamic przechowuje treści w plikach YAML (`content/`), nie w bazie danych — baza służy wyłącznie do sesji, cache i kolejki.

### 4.4. Opublikuj assety addonów

Addon `wysiwyg-html-fieldtype` wymaga opublikowania JS do `public/vendor/`:

```bash
php84 artisan vendor:publish --tag=wysiwyg-html-fieldtype --force
```

**Uwaga:** rsync z `--copy-links` kopiuje plik fizycznie, więc `vendor:publish` nie zmienia treści. Uruchamiamy go dla pewności — po nim obowiązkowo `statamic:stache:refresh` (stache po świeżym deployu może mieć niekompletny wpis dla fieldtype'a, co objawia się błędem „Component wysiwyg_html-fieldtype does not exist." w CP).

### 4.5. Wyczyść cache konfiguracji

```bash
php84 artisan config:clear
php84 artisan cache:clear
php84 artisan view:clear
php84 artisan statamic:stache:refresh
```

---

## Zmiany względem domyślnej konfiguracji projektu

### robots.txt — blokada indeksacji (dev/staging)

Plik `public/robots.txt` ustawiony na zakaz crawlowania całej witryny:

```
User-agent: *
Disallow: /
```

**Przed wdrożeniem na produkcję** zmienić na `Disallow:` (pusta wartość = brak blokady).

### public/.htaccess — X-Robots-Tag noindex

Dodany blok poza `<IfModule mod_rewrite.c>`:

```apache
# Block indexing on dev/staging
<IfModule mod_headers.c>
    Header set X-Robots-Tag "noindex, nofollow"
</IfModule>
```

**Przed wdrożeniem na produkcję** usunąć ten blok.

---

### .env (na serwerze — odchylenia od .env.production)

| Klucz | Wartość na serwerze | Uwaga |
|-------|---------------------|-------|
| `APP_ENV` | `local` | Zmienione z `production` — patrz sekcja "Znane problemy" |
| `APP_KEY` | `base64:...` | Generowane przez `key:generate` po deployu |
| `APP_URL` | `https://dev.skalisty.pl` | Z HTTPS |
| `STATAMIC_PRO_ENABLED` | `true` | Wymagane dla multisajtu |
| `MAGIC_TRANSLATOR_QUEUE_CONNECTION` | `sync` | `exec()` niedostępne w web PHP-FPM na dhosting — tłumaczenia wykonywane synchronicznie w request HTTP zamiast przez kolejkę |

### public/.htaccess — dodana reguła Force HTTPS

Przed istniejącymi regułami Laravel dodano:

```apache
# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

Reguła przekierowuje każde żądanie HTTP → HTTPS (301 Permanent Redirect).

---

## Znane problemy i ich rozwiązania

### Problem 1: `InvalidArgumentException: Please provide a valid cache path.`

**Przyczyna:** brakujące `storage/framework/views/` (wykluczone z rsync).

**Rozwiązanie:** patrz krok 4.1 powyżej — `mkdir -p`.

---

### Problem 2: `Statamic Pro is required to use multiple sites.`

**Przyczyna:** Statamic sprawdza licencję Pro dla multisajtu. Na środowiskach z `APP_ENV=production` i bez klucza licencyjnego blokuje działanie.

**Rozwiązanie dla dev/staging:** zmiana `APP_ENV=local` w `.env` — Statamic nie wymaga licencji dla środowisk lokalnych.

**Rozwiązanie dla produkcji:** zakup licencji Statamic Pro i ustawienie `STATAMIC_LICENSE_KEY=<klucz>` w `.env`. Przy posiadaniu licencji należy przywrócić `APP_ENV=production`.

**Dlaczego lokalnie działało bez błędu:** lokalne środowisko (`127.0.0.1:8001`) nigdy nie trafia do serwera licencyjnego Statamic — `APP_ENV=local` jest domyślne w `.env` lokalnym, który zawiera też `STATAMIC_PRO_ENABLED=true`.

---

### Problem 3: Import bazy SQLite do MySQL

**Symptom:** phpMyAdmin zwraca `#1064 - SQLite format 3` przy próbie importu pliku `database.sqlite`.

**Przyczyna:** SQLite i MySQL używają różnych formatów binarnych — plik `.sqlite` nie jest importowalny do MySQL.

**Rozwiązanie:** nie importować `.sqlite`. Zamiast tego uruchomić `php84 artisan migrate --force` — Laravel sam tworzy tabele w MySQL.

---

### Problem 4: `php8.4: nie znaleziono polecenia`

**Przyczyna:** binarka PHP 8.4 na dhosting ma nazwę `php84` (bez kropki).

**Rozwiązanie:** używać `php84 artisan ...` zamiast `php8.4 artisan ...`.

---

### Problem 5: CP > Settings > Sites — błąd 500

**Symptom:** wejście w CP > Settings > Sites zwraca HTTP 500. W logu Laravel:

```
Symfony\Component\Process\Exception\LogicException:
The Process class relies on proc_open, which is not available on your PHP installation.
```

lub po częściowej naprawie:

```
ErrorException: is_dir(): open_basedir restriction in effect.
File(/usr/share/locale) is not within the allowed path(s): ...
```

**Przyczyna (wielowarstwowa):**
1. `Statamic\Dictionaries\Locales::getItems()` uruchamia `locale -a` przez `Symfony\Component\Process` — wymaga `proc_open`, które jest wyłączone w web PHP-FPM na dhosting (dostępne tylko w CLI).
2. Fallback przez `scandir('/usr/share/locale')` był blokowany przez `open_basedir` — dhosting nie pozwala na dostęp do `/usr/share/locale` z kontekstu web. `is_dir()` rzuca E_WARNING, który Laravel konwertuje na `ErrorException`.

**Rozwiązanie (HOTFIX-18):** patch `patches/statamic-cms-locales-proc-open-fallback.patch` zarządzany przez `cweagans/composer-patches`:
1. Owija wywołanie `Process::run()` w `if (function_exists('proc_open'))`.
2. Fallback do `@is_dir($localeDir)` — `@` tłumi warning z `open_basedir`, co powoduje ciche zwrócenie `false` i przejście do `return []`.
3. Przy `return []` CP > Settings > Sites renderuje stronę bez listy locale systemowych (wystarczające dla naszego use-case).

**Ważne:** po każdym `composer install` patch jest aplikowany automatycznie. Nie modyfikować `vendor/statamic/cms/src/Dictionaries/Locales.php` ręcznie — zostanie nadpisany.

---

## Aktualizacja (deploy przyrostowy — preferowana metoda)

Zamiast pełnego re-uploadu, od 2026-06-06 używamy bezpośredniego rsync SSH — tylko zmienione pliki.

Uwaga 2026-06-17: w automatyzacji Codex używać skryptu z katalogu `Insync/.../Linux/bin`, a nie `/usr/bin/skalisty-ssh`.

```bash
SSHPASS=$(sed -n 's/.*sshpass -p \([^ ]*\).*/\1/p' '/home/pestycyd/Insync/biuro@skalisty.pl/OneDrive/Linux/bin/skalisty-ssh' | head -1) && sshpass -p "$SSHPASS" rsync -avz --copy-links \
  --exclude='node_modules/' \
  --exclude='.git' \
  --exclude='.env' \
  --exclude='ADMIN_ACCESS.txt' \
  --exclude='BRIEF_CODEX.md' \
  --exclude='CONCLUSIONS_CODEX.md' \
  --exclude='PROJECT_STATUS_CODEX.md' \
  --exclude='CODEX_SUGGESTIONS.md' \
  --exclude='CLAUDE_MEMORY.md' \
  --exclude='CHANGE-LOG.md' \
  --exclude='AGENTS.md' \
  --exclude='.phpunit.result.cache' \
  --exclude='bootstrap/cache/' \
  --exclude='storage/logs/*.log' \
  --exclude='storage/framework/cache/' \
  --exclude='storage/framework/sessions/' \
  --exclude='storage/framework/views/' \
  --exclude='storage/statamic/' \
  --exclude='database/database.sqlite' \
  --exclude='public/hot' \
  --exclude='users/' \
  -e "ssh -o StrictHostKeyChecking=no" \
  /home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/ \
  skalisty@skalisty.ssh.dhosting.pl:~/skalisty_2026/
```

Po rsyncu — na serwerze:

```bash
cd ~/skalisty_2026
php84 artisan config:clear && php84 artisan cache:clear && php84 artisan view:clear
php84 artisan statamic:stache:refresh
# jeśli zmieniały się migracje:
php84 artisan migrate --force
```

---

## Checklist pełnego deployu (fresh install)

Używać gdy serwer jest czysty lub po katastrofie. Paczka `www-5.tar.gz` zawiera stan projektu z 2026-06-06.

- [ ] Upload `www-5.tar.gz` na serwer: `scp www-5.tar.gz skalisty@skalisty.ssh.dhosting.pl:~/`
- [ ] Na serwerze: `tar -xzf www-5.tar.gz && mv www-5 skalisty_2026`
- [ ] Sprawdź czy katalogi `storage/framework/{views,sessions,cache/data}` istnieją — jeśli nie, utwórz (`mkdir -p` + `chmod -R 775 storage`)
- [ ] Skopiuj `.env`: `cp .env.production .env` i uzupełnij / wygeneruj `APP_KEY`
- [ ] Uruchom `php84 artisan migrate --force`
- [ ] Uruchom `php84 artisan config:clear && php84 artisan cache:clear && php84 artisan view:clear && php84 artisan statamic:stache:refresh`

---

## Operacje diagnostyczne na serwerze

```bash
# Połączenie SSH
/bin/bash '/home/pestycyd/Insync/biuro@skalisty.pl/OneDrive/Linux/bin/skalisty-ssh'

# Logi błędów Laravel
tail -100 ~/skalisty_2026/storage/logs/laravel.log

# Stan migracji
cd ~/skalisty_2026 && php84 artisan migrate:status

# Wyczyść wszystkie cache
php84 artisan config:clear && php84 artisan cache:clear && php84 artisan view:clear

# Odśwież stache Statamic (po zmianie blueprintów/contentu)
php84 artisan statamic:stache:refresh

# Test połączenia z MySQL
php84 artisan db:monitor
```

---

## Zmiany po wdrożeniu (hotfixy i aktualizacje)

### 2026-06-07 — Project-toggles + Woliera Argusa + content-pull

**Operacja przed deployem (SSH):**
- Usunięto `~/skalisty_2026/content/collections/projects/pl/aerotech-engineering-campus.md` — duplikat ID z `woliera-argusa.md`; rsync bez `--delete` nie usuwa plików przy zmianie sluga — wymagane ręczne usunięcie przez SSH

**Pull (serwer → lokalnie):**
- `content/collections/galleries/pl/galeria-strona-glowna.md` + 11 wersji językowych — nowa galeria z 9 zdjęciami webp
- `content/collections/projects/pl/woliera-argusa.md` — nowy projekt (dostosowany z democontentu)
- `content/collections/pages/{pl,en,cs,da}/home.md` — nowy blok `skalisty_gallery_section`
- `public/assets/galeria/` (17 webp), `public/assets/projekty/woliera-argusa/` (1 webp)

**Push (lokalnie → serwer):**
- `content/collections/projects/pl/woliera-argusa.md` — zaktualizowany (usunięte demo milestones, dodane toggle fields)
- `content/collections/projects/en/aerotech-engineering-campus.md`
- `resources/blueprints/collections/projects/project.yaml` — 3 nowe pola toggle z `if` conditions
- `resources/views/project/show.antlers.html` — 3 sekcje z `{{ if show_* }}`
- Rsync: ~1 MB wysłanych (z 463 MB), speedup 458×

**Post-deploy na serwerze:** `config:clear`, `cache:clear`, `view:clear`, `stache:refresh` — OK

**Status:** `dev.skalisty.pl/project/woliera-argusa` ✅

---

### 2026-06-08 — BUGFIX-cp-site-switcher + BUGFIX-cp-collection-listing + content sync

**Push (lokalnie → serwer):**
- `app/Http/Controllers/CP/SelectSiteController.php` — nowy kontroler; IoC binding przełącznika języków; `Entry::find()->in($site)->editUrl()` redirect na prawidłową lokalizację wpisu; fallback `back()` dla pozostałych widoków CP
- `app/Http/Controllers/CP/Collections/EntriesController.php` — nowy kontroler; override `indexQuery()` z `where('site', Site::selected()->handle())` + `->whereNotNull('data->title')` (filtr stubów propagate:true)
- `app/Providers/AppServiceProvider.php` — IoC binding obu kontrolerów w `register()`
- `content/collections/` — pełna synchronizacja wpisów (blogs × 15 × wiele locale, faqs, projects, pages, services, galleries)
- `vendor/statamic/cms/src/Dictionaries/Locales.php` — patch HOTFIX-18 (proc_open fallback); rsync zawsze synchronizuje plik patcha
- `addons/skalisty/wysiwyg-html-fieldtype/` — pełna synchronizacja addonu
- Pozostałe: `composer.json`, `composer.lock`, `patches.lock.json`, `package-lock.json`, `patches/`
- Rsync: 1.159 MB wysłanych (z 463 MB), speedup 297×

**Post-deploy na serwerze:** `config:clear`, `cache:clear`, `view:clear`, `stache:refresh` — OK

**Status:** `dev.skalisty.pl` ✅ — CP listing ES filtruje poprawnie (ES=8, bez stubów); przełącznik języków w CP przekierowuje na właściwy locale edytowanego wpisu

---

### 2026-06-07 — Lightbox-close-fix (przycisk X + click-outside)

**Push (lokalnie → serwer):**
- `public/assets/js/custom.js` — nowy click-outside handler w `setupLightbox()` (klik na overlay zamyka lightbox)
- `resources/views/page_builder/skalisty_gallery_section.antlers.html` — przycisk X obok fullscreen
- Kilka plików `content/collections/` (zmiany content)
- Rsync: ~1 MB wysłanych (z 458 MB), speedup 452×

**Post-deploy na serwerze:** `config:clear`, `cache:clear`, `view:clear`, `stache:refresh` — OK

**Status:** lightbox X button ✅, click-outside ✅

---

### 2026-06-06 — Synchronizacja + aktualizacja Statamic 6.20.2

**Pull (serwer → lokalnie):**
- `content/seo-pro/redirects/pl/ppp.yaml` — nowy redirect SEO Pro dodany przez CP
- kilka plików `.meta/` dla grafik wgranych przez CP

**Push (lokalnie → serwer):**
- `composer.lock`, `patches.lock.json` — aktualizacja statamic/cms v6.20.0→v6.20.2 + guzzlehttp/*
- `public/vendor/statamic/cp-dev/build/` — nowe assety CP Statamic 6.20.2
- `vendor/statamic/cms/` — zaktualizowane pliki core (w tym patched `Locales.php`)
- `vendor/guzzlehttp/` — zaktualizowane paczki HTTP
- Rsync: 6,3 MB wysłanych (z 457 MB), speedup 67×

**Post-deploy na serwerze:** `config:clear`, `cache:clear`, `view:clear`, `stache:refresh` — OK

**Status:** PL 200 ✅ EN 200 (przez redirect) ✅

---

### 2026-06-06 — Deploy przyrostowy rsync (www-5)

Bezpośredni rsync SSH z lokalnego projektu na serwer. Wysłane pliki:
- `public/assets/css/tailwind.css` + `output.css` — Tailwind v4 syntax fix
- `public/assets/js/custom.js` — YouTube iframe fix (`toEmbedUrl()`)
- `public/assets/images/identyfikacja-strony/logo-skalisty-2.png` + white + .meta
- `resources/views/page_builder/skalisty_gallery_section.antlers.html` — nowy blok galerii
- `resources/fieldsets/skalisty_gallery_section.yaml` + `all_page_builder.yaml`
- `resources/blueprints/collections/galleries/gallery.yaml` — usunięto `max_files: 1`
- `resources/views/page_builder/our_story_section.antlers.html` — YouTube iframe
- `resources/views/partials/header-1.antlers.html` — logo fix (xl/1xl max-w)
- `vendor/statamic/cms/src/Dictionaries/Locales.php` — HOTFIX-18
- `patches/statamic-cms-locales-proc-open-fallback.patch` — plik patcha
- `content/globals/pl/setting.yaml` — logo PNG

Po rsyncu: `config:clear`, `cache:clear`, `view:clear`, `stache:refresh` — OK. Strona 200.

---

### 2026-06-05 — HOTFIX-18: CP > Settings > Sites błąd 500 (`proc_open` + `open_basedir`)

Patch `patches/statamic-cms-locales-proc-open-fallback.patch` dodany do `composer.json extra.patches` i wdrożony na serwer przez bezpośredni upload pliku (SSH + scp).

Szczegóły: patrz Problem 5 w sekcji "Znane problemy" powyżej.

---

### 2026-06-01 — `container: assets` w fieldsetach

Po dodaniu kontenerów `icons` i `icons2` Statamic wymaga jawnego `container:` w każdym polu `type: assets`. Bez tego rzuca `UndefinedContainerException` na stronach używających tych fieldsetów.

Poprawione pliki (scp + stache:refresh):
- `resources/fieldsets/about_image_with_text_section.yaml` — pola `image`, `customer_images`
- `resources/fieldsets/confidence_section.yaml` — pole `image`
- `resources/fieldsets/project_quotation_banner.yaml` — pole `background_image`
- `resources/fieldsets/text_slider_section.yaml` — pole `logo`

---

## Historia paczek deploymentowych

| Plik | Data | Opis |
|------|------|------|
| `www-2.tar.gz` | 2026-06-02 | ~~usunięta~~ |
| `www-3.tar.gz` | 2026-06-02 | ~~usunięta~~ |
| `www-4.tar.gz` | 2026-06-02 | ~~usunięta~~ |
| `www-5.tar.gz` | 2026-06-06 | **aktualna** — Tailwind v4 fix, logo PNG, YouTube iframe, Gallery Section, HOTFIX-18 |

---

## 2026-06-06 — Deploy przyrostowy (globals i18n + lang files + {{ trans }} fix)

Bezpośredni rsync SSH. Wysłane pliki (1 MB, speedup 443×):

- `app/Console/Commands/TranslateGlobalSet.php` — nowa komenda Artisan
- `app/Console/Commands/TranslateLangFiles.php` — nowa komenda Artisan
- `content/globals/{cs,da,de,es,fr,it,lv,nl,no,sv}/touch_with_us.yaml` — 10 nowych lokalizacji globalu
- `content/globals/pl/touch_with_us.yaml` — zaktualizowany
- `lang/{en,pl,cs,da,de,es,fr,it,lv,nl,no,sv}.json` — 35 kluczy UI; en.json był prawie pusty
- `resources/views/partials/let-connect-section.antlers.html` — `{{ display }}` → `{{ trans :key="display" }}`
- `resources/views/{career,quotation,blog-detail-one/two/three/four}.antlers.html` — j.w.

Post-deploy: `config:clear`, `cache:clear`, `view:clear`, `stache:refresh` — OK

**Status:** PL 200 ✅ EN 301→200 ✅

---

## 2026-06-07 — Deploy przyrostowy (CSS fix Bard paragraphs)

**Push (lokalnie → serwer):**
- `resources/views/project/show.antlers.html` — owinięcie outputu pola Bard `overview` w `<div class="[&>p]:mb-4 [&>p:last-child]:mb-0">` — odstępy między akapitami w sekcji Overview projektu
- `public/assets/css/output.css` — przebudowany Tailwind CSS z nowymi klasami
- Rsync: ~1 MB wysłanych (z 467 MB), speedup 456×

**Post-deploy na serwerze:** `cache:clear`, `view:clear`, `stache:refresh` — OK

**Status:** `dev.skalisty.pl/project/*` — akapity w Overview ✅

---

## 2026-06-07 — Content pull (serwer → lokalnie)

**Pull (serwer → lokalnie):**
- `content/collections/projects/` — nowe projekty: `afrykarium`, `oceanika`, `tarnowskie-termy` w locale PL/EN/CS/DA/DE/ES/FR/IT/LV/NL/NO/SV + aktualizacje wpisów EN
- `content/collections/pages/pl/realizacje.md` — nowa strona realizacji; `home.md` (PL/EN/CS/DA/ES)
- `trees/navigation/pl/main.yaml` — edytowane menu główne
- `public/assets/galeria/afrykarium/` (6 webp + .meta), `galeria/oceanika/` (6 webp + .meta), `galeria/termy-tarnowskie/` (2 webp + .meta)
- `public/assets/projekty/afrykarium-zoo0wroclaw.webp` + .meta
- `public/assets/icons/.meta/`, `icons2/.meta/` — meta ikon
- Wykluczone: `public/assets/css/` — lokal ma nowszy build (CSS fix Bard paragraphs, niezdeployowany)
- Post-pull lokalnie: `cache:clear`, `view:clear`, `stache:refresh` — OK

---

## Deploy przyrostowy — 2026-06-18 — Sticky header + Logos Slider with Icons + aktualizacja pakietów

### Zakres wdrożenia

Wdrożono na `dev.skalisty.pl` wyniki prac z sesji 2026-06-18:

**BUGFIX-sticky-header-default:**
- `resources/views/layout.antlers.html` — `<body data-header-type="{{ theme_settings:header_type }}">` — wartość z Statamic globals dostępna dla JS niezależnie od `show_theme_switcher`
- `public/assets/js/custom.js` — przepisany blok "Select the header": `switcherVisible`, `serverHeaderType`, `localStorage.removeItem("headerType")` gdy switcher ukryty, `stickyMode` czyta z serwera gdy brak localStorage

**FEATURE-logos-slider-with-icons:**
- `resources/fieldsets/logos_slider_with_icons.yaml` — nowy fieldset Page Buildera (slider logotypów z ikonami Iconify)
- `resources/views/page_builder/logos_slider_with_icons.antlers.html` — widok sekcji slidera
- `resources/fieldsets/all_page_builder.yaml` — rejestracja nowego setu

**Assets — logo-klienci:**
- `public/assets/logo-klienci/` — nowy kontener z logotypami klientów (9 webp + 1 svg + pliki .meta/)

**Aktualizacja pakietów:**
- `vendor/statamic/cms/` — v6.20.2 → v6.20.3
- `addons/skalisty/wysiwyg-html-fieldtype/` — v0.1.0 → v1.1.0
- `vendor/composer/` — installed.json + autoload maps (zsynchronizowane osobno po aktualizacji vendorów)
- `composer.json`, `composer.lock` — zaktualizowane locki

**Pozostałe pliki kodu:**
- `app/Providers/AppServiceProvider.php`
- `bootstrap/app.php`
- `content/` — pełna synchronizacja treści (blogs, globals, pages)

### Synchronizacja

Deployment wykonano przez serię rsync (przyrostowy, bez `--delete`). Rsync główny + osobne rsynce dla `vendor/statamic/cms/`, `addons/skalisty/wysiwyg-html-fieldtype/`, `vendor/composer/`.

Uwaga: przy rsync `addons/skalisty/wysiwyg-html-fieldtype/` przypadkowo wgrano `node_modules/` z dev-zależnościami (ok. 100 KB). Nie jest to błąd krytyczny — pliki są funkcjonalnie martwe na serwerze. Przyszłe deploye: dodać `--exclude='node_modules/'` dla katalogu addonu.

### Komendy po deployu

Na serwerze:

```bash
cd ~/skalisty_2026
php84 artisan package:discover --ansi
php84 artisan config:clear && php84 artisan cache:clear && php84 artisan view:clear
php84 artisan statamic:stache:refresh
```

### Walidacja po deployu

- `vendor/statamic/cms`: v6.20.3 ✅ (potwierdzone przez installed.json)
- `addons/skalisty/wysiwyg-html-fieldtype`: v1.1.0 ✅
- `public/assets/logo-klienci/`: istnieje ✅
- `resources/views/layout.antlers.html`: zawiera `data-header-type` ✅
- `custom.js`: zawiera `switcherVisible`, `serverHeaderType` ✅
- `dev.skalisty.pl`: HTTP 200 ✅

---

## Deploy przyrostowy — 2026-06-18 (sesja 3) — Seamless slider loop + home PL + logo-klienci

### Zakres wdrożenia

**BUGFIX-slider-seamless-loop:**
- `resources/views/page_builder/trusted_partners_section.antlers.html` — duplikacja `{{ logos }}` w slider-track (fix skoku animacji)
- `resources/views/page_builder/logos_slider_with_icons.antlers.html` — j.w.
- `resources/views/page_builder/text_slider_section.antlers.html` — j.w.

**Content:**
- `content/collections/pages/pl/home.md` — edycje treści użytkownika

**Assets (uzupełnienie):**
- `public/assets/logo-klienci/logo-tallinn-zoo.webp` + `.meta/` — brakowało na serwerze
- `public/assets/logo-klienci/logo-zoo-chorzow.webp` + `.meta/` — brakowało na serwerze

### Komendy po deployu

```bash
php84 artisan view:clear && php84 artisan cache:clear && php84 artisan statamic:stache:refresh
```

Wynik: OK. `dev.skalisty.pl` HTTP 200 ✅

---

## Deploy przyrostowy — 2026-06-19 — blueprint details default Info Items

### Zakres wdrożenia

**FEATURE-blueprint-details-defaults:**
- `resources/blueprints/collections/projects/project.yaml` — klucz `default:` na polu `details` (replicator) z 4 pre-wypełnionymi Info Items: Lokalizacja, Powierzchnia Dekoracji (`0,00 m²`), Inwestor, Data Zakończenia

### Metoda

Celowany rsync jednego pliku (bez pełnego deployu):

```bash
sshpass -p '...' rsync -av \
  -e "ssh -o StrictHostKeyChecking=no" \
  resources/blueprints/collections/projects/project.yaml \
  skalisty@skalisty.ssh.dhosting.pl:skalisty_2026/resources/blueprints/collections/projects/project.yaml
```

Post-deploy: `php84 artisan statamic:stache:refresh` — OK ✅

---

## Deploy przyrostowy — 2026-06-18 — BACK NOW i18n (lightbox)

### Zakres wdrożenia

**FEATURE-back-now-i18n:**
- `lang/en.json`, `lang/pl.json` — nowy klucz `"Back Now"`
- `lang/{cs,da,de,es,fr,it,lv,nl,no,sv}.json` — przetłumaczone przez DeepL (`lang:translate --force`)
- `resources/views/partials/gallery-lightbox.antlers.html` — `BACK NOW` → `{{ trans key="Back Now" }}`
- `resources/views/page_builder/gallery_section.antlers.html` — j.w. (2 wystąpienia)
- `resources/views/page_builder/skalisty_gallery_section.antlers.html` — j.w.

### Metoda

Pełny rsync przyrostowy (16 plików, speedup 569×). Post-deploy: `config:clear`, `cache:clear`, `view:clear` — OK ✅

---

## Deploy przyrostowy — 2026-06-18 — BUGFIX-logo-proportions + CSS rebuild

### Zakres wdrożenia

**BUGFIX-logo-proportions:**
- `resources/views/partials/header-1.antlers.html` — `<img>`: `h-* max-w-full w-auto` → `max-h-* h-auto w-auto max-w-full`
- `resources/views/partials/header-4.antlers.html` — j.w.
- `public/assets/css/output.css` — rebuild Tailwind (`npm run build`): dodanie `max-h-9/13/14` do skompilowanego CSS

**Sync assets (serwer → lokalnie):**
- `public/assets/galeria/djurs-sommerland/` — 4 webp + meta
- `public/assets/galeria/osada-jaworzyny/` — 4 webp + meta
- `public/assets/logo-klienci/image(1).webp` + meta

### Metoda

Rsync przyrostowy (2 szablony + CSS), post-deploy: `view:clear` — OK ✅

---

## Status na dzień 2026-06-18

| Element | Status |
|---------|--------|
| Serwer | ✅ `dev.skalisty.pl` — HTTP 200 (PL + EN) |
| Ostatni deploy | ✅ rsync przyrostowy, 2026-06-18 (logo-proportions + CSS rebuild) |
| Statamic CMS | ✅ v6.21.0 |
| wysiwyg-html-fieldtype | ✅ v1.1.0 |
| Logo proportions fix | ✅ `max-h-* h-auto w-auto max-w-full` w header-1 i header-4 |
| BACK NOW i18n (lightbox) | ✅ `{{ trans key="Back Now" }}` — 12 języków |
| Blog image_section fix | ✅ `{{ images }}` + lightbox + `gallery-lightbox` partial |
| Blueprint projects — details defaults | ✅ 4 Info Items pre-wypełnione |
| Logos Slider with Icons | ✅ nowy set Page Buildera |
| logo-klienci assets | ✅ nowy kontener z logotypami |
| Sticky header default | ✅ `data-header-type` na `<body>` + JS switcherVisible |
| CSS | ✅ `output.css` — Tailwind v4 + max-h-* |
| Logo | ✅ PNG (`logo-skalisty-2.png`, `logo-skalisty-white-2.png`) |
| YouTube video | ✅ `<iframe>` + `toEmbedUrl()` w custom.js |
| Gallery Section | ✅ nowy blok page buildera |
| Icon Box With Text | ✅ nowy blok page buildera (2026-06-17) |
| HOTFIX-18 | ✅ `vendor/Locales.php` patch (`proc_open` + `open_basedir`) |
| Migracje MySQL | ✅ aktualne |
| `storage/framework/*` | ✅ katalogi z uprawnieniami 775 |
| Statamic Pro (multisite) | ✅ `STATAMIC_PRO_ENABLED=true` |
| Force HTTPS (.htaccess) | ✅ 301 HTTP → HTTPS |
| Blokada indeksacji | ✅ `robots.txt` + `X-Robots-Tag noindex` |

---

## Deploy przyrostowy — 2026-06-20 — FAQ replicator + service icon color + content sync

### Zakres wdrożenia

**FEATURE-faqs-grouped-replicator + BUGFIX-service-icon-color (wspólny deploy):**
- `resources/blueprints/collections/faqs/faq.yaml` (1.7 KB) — Replicator `faq_items` zamiast pola `answer`
- `resources/views/page_builder/faq_section.antlers.html` (7.0 KB) — pętla `faq_items`, dynamiczny `x-ref`
- `resources/views/page_builder/service_section.antlers.html` (21 KB) — `text-black` na 5 spanach ikon
- `resources/views/service/show.antlers.html` (16 KB) — `faq_items` w Bard set + padding wrapper v1 (`2xl:py-[35px]...`)
- `content/collections/pages/pl/home.md` (38 KB) — nowe id paczek FAQ w sekcjach
- `content/collections/faqs/` (cała kolekcja, 12 nowych `jak-pracujemy-qa.md` + zaktualizowany `biotopy-...md` w 12 językach)

### Backup serwera

`~/skalisty_2026_backups/before-faq-replicator-2026-06-20/` (836 KB) — content/collections/faqs, home.md, blueprint faq.yaml, 3 szablony.

### Metoda

Rsync per plik + osobny rsync całej kolekcji `content/collections/faqs/` (bez `--delete`):

```bash
sshpass -p '...' rsync -avz -e "ssh -o StrictHostKeyChecking=no" \
  resources/blueprints/collections/faqs/faq.yaml \
  skalisty@skalisty.ssh.dhosting.pl:skalisty_2026/resources/blueprints/collections/faqs/faq.yaml
# (analogicznie dla 4 pozostałych plików + content/collections/faqs/ jako katalog)
```

### Pominięto celowo

- `content/collections/services/pl/architectural-design.md` — test content z poprzedniej sesji Codexa.

### Komendy po deployu

```bash
php84 artisan view:clear && php84 artisan cache:clear && php84 artisan statamic:stache:refresh && php84 artisan test
```

Wynik: OK, 2 passed. `dev.skalisty.pl` HTTP 200 PL+EN, 13 pozycji `faqs-list` na home PL, pierwsze pytanie z paczki widoczne ✅

---

## Deploy przyrostowy — 2026-06-20 — STYLE-bard-nested-sections-padding-half-v2 + CSS rebuild

### Zakres wdrożenia

**STYLE-bard-nested-sections-padding-half-v2 (finalna wersja po dwóch iteracjach -50%):**
- `resources/views/service/show.antlers.html` (16 KB) — 9 wystąpień wrappera Bard z klasą `container 2xl:py-[18px] 1xl:py-4 lg:py-3.5 sm:py-2.5 py-2`
- `public/assets/css/output.css` (286 KB) — rebuild Tailwind 4 (`npm run build`) z nowymi klasami `py-[18px]`, `py-4`, `py-3.5`, `py-2.5`, `py-2`

### Backup serwera

`~/skalisty_2026_backups/before-bard-padding-v2-2026-06-20/` (300 KB) — show.antlers.html + output.css.

### Metoda

Rsync per plik (2 pliki):

```bash
sshpass -p '...' rsync -avz -e "ssh -o StrictHostKeyChecking=no" \
  resources/views/service/show.antlers.html \
  skalisty@skalisty.ssh.dhosting.pl:skalisty_2026/resources/views/service/show.antlers.html
# + analogicznie dla output.css
```

### Komendy po deployu

```bash
php84 artisan view:clear && php84 artisan cache:clear && php84 artisan test
```

Wynik: OK, 2 passed. `dev.skalisty.pl` HTTP 200 PL+EN. Klasa `py-[18px]` wykryta w live `output.css` ✅

### Uwagi operacyjne

- **Port lokalnego dev**: `127.0.0.1:8001` (nie `8000`) — odnotowane jako stała w `CLAUDE_MEMORY.md`.
- **Komenda PHP lokalnie**: `php artisan` (na serwerze dhosting: `php84`).

---

## Deploy przyrostowy — 2026-06-20 — FEATURE-services-route-pl-oferta

### Zakres wdrożenia

**FEATURE-services-route-pl-oferta (trasa PL `/oferta/{slug}` + CP Trasy URL kolekcji):**
- `content/collections/services.yaml` (507 B) — `route` (string) → mapa 12 locale: PL `/oferta/{slug}`, reszta `/service/{slug}`
- `app/Http/Controllers/CP/CollectionRoutesController.php` (2.9 KB) — `'services' => 'Usługi (Services)'` w `$managedCollections`
- `resources/views/page_builder/service_section.antlers.html` (21 KB) — 13 hardcoded `href="/service/{{slug}}"` → `href="{{ url }}"`
- `resources/views/partials/header-{1,2,3,4}.antlers.html` (4 pliki, ~ 135 KB łącznie) — po 1 zamianie linku
- `resources/views/partials/footer-1.antlers.html` (2 zamiany), `footer-4.antlers.html` (1), `search-results.antlers.html` (1)
- `content/trees/navigation/pl/main.yaml` (6.6 KB) — `/service/architectural-design` → `/oferta/architectural-design`

### Stan serwera przed deployem

- `content/collections/pages/pl/services.md` — **już nie istniał** (użytkownik wcześniej zrobił rename w CP na `oferta.md`).
- `content/collections/services.yaml` — stary `route: '/service/{slug}'` (string).
- `app/Http/Controllers/CP/CollectionRoutesController.php` — bez `services` w `$managedCollections` (tylko `projects`).

### Backup serwera

`~/skalisty_2026_backups/before-services-route-oferta-2026-06-20/` (248 KB) — services.yaml, CollectionRoutesController.php, service_section.antlers.html, cały katalog partials/, nav-pl-main.yaml.

### Metoda

Rsync per plik (5 rsyncs):

```bash
SSHPASS=$(sed -n 's/.*sshpass -p \([^ ]*\).*/\1/p' '/home/pestycyd/Insync/.../skalisty-ssh' | head -1)
sshpass -p "$SSHPASS" rsync -avz -e "ssh -o StrictHostKeyChecking=no" \
  content/collections/services.yaml \
  skalisty@skalisty.ssh.dhosting.pl:skalisty_2026/content/collections/services.yaml
# + analogicznie dla CollectionRoutesController, service_section, nav PL i 7 partials (w jednym rsync do katalogu partials/)
```

### Komendy po deployu

```bash
php84 artisan view:clear && php84 artisan cache:clear && php84 artisan statamic:stache:refresh && php84 artisan test
```

Wynik: OK, 2 passed.

### Walidacja runtime

| URL | Wynik | Status |
|-----|-------|--------|
| `https://dev.skalisty.pl/oferta` | 200 ✅ | strona kolekcji PL |
| `https://dev.skalisty.pl/oferta/architectural-design` | 200 ✅ | pojedyncza usługa PL |
| `https://dev.skalisty.pl/service/architectural-design` (stara PL) | 404 ✅ | trasa wyłączona |
| `https://dev.skalisty.pl/en/services` | 200 ✅ | strona kolekcji EN |
| `https://dev.skalisty.pl/en/service/architectural-design` | 200 ✅ | pojedyncza usługa EN |
| `https://dev.skalisty.pl/cp/collection-routes` | 302 → login ✅ | panel CP (po zalogowaniu: 2 pozycje — Projekty + Usługi) |


---

## Deploy przyrostowy — 2026-06-20 — FEATURE-embedded-video-cover-image + STYLE-mega-menu-ivena-tiles

### Zakres wdrożenia

**FEATURE-embedded-video-cover-image (opcjonalna okładka lokalnych assetów):**
- `resources/fieldsets/embedded_video_section.yaml` — pole `cover_image`
- `resources/blueprints/collections/services/service.yaml` — `cover_image` w secie `video_section` Bard
- `resources/views/page_builder/embedded_video_section.antlers.html` — logika JS z `coverImage`
- `resources/views/service/show.antlers.html` — Bard `video_section` + JS `embeddedVideo` z 3. argumentem

**STYLE-mega-menu-ivena-tiles (kafle usług w mega menu, layout 1:1 ivena):**
- `resources/views/partials/header-{1,2,3,4}.antlers.html` — nowa struktura kafli (block `<a>` + flex `<div>` wewnątrz, hover tło, ikona 40×40, `group/tile`)
- `public/assets/css/extra.css` — override `.navbar li.w-full > a.group\/tile { display: block !important; padding: 0 !important; }`
- `public/assets/css/output.css` — przebudowany `npm run build`

**CONTENT-sztuczna-rafa-koralowa:**
- `content/collections/services/pl/sztuczna-rafa-koralowa.md` — nowy wpis PL

### Backup serwera

Backup przed deployem wykonany przez użytkownika przed wdrożeniem.

### Metoda

Rsync per plik / grupy plików (sshpass + rsync -avz). Komendy po deployu: `php84 artisan view:clear && php84 artisan cache:clear && php84 artisan statamic:stache:refresh && php84 artisan test`.

### Wynik

Deploy zakończony poprawnie. HTTP 200 na `dev.skalisty.pl`. Kafle w mega menu wyświetlają efekt hover. Cover image dla sekcji video aktywna.
