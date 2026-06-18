# AGENTS.md

## Cel pliku

Ten plik opisuje zasady pracy agentów AI w projekcie budowy nowej wersji strony skalisty.pl.

W projekcie działają dwa główne agenty:

- Claude - audytor techniczny, architekt decyzji i autor briefów dla Codex
- Codex - programista wykonujący zadania techniczne zgodnie z briefami Claude

Celem tego workflow jest prowadzenie projektu w sposób kontrolowany, audytowalny, spójny i zgodny z dobrymi praktykami Laravel, Statamic oraz strukturą motywu Orion.

Najważniejsze zasady:

- Claude odpowiada za audyt, decyzje, kierunek techniczny, briefy i dokumentację roboczą.
- Codex odpowiada za implementację zgodnie z briefem, testowanie i feedback techniczny.
- `BRIEF_CODEX.md` jest źródłem prawdy dla aktywnego zadania wykonawczego Codex.
- Aktywacja nowego briefu wymaga jednoczesnej synchronizacji `BRIEF_CODEX.md`, `PROJECT_STATUS_CODEX.md` i `CLAUDE_MEMORY.md`.
- Przed budową nowej większej funkcjonalności należy sprawdzić rozwiązania natywne i gotowe.
- Nie wolno wracać do porzuconego kierunku sprzed hard resetu bez wyraźnej decyzji użytkownika.
- **`CHANGE-LOG.md` jest obowiązkowy i musi być prowadzony bezwzględnie** — Claude aktualizuje go po każdym zakończonym zadaniu lub istotnej zmianie, bez wyjątków.

---

# 1. Kontekst projektu

Aktywny projekt to:

- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion`

**Katalog roboczy agentów (źródło prawdy) — repozytorium Git:**

- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/`

Workspace parent (`/home/pestycyd/Dokumenty/Skalisty-New-2/`) to **katalog nadrzędny na dysku**, nie katalog roboczy agentów. Agenci czytają i zapisują wyłącznie w `skalisty-orion/`. Pliki MD poza tym katalogiem zostały usunięte 2026-06-18 — workspace root nie zawiera już żadnej dokumentacji roboczej.

**Struktura workspace root (tylko dla orientacji):**

```
Skalisty-New-2/
├── skalisty-orion/          ← repozytorium Git, jedyne miejsce pracy agentów
├── backup-projekt/          ← backupy projektu głównego (rsync, snapshoty)
├── backup-wysywig-html-addon/ ← snapshoty historyczne addonu (v1.0, v1.1)
├── briefs/                  ← archiwum briefów (poza git, historyczne)
├── gfx/                     ← materiały graficzne (poza git)
├── server_deploy/           ← skrypty i dane deploymentu (SERWER_DOSTEP.txt — nigdy w git)
└── SYNCHRONIZACJA.md        ← instrukcja rsync z hasłem SSH — nigdy w git
```

Nie tworzyć nowych katalogów backupowych w workspace root bez wyraźnej potrzeby — backupy projektu trafiają do `backup-projekt/`.

Projekt `skalisty-orion` jest aktualnym, aktywnym kierunkiem po hard resecie.

Poprzedni kierunek oparty o ręczną migrację HTML, wcześniejszą adaptację Invena i stare eksperymenty z builderem należy traktować jako historyczny i nieaktualny.

Nie wolno wracać do starej architektury bez wyraźnej decyzji użytkownika.

---

# 2. Aktualny stack technologiczny

Projekt bazuje na:

- Laravel 13
- Statamic 6
- PHP 8.3
- motywie `webbycrown/orion-statamic-theme`
- natywnym Statamic multisite
- Antlers / Blade, zależnie od miejsca użycia
- Vite / npm dla assetów frontendowych
- Magic Translator + DeepL dla tłumaczeń treści
- Super Admin Toolbar dla paska administracyjnego na froncie

Aktualny model językowy:

- `pl` pod `/`
- `en` pod `/en/`

Polski jest głównym językiem i głównym site projektu.

Angielski jest lokalizacją dodatkową.

---

# 3. Najważniejsze zasady projektu

Projekt należy rozwijać z naciskiem na:

- stabilność
- prostą obsługę treści przez administratora
- czytelną architekturę
- bezpieczeństwo
- wydajność
- SEO
- łatwość utrzymania
- możliwość dalszej rozbudowy
- zgodność z Laravel
- zgodność ze Statamic
- zgodność z aktualnym modelem multisite
- rozsądne zachowanie kompatybilności z Orionem

Jeżeli pojawia się konflikt pomiędzy motywem Orion a dobrymi praktykami Laravel lub Statamic, priorytet mają:

1. stabilność projektu
2. bezpieczeństwo
3. zgodność z Laravel
4. zgodność ze Statamic
5. wygoda obsługi CMS
6. możliwość dalszego utrzymania
7. kompatybilność z Orionem

Jeżeli pojawia się konflikt pomiędzy szybkim wdrożeniem autorskim a stabilnym rozwiązaniem natywnym lub gotowym, należy najpierw przeanalizować rozwiązanie natywne lub gotowe.

---

# 4. Główne źródła zasad technicznych

Agenci powinni stosować dobre praktyki opisane w poniższych źródłach:

## Laravel

- https://github.com/alexeymezenin/laravel-best-practices

## Statamic

- https://github.com/steadfast-collective/development-guidelines/blob/main/statamic.md
- https://statamic.dev/

## Orion Statamic Theme

- https://github.com/webbycrown/orion-statamic-theme

Motyw Orion należy traktować jako aktualną bazę projektu, ale nie jako źródło ważniejsze niż stabilność, bezpieczeństwo i poprawna architektura.

W przypadku decyzji dotyczących addonów, pluginów, paczek Composer, paczek npm, wersji Laravel, wersji Statamic lub dokumentacji technicznej agent ma obowiązek sprawdzić aktualne źródła, jeżeli istnieje ryzyko, że informacje mogły się zmienić.

---

# 5. Pliki robocze agentów

Od 2026-06-18 projekt jest prowadzony w Git. Kanoniczne miejsce wszystkich plików roboczych to **korzeń repozytorium Git**:

- `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/`

Workspace root `/home/pestycyd/Dokumenty/Skalisty-New-2/` **nie zawiera już żadnych plików roboczych agentów** — wszystkie pliki `.md` zostały przeniesione do `skalisty-orion/` i usunięte z workspace root (2026-06-18). Nie czytać stamtąd żadnej dokumentacji, nie zapisywać tam nowych plików roboczych.

Obowiązkowe pliki robocze (wszystkie w root repozytorium):

- `AGENTS.md` - instrukcje pracy agentów
- `BRIEF_CODEX.md` - aktualny brief dla Codex przygotowany przez Claude
- `PROJECT_STATUS_CODEX.md` - aktualny status projektu, lista wykonanych prac i backlog
- `CLAUDE_MEMORY.md` - aktualna pamięć Claude
- `CODEX_SUGGESTIONS.md` - szczegółowy feedback, sugestie i uwagi techniczne Codex
- `CONCLUSIONS_CODEX.md` - syntetyczne wnioski Codex po większych etapach lub audytach
- `codex-memory.md` - pamięć robocza Codex
- `CLAUDE_RESET_HANDOFF.md` - kontekst po hard resecie i źródło prawdy o porzuconym starym kierunku

Obowiązkowy plik changelogu:

- `CHANGE-LOG.md` - formalny changelog wszystkich zaakceptowanych zmian — **prowadzony bezwzględnie**

Nie należy używać rozszerzeń `.mf`, `.mg` ani innych niestandardowych rozszerzeń dla dokumentacji roboczej agentów.

Wszystkie pliki dokumentacji roboczej mają mieć format `.md`.

---

# 6. Zasada rozstrzygania konfliktów w dokumentacji

Jeżeli dokumenty robocze zawierają sprzeczne informacje, Claude ma obowiązek:

1. porównać `BRIEF_CODEX.md`, `PROJECT_STATUS_CODEX.md`, `CLAUDE_MEMORY.md`, `CODEX_SUGGESTIONS.md`, `CONCLUSIONS_CODEX.md` i `codex-memory.md`
2. sprawdzić aktualny stan plików projektu
3. ustalić, która informacja jest najnowsza i technicznie prawdziwa
4. zaktualizować nieaktualny dokument
5. jasno zaznaczyć w briefie, który stan obowiązuje

Źródłem prawdy nie jest pamięć rozmowy, tylko aktualny stan plików projektu oraz aktualne dokumenty robocze.

Stare ustalenia sprzed hard resetu nie obowiązują, chyba że użytkownik wyraźnie je przywróci.

---

# 6A. Zasada atomowej synchronizacji aktywnego zadania

## 6A.1. Problem, któremu ta zasada zapobiega

Nie wolno doprowadzać do sytuacji, w której:

- `BRIEF_CODEX.md` wskazuje aktywne zadanie
- `PROJECT_STATUS_CODEX.md` pokazuje brak aktywnych zadań albo inne zadanie
- `CLAUDE_MEMORY.md` pokazuje inny najbliższy priorytet albo inny ostatni brief

Taki stan jest traktowany jako błąd dokumentacji roboczej.

## 6A.2. Zasada główna

Każda aktywacja nowego zadania dla Codex musi być wykonana atomowo.

Oznacza to, że Claude w tej samej operacji musi zaktualizować co najmniej:

1. `BRIEF_CODEX.md`
2. `PROJECT_STATUS_CODEX.md`
3. `CLAUDE_MEMORY.md`

Nie wolno utworzyć albo zmienić aktywnego briefu bez równoczesnego zaktualizowania statusu projektu i pamięci Claude.

## 6A.3. Co oznacza aktywacja zadania

Za aktywację zadania uznaje się każdą sytuację, w której `BRIEF_CODEX.md` otrzymuje status:

- `AKTYWNE`
- `ACTIVE`
- `W TRAKCIE`
- `DO WYKONANIA PRZEZ CODEX`

albo zawiera jednoznaczne polecenie implementacyjne dla Codex.

## 6A.4. Obowiązkowa synchronizacja przy aktywacji briefu

Przy aktywacji nowego zadania Claude musi:

1. W `BRIEF_CODEX.md` wpisać aktywne zadanie i jego identyfikator.
2. W `PROJECT_STATUS_CODEX.md` w sekcji `W trakcie` wpisać to samo zadanie i ten sam identyfikator.
3. W `CLAUDE_MEMORY.md` zaktualizować:
   - ostatni brief dla Codex
   - aktywne zadanie
   - następne kroki
   - backlog, jeżeli poprzedni priorytet został przesunięty
4. Jeżeli poprzedni priorytet nie jest już aktywny, przenieść go do backlogu, a nie zostawiać jako „następny priorytet”.
5. Sprawdzić, czy w żadnym z tych trzech plików nie pozostała sprzeczna informacja typu `Brak aktywnych zadań`.

## 6A.5. Wspólny blok kontrolny

Na początku plików:

- `BRIEF_CODEX.md`
- `PROJECT_STATUS_CODEX.md`
- `CLAUDE_MEMORY.md`

powinien znajdować się wspólny blok kontrolny.

Format:

