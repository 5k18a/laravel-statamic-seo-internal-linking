# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-19-1300
active_task_id: none
active_task_name: Brak aktywnego zadania
active_task_status: idle
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-19 13:00 Europe/Warsaw
last_synced_by: Claude
last_closed: UPDATE-statamic-6.20.3-deploy
next_after_active: Decyzja użytkownika — retłumaczenie Home EN lub Formularze kontaktowe
<!-- PROJECT_SYNC_END -->

---

# AKTYWNY BRIEF: UPDATE-statamic-6.20.3-deploy

## Cel

Potwierdzenie że `dev.skalisty.pl` jest na `statamic/cms` v6.20.3, commit dokumentacji i aktualizacja opisu stacku.

**Kontekst:** v6.20.3 trafiło do `composer.lock` w commicie `d857942` (2026-06-18). Deploy `SYNC-and-deploy-completion-year` z 2026-06-19 wysłał ten vendor na serwer przez rsync. Serwer prawdopodobnie już ma v6.20.3 — zadanie jest głównie weryfikacyjne.

---

## Dane dostępowe

- SSH user: `skalisty@skalisty.ssh.dhosting.pl`
- Hasło SSH: z pliku `server_deploy/SERWER_DOSTEP.txt`
- Katalog na serwerze: `~/skalisty_2026/`
- PHP na serwerze (SSH): `php84`

---

## Krok 1 — Weryfikacja wersji na serwerze

```bash
sshpass -p 'HASŁO' ssh -o StrictHostKeyChecking=no \
  skalisty@skalisty.ssh.dhosting.pl \
  "cd skalisty_2026 && php84 artisan about 2>/dev/null | grep -i statamic"
```

Oczekiwany wynik: `statamic/cms ... 6.20.3`

Alternatywnie:
```bash
sshpass -p 'HASŁO' ssh -o StrictHostKeyChecking=no \
  skalisty@skalisty.ssh.dhosting.pl \
  "grep '\"version\": \"v6.20' skalisty_2026/composer.lock | head -1"
```

---

## Krok 2 — Jeśli serwer ma v6.20.3 (oczekiwany scenariusz)

Rsync nie jest potrzebny. Zadanie zamknięte po weryfikacji i aktualizacji CLAUDE_MEMORY.md.

---

## Krok 3 — Jeśli serwer ma jeszcze v6.20.2 (fallback)

Wykonaj rsync:

```bash
sshpass -p 'HASŁO' rsync -av \
  --exclude='.git' --exclude='.env' --exclude='node_modules/' \
  --exclude='storage/framework/cache/' --exclude='storage/framework/sessions/' \
  --exclude='storage/framework/views/' --exclude='storage/logs/' \
  --exclude='database/database.sqlite' --exclude='public/hot' --exclude='ADMIN_ACCESS.txt' \
  -e "ssh -o StrictHostKeyChecking=no" \
  /home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/ \
  skalisty@skalisty.ssh.dhosting.pl:skalisty_2026/
```

Post-deploy:
```bash
sshpass -p 'HASŁO' ssh -o StrictHostKeyChecking=no skalisty@skalisty.ssh.dhosting.pl \
  "cd skalisty_2026 && php84 artisan config:clear && php84 artisan cache:clear && php84 artisan view:clear && php84 artisan statamic:stache:refresh && php84 artisan test"
```

**NIE uruchamiać `composer update` ani `composer patches-repatch` na serwerze** — vendor jest rsync'owany lokalnie z już zastosowanym patchem HOTFIX-18.

---

## Krok 4 — Aktualizacja opisu stacku w CLAUDE_MEMORY.md

W pliku `CLAUDE_MEMORY.md` w sekcji „Aktualny stan projektu" zaktualizuj linię:

```
- Stack: Laravel 13.12.0 + Statamic 6.20.2 + PHP 8.3
```

na:

```
- Stack: Laravel 13.16.1 + Statamic 6.20.3 + PHP 8.4
```

---

## Commit po zakończeniu

```
docs: aktualizacja stacku + weryfikacja statamic/cms v6.20.3 na serwerze
```

---

## Ostatnio zamknięte

- `SYNC-and-deploy-completion-year` ✅ zamknięty przez Claude (2026-06-19)
- `FEATURE-completion-year-sort` ✅ accepted (2026-06-19)
- `BUGFIX-sticky-header-default` ✅ accepted (2026-06-18)
- `BUGFIX-slider-seamless-loop` ✅ accepted (2026-06-18)
- `FEATURE-logos-slider-with-icons` ✅ accepted (2026-06-18)

## Następne po aktywnym

- Decyzja użytkownika: retłumaczenie Home EN lub Formularze kontaktowe