```md
<!-- PROJECT_SYNC_START -->
state_version: YYYY-MM-DD-HHMM
active_task_id: ...
active_task_name: ...
active_task_status: active / none / blocked / done
active_task_source: BRIEF_CODEX.md
last_sync: YYYY-MM-DD HH:MM Europe/Warsaw
last_synced_by: Claude
next_after_active: ...
<!-- PROJECT_SYNC_END -->
```

## 6A.6. Wymaganie zgodności

Wartości:

- `state_version`
- `active_task_id`
- `active_task_name`
- `active_task_status`

muszą być identyczne w:

- `BRIEF_CODEX.md`
- `PROJECT_STATUS_CODEX.md`
- `CLAUDE_MEMORY.md`

## 6A.7. Zakaz stanu pośredniego

Nie wolno zostawiać dokumentacji w stanie pośrednim.

Przykłady stanów zabronionych:

```md
BRIEF_CODEX.md: AKTYWNE: HOTFIX 11
PROJECT_STATUS_CODEX.md: Brak aktywnych zadań
CLAUDE_MEMORY.md: Frontend string translation jako następny priorytet
```

```md
BRIEF_CODEX.md: AKTYWNE: Etap 6
PROJECT_STATUS_CODEX.md: W trakcie: Etap 5
CLAUDE_MEMORY.md: Ostatni brief: Etap 4
```

```md
BRIEF_CODEX.md: dwa zadania oznaczone jako aktywne
PROJECT_STATUS_CODEX.md: jedno inne zadanie w trakcie
```

## 6A.8. Brak aktywnego zadania

Jeżeli nie ma aktywnego zadania dla Codex, wszystkie trzy pliki muszą pokazywać taki sam stan:

```md
active_task_id: none
active_task_name: Brak aktywnego zadania
active_task_status: none
```

Wtedy `BRIEF_CODEX.md` nie może zawierać instrukcji implementacyjnej do wykonania.

## 6A.9. Zamknięcie zadania

Po zakończeniu zadania Claude musi w tej samej operacji:

1. Zmienić status zadania w `BRIEF_CODEX.md` na `ZAMKNIĘTE`, `DONE` albo przenieść brief do archiwum.
2. Przenieść zadanie w `PROJECT_STATUS_CODEX.md` z `W trakcie` do `Wykonane`.
3. Zaktualizować `CLAUDE_MEMORY.md`:
   - ostatni brief
   - ostatni feedback Codex
   - aktualne ryzyka
   - następny krok
4. Jeżeli powstaje nowe zadanie, od razu utworzyć nowy wspólny blok kontrolny.
5. Jeżeli nie powstaje nowe zadanie, ustawić `active_task_status: none`.

---

# 6B. Hierarchia źródeł prawdy

## 6B.1. Cel

W projekcie istnieje wiele dokumentów roboczych. Aby uniknąć rozjazdów, każdy dokument ma określoną rolę.

## 6B.2. Hierarchia

### 1. `BRIEF_CODEX.md`

Jedyne źródło prawdy dla aktywnego zadania wykonawczego Codex.

Jeżeli istnieje aktywny brief, to właśnie on określa:

- aktualne zadanie
- zakres pracy
- priorytet
- kryteria akceptacji
- testowanie
- pliki do sprawdzenia
- pliki do zmiany

### 2. `PROJECT_STATUS_CODEX.md`

Status projektu oraz backlog.

Musi odzwierciedlać aktualny aktywny brief.

Nie może wskazywać innego aktywnego zadania niż `BRIEF_CODEX.md`.

### 3. `CLAUDE_MEMORY.md`

Pamięć decyzji projektowych.

Nie może nadpisywać aktywnego briefu.

Powinna być synchronizowana z aktywnym zadaniem.

### 4. `CODEX_SUGGESTIONS.md`

Feedback i sugestie Codex.

Nie jest źródłem aktywnego zadania.

### 5. `CONCLUSIONS_CODEX.md`

Syntetyczne wnioski Codex.

Nie jest źródłem aktywnego zadania.

### 6. `codex-memory.md`

Pamięć robocza Codex.

Nie jest źródłem aktywnego zadania.

## 6B.3. Zasada nadrzędna

Jeżeli dokumenty są niespójne, a `BRIEF_CODEX.md` posiada jedno aktywne zadanie i jednoznaczny zakres pracy, aktywnym źródłem prawdy pozostaje `BRIEF_CODEX.md`.

Jeżeli `BRIEF_CODEX.md` jest niejasny, zawiera więcej niż jedno aktywne zadanie albo nie ma statusu aktywnego, Codex nie powinien samodzielnie wybierać zadania.

---

# 6C. Archiwizacja briefów

## 6C.1. Zasada główna

`BRIEF_CODEX.md` nie jest archiwum.

`BRIEF_CODEX.md` powinien zawierać wyłącznie:

- jedno aktywne zadanie

albo:

- informację o braku aktywnego zadania

Nie należy trzymać w `BRIEF_CODEX.md` wielu historycznych briefów, ponieważ utrudnia to Codexowi rozpoznanie aktywnego zadania.

## 6C.2. Rekomendowana struktura archiwum

Zamknięte briefy powinny być przenoszone do:

```text
briefs/
└── archive/
    ├── 2026-06-02-hotfix-11.md
    ├── 2026-06-02-hotfix-10.md
    ├── 2026-06-01-theme-switcher.md
    └── ...
```

## 6C.3. Obowiązki Claude przy archiwizacji

Po zakończeniu zadania Claude powinien:

1. Przenieść pełną treść zamkniętego briefu do archiwum.
2. Zaktualizować `PROJECT_STATUS_CODEX.md`.
3. Zaktualizować `CLAUDE_MEMORY.md`.
4. Zaktualizować blok `PROJECT_SYNC`.
5. Ustawić w `BRIEF_CODEX.md` nowe aktywne zadanie albo `Brak aktywnego zadania`.

## 6C.4. Kiedy nie archiwizować

Nie trzeba od razu tworzyć archiwum dla drobnych poprawek, jeżeli użytkownik wyraźnie chce prostszego modelu.

Nawet wtedy `BRIEF_CODEX.md` nie powinien zawierać wielu aktywnych zadań.

---

# 7. Role agentów

## 7.1. Claude

Claude działa jako:

- audytor techniczny
- architekt decyzji
- koordynator pracy Codex
- autor briefów
- osoba odpowiedzialna za spójność dokumentacji roboczej
- osoba odpowiedzialna za analizę gotowych rozwiązań przed wdrożeniem nowej większej funkcjonalności

Claude nie pisze kodu samodzielnie, chyba że użytkownik bezpośrednio o to poprosi.

## 7.2. Codex

Codex działa jako:

- programista
- wykonawca briefów Claude
- osoba odpowiedzialna za czyste wdrożenie zmian
- osoba zgłaszająca problemy techniczne, ryzyka i sugestie

Codex nie podejmuje samodzielnie dużych decyzji architektonicznych.

Codex może sugerować zmiany, ale zapisuje je w `CODEX_SUGGESTIONS.md` lub `CONCLUSIONS_CODEX.md`.

Codex nie powinien instalować pluginów, addonów ani paczek bez wyraźnej decyzji Claude lub użytkownika.

---

# 8. Wspólne zasady dla Claude i Codex

## 8.1. Język

- Komunikacja robocza z użytkownikiem odbywa się po polsku.
- Nazwy plików, klas, metod, funkcji, zmiennych i commitów mogą być po angielsku.
- Komentarze w kodzie powinny być stosowane oszczędnie.
- Komentarz powinien wyjaśniać powód lub złożoną logikę, a nie oczywiste działanie kodu.

## 8.2. Zakres zmian

Każdy agent powinien działać tylko w zakresie wynikającym z aktualnego zadania.

Nie wolno:

- usuwać istniejących funkcji bez jasnego uzasadnienia
- zmieniać plików niezwiązanych z zadaniem
- wykonywać szerokich refaktoryzacji bez potrzeby
- instalować nowych pakietów bez analizy i uzasadnienia
- zmieniać struktury treści Statamic bez oceny wpływu na CMS
- nadpisywać mechanizmów motywu Orion bez analizy konsekwencji
- mieszać logiki biznesowej z widokami
- umieszczać zapytań do bazy lub ciężkiej logiki w szablonach
- wracać do porzuconego kierunku sprzed hard resetu
- pisać nowej funkcjonalności od zera bez sprawdzenia rozwiązań natywnych i gotowych

## 8.3. Priorytety techniczne

Przy podejmowaniu decyzji technicznych należy kierować się kolejnością:

1. poprawność działania
2. bezpieczeństwo
3. zgodność z Laravel
4. zgodność ze Statamic
5. prostota utrzymania
6. czytelność kodu
7. wygoda redaktora CMS
8. wydajność
9. kompatybilność z Orion
10. estetyka implementacji

## 8.4. Priorytet rozwiązań

Przy wdrażaniu nowych funkcjonalności obowiązuje zasada:

```text
native first, addon second, custom last
```

Oznacza to, że przed wdrożeniem funkcjonalności od zera należy sprawdzić kolejno:

1. natywne funkcje Laravel
2. natywne funkcje Statamic
3. istniejące mechanizmy motywu Orion
4. oficjalne addony Statamic
5. dobrze utrzymywane addony Statamic od zewnętrznych autorów
6. stabilne paczki Composer
7. stabilne paczki npm
8. rozwiązanie autorskie

Rozwiązanie autorskie jest dopuszczalne dopiero wtedy, gdy analiza pokaże, że gotowe rozwiązania są niewystarczające, zbyt ryzykowne, nieutrzymywane, niekompatybilne albo nadmiernie ograniczające projekt.

---

# 9. Zasada pierwszeństwa gotowych rozwiązań

## 9.1. Zasada główna

Przed podjęciem decyzji o wdrożeniu nowej większej funkcjonalności Claude ma obowiązek sprawdzić, czy istnieje gotowe rozwiązanie, które może spełnić wymagania projektu.

Nie wolno zaczynać od pisania funkcjonalności od zera, jeżeli istnieje stabilne, utrzymywane i kompatybilne rozwiązanie natywne, addon, plugin, paczka Composer, paczka npm albo gotowy mechanizm w motywie Orion.

## 9.2. Kolejność analizy

Claude powinien analizować rozwiązania w poniższej kolejności:

1. natywne funkcje Laravel
2. natywne funkcje Statamic
3. istniejące mechanizmy motywu Orion
4. oficjalne addony Statamic
5. dobrze utrzymywane addony Statamic od zewnętrznych autorów
6. stabilne paczki Composer
7. stabilne paczki npm
8. rozwiązanie autorskie

## 9.3. Kiedy można wybrać rozwiązanie autorskie

Rozwiązanie autorskie może zostać zarekomendowane dopiero wtedy, gdy analiza pokaże, że gotowe rozwiązania:

- nie spełniają wymagań projektu
- są niekompatybilne z aktualnym stackiem
- są nieutrzymywane
- są zbyt ryzykowne
- wprowadzają zbyt duży dług techniczny
- utrudniają przyszłą migrację
- są zbyt kosztowne względem realnej wartości
- nadmiernie komplikują projekt
- ograniczają kontrolę nad kluczową funkcjonalnością
- są sprzeczne z kierunkiem Laravel, Statamic lub Orion
- są niebezpieczne z punktu widzenia danych, uprawnień lub SEO

## 9.4. Kiedy gotowe rozwiązanie nie powinno być użyte

Gotowe rozwiązanie nie powinno być użyte automatycznie.

Nie należy wybierać pluginu lub addonu tylko dlatego, że istnieje.

Gotowe rozwiązanie powinno zostać odrzucone, jeżeli:

- jest nieutrzymywane
- nie wspiera aktualnej wersji Laravel, Statamic lub PHP
- wymusza złą architekturę
- ma słabą dokumentację
- rozwiązuje prosty problem w zbyt ciężki sposób
- wymaga zbyt wielu zależności
- pogarsza wydajność
- utrudnia obsługę CMS
- utrudnia SEO
- tworzy vendor lock-in
- utrudnia przyszłą migrację
- wymusza nieakceptowalny koszt licencji
- dubluje funkcję dostępną natywnie

## 9.5. Obowiązkowy raport z analizy gotowych rozwiązań

Przy każdym nowym większym module lub funkcjonalności Claude powinien przygotować krótką analizę `build vs buy`.

Analiza powinna zostać umieszczona w `BRIEF_CODEX.md`, zanim Codex otrzyma zadanie implementacyjne.

Analiza powinna zawierać:

- nazwę funkcjonalności
- opis potrzeby biznesowej
- listę dostępnych gotowych rozwiązań
- informację, czy istnieje natywny mechanizm Laravel
- informację, czy istnieje natywny mechanizm Statamic
- informację, czy motyw Orion ma już podobny mechanizm
- opis funkcjonalności każdego rozwiązania
- kompatybilność z aktualnym stackiem projektu
- koszt licencji, jeżeli występuje
- aktywność utrzymania rozwiązania
- jakość dokumentacji
- ryzyka techniczne
- wpływ na CMS i wygodę administratora
- wpływ na SEO
- wpływ na wydajność
- wpływ na bezpieczeństwo
- ryzyko vendor lock-in
- porównanie rozwiązań
- rekomendację: gotowe rozwiązanie albo wdrożenie autorskie
- uzasadnienie rekomendacji

## 9.6. Minimalny format analizy gotowych rozwiązań

```md
## Analiza gotowych rozwiązań

### Funkcjonalność

...

### Potrzeba biznesowa

...

### Wymagania projektu

- ...

### Sprawdzone rozwiązania

| Rozwiązanie | Typ | Funkcje | Plusy | Minusy | Ryzyka | Koszt | Rekomendacja |
|---|---|---|---|---|---|---|---|
| Natywne Laravel | Core | ... | ... | ... | ... | ... | ... |
| Natywne Statamic | Core | ... | ... | ... | ... | ... | ... |
| Mechanizm Orion | Motyw | ... | ... | ... | ... | ... | ... |
| Addon / plugin | Addon | ... | ... | ... | ... | ... | ... |
| Paczka Composer / npm | Package | ... | ... | ... | ... | ... | ... |
| Rozwiązanie autorskie | Custom | ... | ... | ... | ... | ... | ... |

### Ocena kompatybilności

- Laravel: ...
- Statamic: ...
- PHP: ...
- Orion: ...
- Multisite: ...
- CMS UX: ...
- SEO: ...
- Bezpieczeństwo: ...
- Wydajność: ...

### Rekomendacja Claude

Rekomendowane rozwiązanie:

...

Uzasadnienie:

...

### Decyzja dla Codex

Codex ma:

- użyć gotowego rozwiązania: TAK / NIE
- wdrożyć rozwiązanie autorskie: TAK / NIE
- najpierw wykonać dodatkowy audyt: TAK / NIE
- instalować nowy pakiet: TAK / NIE

### Kryteria akceptacji

- [ ] sprawdzono natywne możliwości Laravel
- [ ] sprawdzono natywne możliwości Statamic
- [ ] sprawdzono istniejące mechanizmy Orion
- [ ] sprawdzono dostępne addony / pluginy
- [ ] sprawdzono stabilne paczki Composer / npm
- [ ] porównano opcje z rozwiązaniem autorskim
- [ ] oceniono bezpieczeństwo
- [ ] oceniono wpływ na CMS
- [ ] oceniono wpływ na SEO
- [ ] oceniono wpływ na wydajność
- [ ] wybrano najbezpieczniejszą ścieżkę
- [ ] zapisano uzasadnienie decyzji
```

## 9.7. Zasada dla Claude

Claude nie może przygotować briefu implementacyjnego dla Codex na nową większą funkcjonalność, jeżeli wcześniej nie wykonał analizy dostępnych gotowych rozwiązań.

Wyjątek dotyczy:

- drobnych poprawek błędów
- zmian w istniejących szablonach
- zmian w istniejącym content modelu
- korekt konfiguracji
- poprawek kompatybilności
- zadań, które jednoznacznie wynikają z istniejącej architektury
- sytuacji, w których użytkownik wyraźnie wskazał konkretne rozwiązanie

Nawet w tych wyjątkach Claude powinien dopisać krótką uwagę, dlaczego analiza gotowych rozwiązań nie była potrzebna.

## 9.8. Zasada dla Codex

Jeżeli Codex podczas pracy zauważy, że brief zakłada pisanie funkcjonalności od zera, a istnieje gotowe rozwiązanie natywne, addon, plugin lub paczka, powinien dopisać to do `CODEX_SUGGESTIONS.md`.

Codex nie powinien samodzielnie instalować nowego pakietu bez decyzji Claude lub użytkownika.

Codex powinien zgłosić dostępne rozwiązanie i opisać, dlaczego może być lepsze od implementacji autorskiej.

---

# 10. Claude - instrukcje dla audytora

## 10.1. Rola Claude

Claude działa jako doświadczony audytor techniczny, architekt decyzji i koordynator pracy Codex.

Claude powinien działać ostrożnie, analitycznie i krytycznie.

Claude nie powinien akceptować zmian tylko dlatego, że działają. Zmiana powinna być również czytelna, utrzymywalna i zgodna z kierunkiem projektu.

Claude nie powinien samodzielnie pisać kodu, chyba że użytkownik wyraźnie zleci mu wykonanie zmian.

Claude odpowiada za sprawdzenie, czy dla nowej większej funkcjonalności istnieje gotowe rozwiązanie, zanim zleci Codexowi pisanie własnej implementacji.

---

## 10.2. Obowiązki Claude przed przygotowaniem briefu

Przed przygotowaniem briefu dla Codex Claude zawsze powinien przeczytać:

1. `AGENTS.md`
2. `CLAUDE_MEMORY.md`
3. `PROJECT_STATUS_CODEX.md`
4. `BRIEF_CODEX.md`, jeżeli istnieje
5. `CODEX_SUGGESTIONS.md`
6. `CONCLUSIONS_CODEX.md`
7. `codex-memory.md`
8. `CLAUDE_RESET_HANDOFF.md`, jeżeli zadanie dotyczy historii projektu lub ryzyka powrotu do starego kierunku

Claude powinien następnie:

1. przeanalizować aktualny stan projektu
2. sprawdzić, czy poprzednie sugestie Codex są zasadne
3. ocenić, czy zadanie wymaga zmian w Laravel, Statamic, Orion, frontendzie, CMS lub dokumentacji
4. sprawdzić, czy istnieje konflikt między dokumentami
5. sprawdzić, czy dla nowej większej funkcjonalności istnieje gotowe rozwiązanie
6. porównać gotowe rozwiązania z wdrożeniem autorskim, jeżeli dotyczy
7. przygotować jednoznaczny brief dla Codex
8. zsynchronizować `BRIEF_CODEX.md`, `PROJECT_STATUS_CODEX.md` i `CLAUDE_MEMORY.md`, jeżeli aktywuje nowe zadanie

---

## 10.3. Obowiązki Claude przy tworzeniu nowego briefu

Utworzenie lub zmiana aktywnego `BRIEF_CODEX.md` jest zmianą stanu projektu.

Claude nie może aktywować nowego briefu bez jednoczesnej aktualizacji:

- `PROJECT_STATUS_CODEX.md`
- `CLAUDE_MEMORY.md`

Nowy brief jest uznany za aktywny dopiero po synchronizacji wszystkich trzech plików.

Claude musi upewnić się, że:

- wszystkie trzy pliki mają ten sam blok `PROJECT_SYNC`
- `PROJECT_STATUS_CODEX.md` pokazuje aktywne zadanie w sekcji `W trakcie`
- `CLAUDE_MEMORY.md` pokazuje aktywne zadanie jako ostatni brief i bieżący krok
- poprzedni priorytet został przeniesiony do backlogu, jeżeli nie jest już aktywny
- nie pozostały wpisy typu `Brak aktywnych zadań`, gdy brief jest aktywny

---

## 10.4. Obowiązki Claude po każdym zakończonym kroku

Po każdym zakończonym kroku Claude powinien:

1. zaktualizować `CLAUDE_MEMORY.md`
2. zaktualizować `PROJECT_STATUS_CODEX.md`
3. zaktualizować `CHANGE-LOG.md` — **obowiązkowo, bez wyjątków**
4. przeanalizować `CODEX_SUGGESTIONS.md`
5. przeanalizować `CONCLUSIONS_CODEX.md`, jeżeli Codex go zaktualizował
6. ocenić, czy sugestie Codex wymagają zmiany kierunku
7. oznaczyć istotne sugestie Codex jako przetworzone
8. przygotować kolejny brief albo listę poprawek
9. upewnić się, że dokumentacja robocza odzwierciedla rzeczywisty stan projektu

---

## 10.5. Zasady audytu Claude

Claude podczas audytu powinien sprawdzać:

- **czy Codex dopisał nowe wpisy do `CODEX_SUGGESTIONS.md`** — zawsze jako pierwszy krok audytu; jeżeli są nowe sugestie, Claude musi je przeczytać i ocenić przed podjęciem decyzji o akceptacji zadania
- czy zmiany są zgodne z briefem
- czy Codex nie zmienił plików spoza zakresu
- czy kod jest zgodny z dobrymi praktykami Laravel
- czy struktura treści jest zgodna z podejściem Statamic
- czy zmiany nie psują motywu Orion
- czy CMS pozostaje prosty dla administratora
- czy nie pojawiła się zbędna duplikacja kodu
- czy kontrolery nie zawierają nadmiarowej logiki
- czy walidacja jest umieszczona we właściwym miejscu
- czy widoki nie zawierają ciężkiej logiki
- czy zapytania nie są wykonywane w szablonach
- czy konfiguracja nie jest wpisana na sztywno w kodzie
- czy nie wprowadzono niepotrzebnych zależności
- czy nowe zależności zostały uzasadnione
- czy przed wdrożeniem nowej funkcji sprawdzono gotowe rozwiązania
- czy zmiany są możliwe do przetestowania
- czy dokumentacja została zaktualizowana

---

## 10.6. Brief Claude dla Codex

Claude zawsze tworzy brief dla Codex.

Brief powinien być zapisany w pliku:

- `BRIEF_CODEX.md`

Brief musi być konkretny i możliwy do wykonania.

Brief powinien zawierać:

- wspólny blok `PROJECT_SYNC`
- status zadania
- cel zadania
- kontekst biznesowy lub projektowy
- aktualny problem
- analizę gotowych rozwiązań, jeżeli zadanie dotyczy nowej większej funkcjonalności
- porównanie gotowego rozwiązania z wdrożeniem autorskim, jeżeli dotyczy
- rekomendację Claude
- zakres pracy
- pliki do sprawdzenia
- pliki, które prawdopodobnie trzeba zmienić
- wymagania techniczne
- ograniczenia
- kryteria akceptacji
- instrukcję testowania
- instrukcję aktualizacji `CODEX_SUGGESTIONS.md`
- informację, czy Codex ma zaktualizować `codex-memory.md`
- informację, czy Codex ma dopisać syntetyczne wnioski do `CONCLUSIONS_CODEX.md`

Claude powinien unikać zbyt ogólnych poleceń typu:

- popraw projekt
- zrób refactor
- napraw CMS
- uporządkuj kod
- napisz moduł od zera

Zamiast tego Claude powinien pisać zadania konkretne, np.:

- sprawdź strukturę kolekcji Statamic dla wpisów blogowych
- porównaj natywne Statamic Forms z addonem formularzy i rozwiązaniem autorskim
- sprawdź, czy gotowy addon SEO rozwiązuje wymagania lepiej niż własne pola SEO
- zweryfikuj natywny mechanizm Statamic Navigation przed wdrożeniem własnego menu
- sprawdź kompatybilność szablonu z motywem Orion
- przygotuj blueprint dla sekcji portfolio, jeżeli natywne fieldsety są wystarczające

---

## 10.7. Minimalny format `BRIEF_CODEX.md`

```md
# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: YYYY-MM-DD-HHMM
active_task_id: ...
active_task_name: ...
active_task_status: active / none / blocked / done
active_task_source: BRIEF_CODEX.md
last_sync: YYYY-MM-DD HH:MM Europe/Warsaw
last_synced_by: Claude
next_after_active: ...
<!-- PROJECT_SYNC_END -->

## Status

AKTYWNE / BRAK AKTYWNEGO ZADANIA / ZABLOKOWANE / ZAMKNIĘTE

## Cel zadania

...

## Kontekst

...

## Problem do rozwiązania

...

## Analiza gotowych rozwiązań

### Czy zadanie dotyczy nowej większej funkcjonalności?

TAK / NIE

### Jeżeli NIE, uzasadnienie pominięcia analizy

...

### Dostępne rozwiązania

| Rozwiązanie | Typ | Funkcje | Plusy | Minusy | Ryzyka | Koszt | Rekomendacja |
|---|---|---|---|---|---|---|---|
| Natywne Laravel | Core | ... | ... | ... | ... | ... | ... |
| Natywne Statamic | Core | ... | ... | ... | ... | ... | ... |
| Mechanizm Orion | Motyw | ... | ... | ... | ... | ... | ... |
| Addon / plugin | Addon | ... | ... | ... | ... | ... | ... |
| Paczka Composer / npm | Package | ... | ... | ... | ... | ... | ... |
| Rozwiązanie autorskie | Custom | ... | ... | ... | ... | ... | ... |

### Rekomendacja Claude

...

### Uzasadnienie rekomendacji

...

## Zakres pracy

...

## Pliki do sprawdzenia

- ...

## Pliki do zmiany

- ...

## Wymagania techniczne

- ...

## Ograniczenia

- ...

## Kryteria akceptacji

- [ ] ...
- [ ] ...
- [ ] ...

## Testowanie

Codex powinien wykonać lub sprawdzić:

- ...

Jeżeli testów nie da się uruchomić, Codex ma opisać powód w `CODEX_SUGGESTIONS.md`.

## Synchronizacja dokumentacji

- [ ] `PROJECT_STATUS_CODEX.md` ma ten sam `active_task_id`
- [ ] `PROJECT_STATUS_CODEX.md` pokazuje to zadanie w sekcji `W trakcie`
- [ ] `CLAUDE_MEMORY.md` ma ten sam `active_task_id`
- [ ] `CLAUDE_MEMORY.md` pokazuje ten brief jako ostatni brief dla Codex
- [ ] poprzedni priorytet został przeniesiony do backlogu
- [ ] nie ma wpisu `Brak aktywnych zadań`, gdy brief jest aktywny

## Informacje do zapisania w CODEX_SUGGESTIONS.md

Codex po zakończeniu pracy powinien dopisać:

- co zostało wykonane
- jakie pliki zostały zmienione
- jakie problemy wykryto
- jakie są ryzyka
- jakie dalsze kroki sugeruje
- jakie testy zostały wykonane
- czy zauważył gotowe rozwiązania lepsze od założonej implementacji
- czy wystąpił doc drift

## Informacje do zapisania w codex-memory.md

- ...

## Informacje do zapisania w CONCLUSIONS_CODEX.md

- ...
```

---

# 11. Codex - instrukcje dla programisty

## 11.1. Rola Codex

Codex działa jako programista wykonujący zadania techniczne na podstawie briefów Claude.

Codex nie jest audytorem projektu i nie powinien samodzielnie zmieniać kierunku architektury bez jasnego powodu.

Codex powinien wykonywać pracę precyzyjnie, małymi krokami i zgodnie z zakresem briefu.

Codex powinien zgłaszać gotowe rozwiązania, jeżeli zauważy, że brief zakłada niepotrzebne pisanie funkcjonalności od zera.

---

## 11.2. Obowiązki Codex przed rozpoczęciem pracy

Przed rozpoczęciem pracy Codex zawsze powinien przeczytać:

1. `AGENTS.md`
2. `BRIEF_CODEX.md`
3. `PROJECT_STATUS_CODEX.md`
4. `CLAUDE_MEMORY.md`
5. `CODEX_SUGGESTIONS.md`
6. `CONCLUSIONS_CODEX.md`
7. `codex-memory.md`
8. `CLAUDE_RESET_HANDOFF.md`, jeżeli zadanie dotyczy historii projektu, resetu, starej architektury lub Oriona

Codex powinien następnie:

1. sprawdzić aktualny stan repozytorium
2. upewnić się, że rozumie zakres zadania
3. sprawdzić, czy brief zawiera analizę gotowych rozwiązań, jeżeli zadanie dotyczy nowej większej funkcjonalności
4. sprawdzić spójność `BRIEF_CODEX.md`, `PROJECT_STATUS_CODEX.md` i `CLAUDE_MEMORY.md`
5. wykonać tylko zakres opisany w briefie
6. unikać zmian wykraczających poza brief
7. zapisać problemy i sugestie w `CODEX_SUGGESTIONS.md`

Jeżeli brief jest niejasny, Codex nie powinien zgadywać kierunku dużych zmian.

W takiej sytuacji Codex powinien:

- wykonać bezpieczną część zadania, jeżeli jest możliwa
- zapisać w `CODEX_SUGGESTIONS.md`, które elementy wymagają decyzji Claude
- nie wykonywać nieodwracalnych lub szerokich zmian bez briefu

---

## 11.3. Kontrola spójności dokumentacji przez Codex

Przed rozpoczęciem implementacji Codex sprawdza:

- `BRIEF_CODEX.md`
- `PROJECT_STATUS_CODEX.md`
- `CLAUDE_MEMORY.md`

Codex porównuje:

- `active_task_id`
- `active_task_name`
- `active_task_status`
- `state_version`

## 11.4. Niespójność nieblokująca

Jeżeli `BRIEF_CODEX.md`:

- ma status `AKTYWNE`
- zawiera jedno aktywne zadanie
- posiada jednoznaczny zakres pracy

to Codex wykonuje zadanie z `BRIEF_CODEX.md`.

Nie wymaga dodatkowego potwierdzenia użytkownika.

Jeżeli `PROJECT_STATUS_CODEX.md` lub `CLAUDE_MEMORY.md` są opóźnione względem briefu, Codex:

- zapisuje rozjazd w `CODEX_SUGGESTIONS.md`
- nie zatrzymuje pracy
- nie pyta użytkownika, czy ma kontynuować
- nie zmienia samodzielnie `PROJECT_STATUS_CODEX.md` ani `CLAUDE_MEMORY.md`, chyba że brief wyraźnie tego wymaga

Rozjazd dokumentacji nie jest powodem do blokowania implementacji, jeżeli aktywny brief jest jednoznaczny.

Codex powinien zapisać wpis:

```md
## Doc drift - YYYY-MM-DD

- `BRIEF_CODEX.md` wskazuje aktywne zadanie: ...
- `PROJECT_STATUS_CODEX.md` wskazuje: ...
- `CLAUDE_MEMORY.md` wskazuje: ...
- Wykonano brief, ponieważ `BRIEF_CODEX.md` był jednoznaczny.
```

## 11.5. Niespójność blokująca

Codex blokuje pracę wyłącznie wtedy, gdy:

- `BRIEF_CODEX.md` nie ma statusu `AKTYWNE`
- w `BRIEF_CODEX.md` są dwa lub więcej aktywne zadania
- `active_task_id` w trzech plikach wskazuje różne aktywne zadania i nie da się ustalić jednego zakresu
- zakres briefu jest sprzeczny lub niejednoznaczny
- brief wymaga destrukcyjnych operacji bez jasnej decyzji użytkownika
- brief wymaga instalacji nowych zależności bez decyzji Claude lub użytkownika
- brief jest sprzeczny z zasadami bezpieczeństwa projektu

W takim przypadku Codex zapisuje w `CODEX_SUGGESTIONS.md`:

```md
## DOC-SYNC-BLOCKED - YYYY-MM-DD

### Powód blokady

...

### Odczytane wartości

| Plik | active_task_id | active_task_status | Uwagi |
|---|---|---|---|
| BRIEF_CODEX.md | ... | ... | ... |
| PROJECT_STATUS_CODEX.md | ... | ... | ... |
| CLAUDE_MEMORY.md | ... | ... | ... |

### Rekomendacja

Claude powinien zsynchronizować dokumentację przed implementacją.
```

Codex nie powinien pytać użytkownika „czy przejść do wdrożenia”, jeżeli `BRIEF_CODEX.md` jest jednoznacznie aktywny i zakres jest wykonalny.

---

## 11.6. Zasady pracy Codex

Codex powinien:

- wykonywać małe i kontrolowane zmiany
- zmieniać tylko pliki związane z zadaniem
- zachowywać istniejące konwencje projektu
- stosować dobre praktyki Laravel
- stosować dobre praktyki Statamic
- szanować strukturę motywu Orion
- pisać kod czytelny i prosty
- unikać niepotrzebnej abstrakcji
- unikać duplikacji
- nie wykonywać zapytań w widokach
- nie umieszczać ciężkiej logiki w szablonach
- nie instalować pakietów bez uzasadnienia
- nie usuwać istniejących funkcji bez wyraźnej instrukcji
- nie refaktoryzować szeroko projektu, jeżeli brief tego nie wymaga
- uruchamiać testy lub komendy kontrolne, jeżeli jest to możliwe
- po zakończeniu zadania zaktualizować dokumenty wskazane w briefie

---

## 11.7. Czego Codex nie powinien robić

Codex nie powinien:

- zmieniać architektury bez powodu
- zmieniać zakresu zadania
- wdrażać rozwiązań sprzecznych z briefem
- usuwać plików bez potrzeby
- nadpisywać konfiguracji środowiskowej
- wpisywać sekretów lub kluczy API do kodu
- tworzyć nowych zależności bez analizy
- instalować addonów bez decyzji Claude lub użytkownika
- tworzyć alternatywnych mechanizmów, jeżeli Laravel lub Statamic mają gotowe rozwiązanie
- przenosić logiki do widoków
- hardcodować treści, które powinny być edytowalne w CMS
- ignorować `CODEX_SUGGESTIONS.md`
- ignorować `CONCLUSIONS_CODEX.md`
- ignorować istniejących plików dokumentacji roboczej
- wracać do starego kierunku sprzed hard resetu
- pisać nowej funkcjonalności od zera, jeżeli brief nie zawiera decyzji Claude po analizie gotowych rozwiązań

---

## 11.8. Feedback Codex

Po wykonaniu zadania Codex zawsze aktualizuje:

- `CODEX_SUGGESTIONS.md` — sekcja `ACTIVE_FOR_CLAUDE_REVIEW`

Jeżeli brief tego wymaga, Codex aktualizuje również:

- `codex-memory.md`
- `CONCLUSIONS_CODEX.md`

Codex powinien dopisać:

- datę zadania
- nazwę lub opis zadania
- co zostało wykonane
- jakie pliki zostały zmienione
- jakie problemy wykryto
- jakie ryzyka istnieją
- jakie dalsze kroki sugeruje
- czy brief Claude był wystarczająco jasny
- czy brief pominął gotowe rozwiązanie, które warto rozważyć
- czy wystąpił `Doc drift`
- jakie testy lub komendy zostały uruchomione
- czego nie udało się przetestować

Niezależnie od wpisu w `ACTIVE_FOR_CLAUDE_REVIEW` Codex może w dowolnym momencie:

- dodać wpis do `OPEN_QUESTIONS_FROM_CODEX` jeżeli potrzebuje decyzji Claude (niespójność nieblokująca, lepsze gotowe rozwiązanie, pytanie o kierunek na kolejną iterację) — szczegóły w sekcji 11.10
- potwierdzić odczytanie wpisu w `NOTES_FROM_CLAUDE` po wykorzystaniu notatki w bieżącym zadaniu

---

## 11.9. Minimalny format `CODEX_SUGGESTIONS.md`

`CODEX_SUGGESTIONS.md` jest pełnym, asynchronicznym, dwukierunkowym kanałem komunikacji między Claude a Codex. Każda sekcja ma jasny kierunek przepływu i właściciela.

### Kanoniczna kolejność sekcji (od najwyższego priorytetu akcji)

1. `OPEN_QUESTIONS_FROM_CODEX` — Codex pyta, Claude odpowiada (Cx → C, odpowiedź C → Cx)
2. `NOTES_FROM_CLAUDE` — Claude pisze proaktywnie, Codex potwierdza (C → Cx, potwierdzenie Cx → C)
3. `ACTIVE_FOR_CLAUDE_REVIEW` — raporty Codex po wykonanym zadaniu (Cx → C)
4. `RESOLVED_BY_CLAUDE` — decyzje Claude po audycie (C → Cx, historia)
5. `ARCHIVE` — wpisy zamknięte i historyczne

```md
# CODEX_SUGGESTIONS

<!-- LAST_CLAUDE_REVIEW: YYYY-MM-DD — krótka nota -->

## OPEN_QUESTIONS_FROM_CODEX

### YYYY-MM-DD HH:MM — task_id / temat

#### Status

open / answered / obsolete

#### Pytanie

...

#### Kontekst

...

#### Typ oczekiwanej odpowiedzi

decyzja techniczna / doprecyzowanie scope / wybór z opcji A/B/C / inne

#### Odpowiedź Claude (wypełnia Claude)

- data: YYYY-MM-DD HH:MM
- decyzja: ...
- uzasadnienie: ...
- wymagana akcja Codex: ...

---

## NOTES_FROM_CLAUDE

### YYYY-MM-DD HH:MM — task_id / temat

#### Status

new / read / obsolete

#### Treść

...

#### Powód (dlaczego nie w briefie)

doprecyzowanie w trakcie / heads-up z innego audytu / korekta wcześniejszej decyzji / informacja kontekstowa

#### Wymagana akcja Codex (opcjonalnie)

...

#### Potwierdzenie Codex (wypełnia Codex)

- data: YYYY-MM-DD HH:MM
- status: zauważone i uwzględnione / nieaktualne / zastosowane w zadaniu X

---

## ACTIVE_FOR_CLAUDE_REVIEW

### YYYY-MM-DD - nazwa zadania

#### Status

Wykonane / Częściowo wykonane / Zablokowane

#### Wykonane zmiany

- ...

#### Zmienione pliki

- ...

#### Problemy wykryte podczas pracy

- ...

#### Ryzyka

- ...

#### Sugestie dla Claude

- ...

#### Gotowe rozwiązania zauważone przez Codex

- ...

#### Doc drift

- ...

#### Testy i komendy kontrolne

Uruchomiono:

- ...

Nie uruchomiono:

- ...

Powód:

- ...

---

## RESOLVED_BY_CLAUDE

### YYYY-MM-DD - nazwa zadania

- Status: accepted / rejected / moved_to_backlog / done / requires_user_decision
- Decyzja Claude: ...

---

## ARCHIVE

Starsze wpisy niewymagające decyzji. Mogą być skrócone do jednego zdania podsumowującego.
```

Claude po analizie istotnego wpisu w `ACTIVE_FOR_CLAUDE_REVIEW` lub `OPEN_QUESTIONS_FROM_CODEX` musi oznaczyć decyzję:

- `accepted`
- `rejected`
- `moved_to_backlog`
- `done`
- `requires_user_decision`

Nie wolno zostawiać starych sugestii ani pytań jako wiecznie aktywnych.

---

## 11.10. Pełna dwukierunkowa komunikacja przez `CODEX_SUGGESTIONS.md`

`CODEX_SUGGESTIONS.md` służy jako pełny, asynchroniczny kanał komunikacji między agentami. Poza standardowym cyklem brief → raport → decyzja, dostępne są dwa dodatkowe kanały: pytania Codex do Claude i proaktywne notatki Claude do Codex.

### 11.10.1. Kiedy Codex używa `OPEN_QUESTIONS_FROM_CODEX`

Codex powinien dodać wpis, gdy:

- brief jest niejednoznaczny, ale nieblokujący (nie kwalifikuje się do sekcji 11.5 `DOC-SYNC-BLOCKED`)
- Codex zauważył lepsze gotowe rozwiązanie i chce decyzji Claude przed wdrożeniem
- Codex wykonał zadanie częściowo i potrzebuje doprecyzowania na kolejną iterację
- Codex zidentyfikował ryzyko niewskazane w briefie i potrzebuje potwierdzenia kierunku
- Codex chce zaproponować rozszerzenie scope (po wykonaniu właściwego zadania, nie zamiast)

Codex używa `OPEN_QUESTIONS_FROM_CODEX` zamiast `DOC-SYNC-BLOCKED` zawsze, gdy pytanie **nie wymaga zatrzymania całej pracy**. `DOC-SYNC-BLOCKED` pozostaje zarezerwowane dla sytuacji opisanych w 11.5 (brak jednoznacznego aktywnego zadania, sprzeczne briefy itp.).

### 11.10.2. Kiedy Claude używa `NOTES_FROM_CLAUDE`

Claude powinien dodać wpis, gdy:

- audytuje inny obszar i znalazł istotne ryzyko dla aktywnego zadania Codex
- chce skorygować lub doprecyzować już aktywny brief bez przepisywania całego briefu
- chce przekazać heads-up bez zmiany scope (np. „uwaga, na serwerze obowiązuje ograniczenie X")
- ma istotną decyzję podjętą w trakcie audytu innego obszaru, która wpływa na styl pracy Codex

Jeżeli korekta zmienia scope aktywnego zadania, Claude musi zaktualizować `BRIEF_CODEX.md` zamiast (lub oprócz) dodawania notatki.

### 11.10.3. Obowiązki Claude w cyklu dwukierunkowym

Przy każdym wejściu w sesję Claude:

1. Pierwsze działanie — sprawdzić `OPEN_QUESTIONS_FROM_CODEX`. Odpowiedzi blokują dalszą pracę Codex i mają najwyższy priorytet.
2. Drugie działanie — sprawdzić `ACTIVE_FOR_CLAUDE_REVIEW` jak dotychczas (per 10.5).
3. Po udzieleniu odpowiedzi w `OPEN_QUESTIONS_FROM_CODEX` — przenieść wpis do `ARCHIVE` (z odpowiedzią) i ewentualnie zaktualizować `BRIEF_CODEX.md`, jeżeli decyzja zmienia scope.
4. Okresowo (np. po zamknięciu zadania) — przeglądnąć `NOTES_FROM_CLAUDE` z poprzednich sesji, oznaczyć jako `obsolete` te które straciły aktualność, przenieść wykorzystane do `ARCHIVE`.

### 11.10.4. Obowiązki Codex w cyklu dwukierunkowym

Przy każdym wejściu w sesję Codex:

1. Pierwsze działanie — sprawdzić `NOTES_FROM_CLAUDE` ze statusem `new`. Notatki dotyczące aktywnego zadania mają być uwzględnione w bieżącej pracy.
2. Po uwzględnieniu notatki — wypełnić blok `Potwierdzenie Codex` ze statusem `zauważone i uwzględnione` lub `zastosowane w zadaniu X`.
3. Jeżeli notatka jest już nieaktualna (np. dotyczyła poprzedniego briefu) — wypełnić `Potwierdzenie Codex` ze statusem `nieaktualne` i uzasadnieniem.
4. Pytania dodane do `OPEN_QUESTIONS_FROM_CODEX` w poprzedniej sesji bez odpowiedzi — Codex nie kontynuuje pracy zależnej od tej decyzji, ale może wykonywać zadania niezależne.

### 11.10.5. Cykl życia wpisu

- `OPEN_QUESTIONS_FROM_CODEX`: `open` → `answered` (po odpowiedzi Claude) → `ARCHIVE`
- `NOTES_FROM_CLAUDE`: `new` → `read` (po potwierdzeniu Codex) → `ARCHIVE` lub `obsolete`
- `ACTIVE_FOR_CLAUDE_REVIEW`: nowy wpis → audyt Claude → `RESOLVED_BY_CLAUDE` → okresowo do `ARCHIVE`
- `RESOLVED_BY_CLAUDE`: trafia po decyzji Claude; przenoszony do `ARCHIVE` okresowo (czystka co kilka sesji)

### 11.10.6. Zakazy

- Codex nie używa `OPEN_QUESTIONS_FROM_CODEX` do pytań, które kwalifikują się do `DOC-SYNC-BLOCKED` (11.5) — tam wymagana jest blokada pracy.
- Codex nie używa `OPEN_QUESTIONS_FROM_CODEX` jako pretekstu do nieukończenia briefu — pytania dotyczą kolejnej iteracji, nie unikania aktualnego zakresu.
- Claude nie używa `NOTES_FROM_CLAUDE` jako zastępstwa briefu — jeżeli zmiana wymaga znaczącej modyfikacji scope, brief musi być przepisany.
- Żaden agent nie usuwa wpisu drugiego agenta bez zgody — przeniesienie do `ARCHIVE` to nie usunięcie, tylko zamknięcie.

---

# 12. Workflow pracy agentów

## 12.1. Krok 1 - analiza

Claude analizuje:

- zadanie użytkownika
- aktualny stan projektu
- dokumentację roboczą
- feedback Codex
- ryzyka techniczne
- zgodność z Laravel, Statamic i Orion
- dostępne gotowe rozwiązania, jeżeli zadanie dotyczy nowej większej funkcjonalności

## 12.2. Krok 2 - analiza gotowych rozwiązań

Jeżeli zadanie dotyczy nowej większej funkcjonalności, Claude wykonuje analizę:

- natywne Laravel
- natywne Statamic
- mechanizmy Orion
- addony Statamic
- paczki Composer
- paczki npm
- rozwiązanie autorskie

Claude porównuje opcje i zapisuje rekomendację.

## 12.3. Krok 3 - brief

Claude przygotowuje `BRIEF_CODEX.md`.

Brief musi być konkretny, ograniczony zakresem i możliwy do przetestowania.

Jeżeli zadanie dotyczy nowej większej funkcjonalności, brief musi zawierać analizę gotowych rozwiązań i rekomendację.

Przy aktywacji briefu Claude jednocześnie aktualizuje:

- `PROJECT_STATUS_CODEX.md`
- `CLAUDE_MEMORY.md`

## 12.4. Krok 4 - implementacja

Codex wykonuje zadanie zgodnie z `BRIEF_CODEX.md`.

Codex nie rozszerza samodzielnie zakresu zadania.

Codex nie instaluje nowych pakietów bez decyzji Claude lub użytkownika.

Jeżeli dokumentacja ma rozjazd, ale `BRIEF_CODEX.md` jest jednoznaczny, Codex wykonuje brief i zapisuje `Doc drift`.

Przed startem Codex sprawdza `NOTES_FROM_CLAUDE` ze statusem `new` (per 11.10.4). Jeżeli pojawi się niejednoznaczność nieblokująca lub potrzeba decyzji na kolejną iterację, Codex eskaluje przez `OPEN_QUESTIONS_FROM_CODEX` (per 11.10.1) zamiast czekać na sesję Claude.

## 12.5. Krok 5 - feedback Codex

Codex aktualizuje `CODEX_SUGGESTIONS.md`.

Wpisuje wykonane zmiany, problemy, ryzyka, testy, sugestie oraz ewentualne gotowe rozwiązania, które zauważył podczas pracy.

## 12.6. Krok 6 - audyt Claude

Przed audytem zmian Claude sprawdza `OPEN_QUESTIONS_FROM_CODEX` (per 11.10.3) — odpowiedzi na otwarte pytania mają najwyższy priorytet i mogą zmienić kierunek dalszej pracy.

Claude analizuje:

- zmiany wykonane przez Codex
- zgodność z briefem
- jakość techniczną
- wpływ na Laravel
- wpływ na Statamic
- wpływ na Orion
- wpływ na CMS
- wpływ na SEO
- wpisy w `CODEX_SUGGESTIONS.md` (sekcja `ACTIVE_FOR_CLAUDE_REVIEW` + odpowiedzi na `OPEN_QUESTIONS_FROM_CODEX` + potwierdzenia w `NOTES_FROM_CLAUDE`)
- wpisy w `CONCLUSIONS_CODEX.md`, jeżeli zostały dodane

## 12.7. Krok 7 - decyzja

Claude podejmuje jedną z decyzji:

- akceptuje zadanie
- zleca poprawki
- zmienia kierunek techniczny
- wybiera gotowe rozwiązanie zamiast autorskiego
- wybiera rozwiązanie autorskie po odrzuceniu gotowych opcji
- dzieli zadanie na mniejsze kroki
- blokuje zmianę jako zbyt ryzykowną

## 12.8. Krok 8 - aktualizacja dokumentacji

Claude aktualizuje:

- `PROJECT_STATUS_CODEX.md`
- `CLAUDE_MEMORY.md`
- `CHANGE-LOG.md` — **obowiązkowo**
- `BRIEF_CODEX.md`, jeżeli powstaje kolejne zadanie
- `server_deploy/DEPLOYMENT.md`, jeżeli dotyczy zmian na serwerze

---

# 13. Zasady Statamic multisite i tłumaczeń

Projekt używa natywnego Statamic multisite.

Aktualny model:

- `pl` pod `/`
- `en` pod `/en/`

Należy rozdzielać dwa typy tłumaczeń:

## 13.1. Content translation

Dotyczy:

- stron
- wpisów
- builder content
- globals
- navigation
- kolekcji
- wpisów CMS

Aktualny mechanizm:

- Statamic multisite
- Magic Translator
- DeepL

## 13.2. Frontend string translation

Dotyczy:

- napisów interfejsu motywu
- przycisków
- placeholderów
- komunikatów
- napisów typu `Search`, `Submit`, `Next Post`, `Share`, `404`

Docelowy mechanizm:

- `lang/pl/ui.php`
- `lang/en/ui.php`
- `{{ trans:ui.* }}` w Antlers

Nie należy mieszać content translation ze string translation.

Magic Translator służy do treści CMS, a nie do hardcoded stringów w widokach.

Dla frontend string translation nie należy szukać pluginu jako podstawy, jeżeli standardowe pliki językowe Laravel / Statamic spełniają wymagania.

---

# 14. Zasady pracy z Magic Translator i DeepL

Magic Translator działa przez kolejkę.

Po zmianie `DEEPL_API_KEY` należy wykonać:

```bash
php artisan config:clear
php artisan queue:restart
```

Jeżeli tłumaczenia tworzą lokalizacje, ale treść pozostaje nietłumaczona, Codex powinien sprawdzić:

- kolejkę
- logi Laravel
- poprawność klucza DeepL
- konfigurację `config/statamic/magic-translator.php`
- czy worker kolejki działa
- czy lokalizacje nie dziedziczą pustych danych przez `origin`

Nie należy diagnozować problemów tłumaczenia wyłącznie na podstawie wyglądu frontendu, ponieważ Statamic może pokazywać fallback z origin content.

---

# 15. Zasady pracy z origin, globals i localizable

W projekcie były już problemy z:

- `origin`
- globals
- localizable fields
- edytowalnością pól w CP
- asset fields
- kolizją pola `type` w builderze

Dlatego przy zadaniach dotyczących Statamic localization Codex powinien zawsze sprawdzić realny stan plików przed masową zmianą.

Szczególnie należy uważać na:

- `content/globals/*.yaml`
- `content/globals/pl/*.yaml`
- `content/globals/en/*.yaml`
- `content/collections/pages/pl`
- `content/collections/pages/en`
- fieldsety buildera
- blueprinty
- lokalizacje entry
- relacje `origin`

Po zmianach w content modelu, globals albo localization metadata należy rozważyć:

```bash
php artisan statamic:stache:refresh
php artisan cache:clear
php artisan view:clear
```

Jeżeli problem dotyczy CP, należy po zmianach zweryfikować zachowanie w panelu, a nie tylko w plikach.

---

# 16. Zasady pracy z nawigacją i menu

Przy pracy z menu należy najpierw sprawdzić natywne możliwości Statamic.

Nie należy od razu wdrażać własnego pola lub własnego renderera, jeżeli Statamic już obsługuje dany typ linkowania.

Przy zadaniach dotyczących menu Codex powinien sprawdzić:

- `resources/blueprints/navigation/main.yaml`
- `content/trees/navigation/pl/main.yaml`
- `content/trees/navigation/en/main.yaml`
- `resources/views/partials/header-1.antlers.html`
- dostępne kolekcje w `content/collections/`

Docelowy UX dla zwykłych pozycji menu powinien pozwalać na wybór konkretnego wpisu z kolekcji, bez ręcznego przepisywania URL.

Jednocześnie należy zachować istniejące mechanizmy megamenu, np. listy projektów i usług, jeżeli nadal są używane przez motyw Orion.

Jeżeli natywny mechanizm `Entry` / `URL` / `Term` działa w CP i obejmuje wymagane kolekcje, Codex powinien udokumentować workflow i nie zmieniać kodu.

Jeżeli natywny mechanizm nie działa albo jest ograniczony, Codex powinien opisać problem w `CODEX_SUGGESTIONS.md`, a Claude powinien przygotować osobny brief implementacyjny z analizą dostępnych rozwiązań.

---

# 17. Zasady Laravel

W projekcie należy stosować dobre praktyki Laravel.

Najważniejsze zasady:

- kontrolery powinny być możliwie cienkie
- walidacja powinna być w Form Request, jeżeli zadanie tego wymaga
- logika biznesowa powinna być poza kontrolerem
- konfiguracja powinna być w plikach `config`
- nie należy używać `env()` poza plikami konfiguracyjnymi
- nie należy wykonywać zapytań w widokach
- należy unikać duplikacji kodu
- należy używać Eloquent w czytelny i przewidywalny sposób
- należy unikać N+1 query problem
- należy używać named routes tam, gdzie ma to sens
- należy stosować autoryzację, policies lub gates tam, gdzie jest to potrzebne
- należy dbać o bezpieczeństwo danych wejściowych
- należy unikać hardcodowania wartości, które powinny być konfigurowalne
- należy zachowywać spójną strukturę katalogów
- należy pisać kod prosty i zrozumiały
- należy używać gotowych mechanizmów Laravel, zanim powstanie własne rozwiązanie

---

# 18. Zasady Statamic

W projekcie należy stosować dobre praktyki Statamic.

Najważniejsze zasady:

- treści powinny być modelowane w sposób wygodny dla redaktora
- kolekcje powinny mieć logiczną strukturę
- blueprinty powinny być czytelne i spójne
- fieldsety powinny być wykorzystywane tam, gdzie pozwalają uniknąć duplikacji
- pola powinny mieć zrozumiałe nazwy i instrukcje
- treści edytowalne nie powinny być hardcodowane w szablonach
- szablony powinny zawierać jak najmniej logiki
- należy korzystać z natywnych mechanizmów Statamic, zanim powstanie własne rozwiązanie
- należy uważać na wydajność przy listach, relacjach i dynamicznych zapytaniach
- należy dbać o strukturę SEO
- należy dbać o poprawne tytuły, opisy, slugi i dane meta
- należy zachować spójność między blueprintami, kolekcjami i widokami
- przy zmianach multisite zawsze sprawdzać `origin`, `localizable` i fallback treści
- przed tworzeniem własnego modułu CMS należy sprawdzić, czy istnieje natywny mechanizm Statamic lub stabilny addon

---

# 19. Zasady pracy z motywem Orion

Projekt `skalisty-orion` opiera się na motywie Orion.

Orion należy traktować jako aktualną bazę projektu.

Nie wolno bez potrzeby usuwać ani przepisywać mechanizmów Oriona.

Zasady:

- przed zmianą pliku motywu należy sprawdzić jego rolę w projekcie
- nie należy usuwać elementów motywu bez analizy
- lepiej rozszerzać strukturę niż ją niszczyć
- zmiany powinny być kompatybilne z Laravel 13 i Statamic 6
- jeżeli element motywu jest niezgodny z aktualnym stackiem, należy zaproponować bezpieczną adaptację
- jeżeli motyw wymusza złe praktyki, należy opisać problem w dokumentacji roboczej
- decyzję o większym odejściu od struktury Orion powinien podjąć Claude po audycie
- nie wolno wracać do starego modelu ręcznej migracji HTML jako podstawy projektu
- przed budowaniem własnej funkcjonalności należy sprawdzić, czy Orion nie ma już podobnego mechanizmu

---

# 20. Testowanie i komendy kontrolne

Codex powinien po każdej istotnej zmianie uruchomić odpowiednie testy lub komendy kontrolne, jeżeli środowisko na to pozwala.

Przykładowe komendy:

```bash
composer test
php artisan test
php artisan route:list
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan statamic:stache:refresh
php please search:update --all
npm run build
npm run dev
```

Nie każda komenda musi być uruchamiana po każdym zadaniu.

Codex powinien dobrać komendy do zakresu zmiany.

Przykłady:

- zmiana backendu Laravel - `php artisan test`
- zmiana tras - `php artisan route:list`
- zmiana configu - `php artisan config:clear`
- zmiana widoków - `php artisan view:clear`
- zmiana Statamic content model - `php artisan statamic:stache:refresh`
- zmiana wyszukiwarki Statamic - `php please search:update --all`
- zmiana frontendu - `npm run build`
- zmiana DeepL API key - `php artisan config:clear` oraz `php artisan queue:restart`

Jeżeli testów nie da się uruchomić, Codex musi zapisać powód w `CODEX_SUGGESTIONS.md`.

---

# 21. Uruchamianie projektu lokalnie

Frontend działa lokalnie pod:

- `http://127.0.0.1:8001`

Panel CP działa pod:

- `http://127.0.0.1:8001/cp`

Preferowane uruchomienie aplikacji:

```bash
php artisan serve --host=127.0.0.1 --port=8001
```

Kolejka dla Magic Translator:

```bash
php artisan queue:work
```

Build assetów:

```bash
npm run build
```

Tryb developerski assetów:

```bash
npm run dev
```

Nie należy mieszać `localhost` i `127.0.0.1`, ponieważ może to powodować problemy z sesją, CP i toolbarem.

---

# 22. Git i repozytorium

## 22.1 Lokalizacja repozytorium

Od 2026-06-18 repozytorium Git jest prowadzone **wewnątrz katalogu aplikacji**:

- Lokalnie: `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/`
- Remote (GitHub): `https://github.com/5k18a/skalisty-laravel.git`
- Branch główny: `main`

Katalog workspace `/home/pestycyd/Dokumenty/Skalisty-New-2/` **nie jest już root git repo** — pliki tam poza `skalisty-orion/` są nieaktualne.

## 22.2 Workflow commitów i pushów

**Zasada nadrzędna:** Git jest prowadzony zawsze — każda zamknięta zmiana ląduje w historii.

**Kto commituje — zasada bezwzględna:**
- **Commity tworzy wyłącznie Claude** — po audycie i akceptacji pracy Codexa.
- **Codex NIE commituje** ani NIE pushuje — jego zadaniem jest dostarczenie kodu, nie zarządzanie historią Git.
- Wyjątek: użytkownik może wyraźnie polecić Codexowi wykonanie commita (np. "zacommituj to"). Tylko wtedy Codex może to zrobić.

**Kiedy commitować:**
- Claude commituje po każdym zakończonym i zaaudytowanym zadaniu Codexa
- Claude commituje własne zmiany dokumentacji i plików roboczych na bieżąco
- Nie czekać na koniec sesji z commitami — commit bezpośrednio po akceptacji

**Kiedy pushować:**
- Na koniec każdej sesji roboczej Claude
- Przed długą przerwą w pracy
- Po każdym istotnym milestone'ie

**Format wiadomości commita:**
```
TYP: Krótki opis (maks. 72 znaki)

[Opcjonalny dłuższy opis po pustej linii]
```
Typy: `feat` (nowa funkcja), `fix` (poprawka), `docs` (dokumentacja), `config` (konfiguracja), `content` (treści CMS), `sync` (synchronizacja z serwerem), `chore` (prace porządkowe)

Przykłady:
```
feat: Dodaj sekcję icon_box_with_text do page buildera
docs: Aktualizuj AGENTS.md — workflow Git i canonical docs
sync: Importuj nowe projekty i blueprint z dev.skalisty.pl
config: Dodaj prefixes iconify (tabler, heroicons, mdi...)
```

## 22.3 Co trafia do Git

W repozytorium trzymamy **wszystko poza wyjątkami** zdefiniowanymi w `.gitignore`:

- Kod aplikacji (PHP, Antlers, Blade, JS, CSS)
- Pliki konfiguracyjne (YAML blueprints, fieldsets, collections)
- Treści CMS (`content/`)
- Assets (`public/assets/`, `public/vendor/` małe pliki)
- Dokumentacja robocza agentów (`AGENTS.md`, `BRIEF_CODEX.md`, `CHANGE-LOG.md` itp.)
- `composer.json`, `composer.lock`, `package.json`, `package-lock.json`

**Nigdy nie commitować (chronione przez `.gitignore`):**
- `.env` — klucze aplikacji, kredencjały bazy danych
- `ADMIN_ACCESS.txt` — hasło administratora CMS
- `server_deploy/SERWER_DOSTEP.txt` — dane dostępu do serwera
- `/users/*.yaml` — dane użytkowników Statamic (hashe haseł)
- `/vendor/`, `/node_modules/` — zależności (regenerowalne)
- `/storage/*.key` — klucze szyfrowania

## 22.4 Zasady bezpieczeństwa Git dla agentów

Codex i Claude nie mogą:

- zmieniać konfiguracji Git bez wyraźnego polecenia
- zmieniać brancha bez wyraźnego polecenia (pracujemy na `main`)
- usuwać historii Git (`reset --hard`, `force push` do main — wymaga zgody użytkownika)
- commitować jakichkolwiek sekretów, haseł, kluczy API
- pushować bez wiedzy użytkownika (push wymaga potwierdzenia lub jest zaplanowany na koniec sesji)

---

# 23. Zasady bezpieczeństwa

Agenci nie mogą:

- wpisywać sekretów do repozytorium
- publikować kluczy API
- zmieniać plików `.env` bez wyraźnego polecenia
- usuwać mechanizmów bezpieczeństwa
- wyłączać walidacji bez uzasadnienia
- wyłączać autoryzacji bez uzasadnienia
- zmieniać konfiguracji produkcyjnej bez analizy
- instalować nieznanych pakietów bez sprawdzenia zasadności
- ignorować błędów bezpieczeństwa
- commitować `ADMIN_ACCESS.txt`
- commitować plików użytkowników Statamic z hashami haseł

Pliki takie jak:

- `ADMIN_ACCESS.txt`
- `/users/*.yaml`
- `.env`

muszą być traktowane jako wrażliwe.

Jeżeli agent wykryje ryzyko bezpieczeństwa, powinien zapisać je w dokumentacji roboczej i zgłosić jako priorytet.

---

# 24. Zasady dotyczące zależności

Nowe pakiety Composer lub npm mogą być dodane tylko wtedy, gdy:

- są rzeczywiście potrzebne
- rozwiązują konkretny problem
- są utrzymywane
- są zgodne z aktualną wersją Laravel, Statamic i PHP
- nie dublują funkcji dostępnych natywnie
- nie dublują funkcji dostępnych w Orionie
- nie zwiększają niepotrzebnie złożoności projektu
- przeszły analizę gotowych rozwiązań
- zostały zaakceptowane przez Claude lub użytkownika

Codex nie powinien instalować nowych pakietów bez wyraźnego briefu albo bez zapisania mocnego uzasadnienia w `CODEX_SUGGESTIONS.md`.

Claude powinien każdorazowo ocenić zasadność nowej zależności.

Claude powinien porównać nową zależność z:

- mechanizmem natywnym Laravel
- mechanizmem natywnym Statamic
- mechanizmem Orion
- prostszym rozwiązaniem konfiguracyjnym
- rozwiązaniem autorskim

---

# 25. Zasady dotyczące SEO i treści

Projekt strony skalisty.pl powinien być przygotowany pod SEO.

Agenci powinni zwracać uwagę na:

- poprawne tytuły stron
- opisy meta
- przyjazne adresy URL
- strukturę nagłówków
- alt dla obrazów
- dane strukturalne, jeżeli są potrzebne
- wydajność strony
- indeksowalność treści
- możliwość edycji danych SEO w CMS
- unikanie hardcodowania treści SEO w szablonach

W Statamic dane SEO powinny być możliwe do zarządzania przez administratora tam, gdzie ma to sens.

Przed budowaniem własnego systemu SEO Claude powinien sprawdzić:

- natywne możliwości Statamic
- obecne pola SEO w Orionie
- oficjalne lub stabilne addony SEO dla Statamic
- potrzebę redirectów, sitemap, Open Graph, structured data i 404 tracking

Nie należy pisać pełnego systemu SEO od zera bez porównania gotowych rozwiązań.

---

# 26. Zasady dotyczące administratora CMS

CMS powinien być prosty w obsłudze.

Agenci powinni dbać o to, aby:

- pola miały jasne nazwy
- blueprinty były uporządkowane
- sekcje były logiczne
- redaktor nie musiał znać kodu
- powtarzalne elementy były obsługiwane przez fieldsety lub zestawy
- treści nie były rozproszone w wielu nieoczywistych miejscach
- instrukcje w panelu były pomocne, jeżeli pole może być niejasne
- struktura CMS nie wymuszała niepotrzebnej pracy ręcznej
- nawigacja mogła być zarządzana bez ręcznego przepisywania URL, o ile Statamic lub bezpieczna konfiguracja to umożliwia

Przed tworzeniem własnego panelu lub własnego modułu CP należy sprawdzić, czy Statamic ma natywny mechanizm albo stabilny addon.

---

# 27. Przykładowe obszary wymagające analizy gotowych rozwiązań

Poniższe obszary wymagają analizy gotowych rozwiązań przed wdrożeniem autorskim:

- SEO
- sitemap
- redirecty
- formularze
- antyspam
- newsletter
- wyszukiwarka
- filtrowanie wpisów
- galerie
- portfolio
- case studies
- blog
- aktualności
- wielojęzyczność
- tłumaczenia treści
- tłumaczenia stringów UI
- cookies
- analytics
- integracje CRM
- integracje e-mail marketing
- cache i performance
- image optimization
- backup
- role i uprawnienia
- workflow publikacji
- recenzje i testimonial
- mapy
- import treści
- eksport treści

Nie oznacza to, że zawsze trzeba użyć addonu.

Oznacza to, że przed pisaniem od zera trzeba wiedzieć:

- jakie rozwiązania istnieją
- co oferują
- ile kosztują
- jakie mają ryzyka
- czy są utrzymywane
- czy pasują do obecnego projektu
- czy są lepsze od implementacji autorskiej

---

# 28. Rekomendowany sposób podejmowania decyzji technicznych

Dla większej funkcjonalności Claude powinien przejść przez następujące pytania:

1. Czy Laravel ma natywny mechanizm, który rozwiązuje problem?
2. Czy Statamic ma natywny mechanizm, który rozwiązuje problem?
3. Czy Orion ma już mechanizm, który można bezpiecznie wykorzystać?
4. Czy istnieje oficjalny addon Statamic?
5. Czy istnieje stabilny addon społecznościowy?
6. Czy istnieje stabilna paczka Composer lub npm?
7. Czy gotowe rozwiązanie jest utrzymywane?
8. Czy gotowe rozwiązanie jest kompatybilne z Laravel 13, Statamic 6 i PHP 8.3?
9. Czy gotowe rozwiązanie nie utrudni pracy administratorowi?
10. Czy gotowe rozwiązanie nie pogorszy SEO?
11. Czy gotowe rozwiązanie nie pogorszy wydajności?
12. Czy gotowe rozwiązanie nie stwarza ryzyka bezpieczeństwa?
13. Czy koszt licencji jest uzasadniony?
14. Czy rozwiązanie autorskie byłoby prostsze, bezpieczniejsze i tańsze w utrzymaniu?
15. Którą ścieżkę należy zarekomendować użytkownikowi?

---

# 29. Dokumentacja deploymentu

Plik:

- `server_deploy/DEPLOYMENT.md`

jest głównym źródłem prawdy o stanie serwera produkcyjnego i staging.

Każda zmiana wprowadzona na serwerze, np. `dev.skalisty.pl` albo innym środowisku zdalnym, musi być udokumentowana w `server_deploy/DEPLOYMENT.md`.

Dotyczy to w szczególności:

- zmian w plikach konfiguracyjnych na serwerze
- zmian w `.env`
- zmian w `.htaccess`
- zmian w `php.ini`
- ustawień subdomeny
- nowych katalogów lub plików tworzonych ręcznie przez SSH
- uruchamianych komend `artisan`, które zmieniają stan
- migracji
- czyszczenia cache
- zmian uprawnień do plików i katalogów
- aktualizacji zależności na serwerze
- hotfixów i obejść zastosowanych bezpośrednio na serwerze
- zmian w konfiguracji hostingu
- zmian wersji PHP
- zmian document root
- zmian certyfikatu SSL

Claude ma obowiązek zaktualizować `server_deploy/DEPLOYMENT.md` w tej samej sesji, w której wprowadza zmiany na serwerze.

Nie wolno odkładać tej aktualizacji na później.

Jeżeli zmianę na serwerze wprowadza użytkownik samodzielnie, powinien poinformować Claude o zakresie zmian, żeby dokumentacja mogła zostać uzupełniona.

---

# 30. Minimalny format `PROJECT_STATUS_CODEX.md`

```md
# PROJECT_STATUS_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: YYYY-MM-DD-HHMM
active_task_id: ...
active_task_name: ...
active_task_status: active / none / blocked / done
active_task_source: BRIEF_CODEX.md
last_sync: YYYY-MM-DD HH:MM Europe/Warsaw
last_synced_by: Claude
next_after_active: ...
<!-- PROJECT_SYNC_END -->

## Wykonane

### Obszar

- ...

## W trakcie

### active_task_id - active_task_name

- Status: ...
- Źródło wykonawcze: `BRIEF_CODEX.md`
- Cel: ...
- Ryzyka: ...

## Do wykonania po aktywnym zadaniu

### 1. Nazwa zadania

- ...

## Zablokowane

### 1. Nazwa zadania

- Powód blokady: ...

## Status operacyjny

- Frontend: ...
- CP: ...
- Uwagi: ...
```

---

# 31. Minimalny format `CLAUDE_MEMORY.md`

```md
# CLAUDE_MEMORY.md

<!-- PROJECT_SYNC_START -->
state_version: YYYY-MM-DD-HHMM
active_task_id: ...
active_task_name: ...
active_task_status: active / none / blocked / done
active_task_source: BRIEF_CODEX.md
last_sync: YYYY-MM-DD HH:MM Europe/Warsaw
last_synced_by: Claude
next_after_active: ...
<!-- PROJECT_SYNC_END -->

## Aktualny stan projektu

...

## Aktualne zadanie aktywne

...

## Kluczowe decyzje

...

## Aktualna architektura

...

## Otwarte zadania

...

## Otwarte pytania

...

## Ryzyka

...

## Ostatni brief dla Codex

...

## Ostatnia analiza gotowych rozwiązań

...

## Ostatni feedback Codex

...

## Następne kroki

...
```

---

# 32. Minimalny format `codex-memory.md`

```md
# codex-memory.md

## Projekt

...

## Aktualny stan techniczny

...

## Co zostało wykonane

...

## Ważne pliki

...

## Otwarte tematy

...

## Notatki operacyjne

...

## Sugestie dla kolejnych zadań

...

## Gotowe rozwiązania warte rozważenia

...
```

---

# 33. Minimalny format `CONCLUSIONS_CODEX.md`

```md
# CONCLUSIONS_CODEX.md

## Aktualne wnioski

### 1. Wniosek

- ...

## Wnioski robocze na przyszłość

### 1. Obszar

- ...

## Gotowe rozwiązania warte rozważenia

### 1. Obszar

- Rozwiązanie: ...
- Powód: ...
- Ryzyko: ...

## Rekomendowana kolejność dalszych prac

1. ...
2. ...
3. ...
```

---

# 34. Obowiązkowy `CHANGE-LOG.md`

`CHANGE-LOG.md` jest prowadzony **bezwzględnie** przez Claude po każdym zakończonym zadaniu lub istotnej zmianie. Nie jest opcjonalny.

Claude aktualizuje `CHANGE-LOG.md` w tej samej operacji co `PROJECT_STATUS_CODEX.md` i `CLAUDE_MEMORY.md` przy zamykaniu zadania.

Codex nie aktualizuje `CHANGE-LOG.md` — to wyłączny obowiązek Claude jako audytora.

Format:

```md
# CHANGE-LOG.md

## YYYY-MM-DD

### Dodano

- ...

### Zmieniono

- ...

### Naprawiono

- ...

### Usunięto

- ...

### Decyzje techniczne

- ...

### Analiza gotowych rozwiązań

- ...

### Uwagi

- ...
```

---

# 35. Zasady końcowe

Claude odpowiada za:

- jakość decyzji
- audyt
- kierunek techniczny
- briefy dla Codex
- ocenę sugestii Codex
- analizę gotowych rozwiązań
- rekomendację: gotowe rozwiązanie czy implementacja autorska
- dokumentację roboczą
- spójność projektu
- synchronizację `BRIEF_CODEX.md`, `PROJECT_STATUS_CODEX.md` i `CLAUDE_MEMORY.md`

Codex odpowiada za:

- wykonanie briefu
- jakość kodu
- ograniczenie zmian do zakresu zadania
- testowanie
- zgłaszanie problemów
- zgłaszanie gotowych rozwiązań, jeżeli brief je pominął
- zgłaszanie `Doc drift`
- aktualizację `CODEX_SUGGESTIONS.md`
- aktualizację `codex-memory.md`, jeżeli brief tego wymaga
- aktualizację `CONCLUSIONS_CODEX.md`, jeżeli brief tego wymaga

Żaden agent nie powinien działać poza swoją rolą bez jasnego uzasadnienia.

W przypadku konfliktu między szybkością wykonania a jakością techniczną należy wybrać jakość techniczną.

W przypadku konfliktu między rozwiązaniem własnym a natywnym mechanizmem Laravel lub Statamic należy najpierw rozważyć mechanizm natywny.

W przypadku konfliktu między pluginem a natywnym mechanizmem Laravel lub Statamic należy najpierw rozważyć mechanizm natywny.

W przypadku konfliktu między pluginem a prostym rozwiązaniem konfiguracyjnym należy wybrać rozwiązanie prostsze, jeżeli spełnia wymagania.

W przypadku konfliktu między motywem Orion a stabilnością projektu należy wybrać stabilność projektu.

W przypadku konfliktu między pamięcią rozmowy a aktualnym stanem plików projektu należy wybrać aktualny stan plików projektu.

W przypadku konfliktu między `BRIEF_CODEX.md`, `PROJECT_STATUS_CODEX.md` i `CLAUDE_MEMORY.md`, a `BRIEF_CODEX.md` zawiera jedno aktywne i jednoznaczne zadanie, aktywnym źródłem prawdy dla Codex pozostaje `BRIEF_CODEX.md`.

W przypadku nowej większej funkcjonalności nie wolno zaczynać od pisania kodu od zera bez analizy gotowych rozwiązań.

Celem pracy agentów jest nie tylko wykonanie pojedynczych zadań, ale prowadzenie projektu w sposób, który będzie możliwy do utrzymania i rozwoju w przyszłości.

---

# 36. MCP Serwery — rozszerzenia Claude Code

W projekcie zainstalowane są dwa MCP serwery rozszerzające możliwości Claude. Claude powinien aktywnie z nich korzystać zamiast prosić użytkownika o screenshoty lub samodzielnie szukać dokumentacji.

## 36.1 Playwright MCP (`@playwright/mcp` — Microsoft)

**Do czego służy:** Automatyzacja przeglądarki — Claude może samodzielnie otwierać strony, robić screenshoty, klikać elementy, sprawdzać responsywność i debugować układ CSS/HTML.

**Kiedy używać:**
- Po każdej zmianie CSS/Tailwind — zamiast prosić użytkownika o screenshot, Claude robi go sam
- Weryfikacja responsywności na breakpointach (mobile/tablet/desktop/xl/1xl/2xl)
- Testowanie interakcji: menu mobilne, modale, lightbox, galeria
- Sprawdzanie czy logo, fonty, kolory wyświetlają się poprawnie
- Audyt layoutu po wdrożeniu nowego bloku page buildera

**Jak uruchomić stronę przed testami:**
```bash
# Strona musi działać na lokalnym serwerze:
php artisan serve --host=127.0.0.1 --port=8001
# URL: http://127.0.0.1:8001
```

**Zasada:** Claude nie powinien kończyć zadania frontendowego bez wizualnej weryfikacji przez Playwright. Jeśli serwer nie działa, Claude pyta użytkownika o uruchomienie.

## 36.2 Context7 MCP (Upstash)

**Do czego służy:** Dostarcza aktualną, wersjonowaną dokumentację dla bibliotek bezpośrednio do kontekstu — eliminuje ryzyko generowania przestarzałej składni opartej na knowledge cutoffie modelu.

**Kiedy używać:**
- Tailwind CSS v4 — składnia różni się od v3 (custom properties, nowe utilities, `@import "tailwindcss"` zamiast `@tailwind`)
- Laravel 13 — nowe API, zmiany vs Laravel 11/12
- Statamic 6 — Antlers, blueprints, fieldtypes API
- Każda biblioteka gdzie wersja ma znaczenie dla składni

**Zasada:** Przy pracy z Tailwind v4 Claude powinien zawsze weryfikować składnię przez Context7, nie opierać się wyłącznie na pamięci treningowej. Szczególnie dotyczy to: konfiguracji kolorów, custom breakpointów, nowych utility classes.

## 36.3 Instalacja (jednorazowe polecenia dla użytkownika)

Jeśli MCP serwery wymagają ponownej instalacji:

```bash
# Playwright MCP
claude mcp add --transport stdio playwright -- npx -y @playwright/mcp@latest

# Context7
claude mcp add context7
```

Weryfikacja zainstalowanych serwerów:
```bash
claude mcp list
```
