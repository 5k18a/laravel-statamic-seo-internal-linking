# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-18-2350
active_task_id: none
active_task_name: Brak aktywnego zadania
active_task_status: idle
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-18 23:50 Europe/Warsaw
last_synced_by: Claude
last_closed: BUGFIX-slider-seamless-loop
next_after_active: Decyzja użytkownika — retłumaczenie Home EN lub Formularze kontaktowe
<!-- PROJECT_SYNC_END -->

---

# AKTYWNY BRIEF: BUGFIX-sticky-header-default

## Cel

Header ma być **zawsze sticky** (na desktopie i mobile), wynikając z wartości globalnej `header_type` w Statamic — niezależnie od tego czy `show_theme_switcher` jest włączony czy nie. Użytkownik wyłączył przełącznik (`show_theme_switcher: false`) i chce header sticky jako jedyne zachowanie.

---

## Diagnoza (wykonana przez Claude)

**Root cause:** `custom.js` (linie 5018–5021) inicjuje `stickyMode` z:
```javascript
let stickyMode =
  localStorage.getItem("headerType") === "sticky" ||
  $(".headers.active").val() === "sticky";
```

Gdy `show_theme_switcher = false`:
- Przyciski `.headers` **nie są renderowane** w DOM
- `$(".headers.active").val()` zwraca `undefined` → `undefined === "sticky"` = `false`
- `stickyMode = false` → header statyczny

Wartość globalna `header_type: sticky` z Statamic (`content/globals/pl/theme_settings.yaml`) jest **ignorowana przez JS**. Nie ma żadnego mechanizmu przekazania wartości server-side do JS.

Dodatkowy problem: jeśli użytkownik wcześniej odwiedził stronę gdy switcher był włączony i wybrał "static", `localStorage` zachowuje "static" — nawet gdy admin wyłączy switcher, takim użytkownikom header pozostaje statyczny.

---

## Zmiany do wykonania

### 1. `resources/views/layout.antlers.html` — linia 5

Dodaj `data-header-type` do tagu `<body>`, żeby wartość z Statamic globals była dostępna dla JS:

**Przed:**
```html
<body>
```

**Po:**
```html
<body data-header-type="{{ theme_settings:header_type }}">
```

Antlers `{{ theme_settings:header_type }}` zwróci wartość pola `header_type` z globalu `theme_settings` (aktualnie `sticky`). Atrybut jest dostępny dla JS zawsze, niezależnie od `show_theme_switcher`.

---

### 2. `public/assets/js/custom.js` — linie 5014–5066

Przepisz blok "Select the header" (od `// Select the header` do `// Select the header end`).

**Aktualna wersja (do zastąpienia):**
```javascript
  // Select the header
  const $header = $(".header");
  const $headerButtons = $(".header-options .headers");

  // Get saved header type from localStorage or fallback to active button
  let stickyMode =
    localStorage.getItem("headerType") === "sticky" ||
    $(".headers.active").val() === "sticky";

  function updateHeader() {
    if (stickyMode) {
      const scroll = $(window).scrollTop();
      if (scroll > 0) {
        $header.addClass("fixed top-0 shadow-lg sticky-header");
      } else {
        $header.removeClass("fixed top-0 shadow-lg sticky-header");
      }
    } else {
      $header.removeClass("fixed top-0 shadow-lg sticky-header");
    }
  }

  // Apply saved header type on page load
  const savedType = localStorage.getItem("headerType");
  if (savedType) {
    $headerButtons.removeClass("active");
    $headerButtons.filter("[value='" + savedType + "']").addClass("active");
    stickyMode = savedType === "sticky";
    updateHeader();
  }

  // Button click handler
  $headerButtons.on("click", function () {
    $headerButtons.removeClass("active");
    $(this).addClass("active");

    stickyMode = $(this).val() === "sticky";

    // Save selection in localStorage
    localStorage.setItem("headerType", $(this).val());

    updateHeader();
  });

  // Scroll handler
  $(window).on("scroll", function () {
    updateHeader();
  });

  // Initial check
  updateHeader();

  // Select the header end
```

**Nowa wersja:**
```javascript
  // Select the header
  const $header = $(".header");
  const $headerButtons = $(".header-options .headers");
  const switcherVisible = $headerButtons.length > 0;
  const serverHeaderType = document.body.dataset.headerType || "sticky";

  // When switcher is hidden, server value is authoritative — clear stale localStorage
  if (!switcherVisible) {
    localStorage.removeItem("headerType");
  }

  const savedType = localStorage.getItem("headerType");
  let stickyMode = savedType ? savedType === "sticky" : serverHeaderType === "sticky";

  function updateHeader() {
    if (stickyMode) {
      const scroll = $(window).scrollTop();
      if (scroll > 0) {
        $header.addClass("fixed top-0 shadow-lg sticky-header");
      } else {
        $header.removeClass("fixed top-0 shadow-lg sticky-header");
      }
    } else {
      $header.removeClass("fixed top-0 shadow-lg sticky-header");
    }
  }

  // Sync active button with saved type (only when switcher visible)
  if (switcherVisible && savedType) {
    $headerButtons.removeClass("active");
    $headerButtons.filter("[value='" + savedType + "']").addClass("active");
  }

  // Button click handler
  $headerButtons.on("click", function () {
    $headerButtons.removeClass("active");
    $(this).addClass("active");
    stickyMode = $(this).val() === "sticky";
    localStorage.setItem("headerType", $(this).val());
    updateHeader();
  });

  // Scroll handler
  $(window).on("scroll", function () {
    updateHeader();
  });

  // Initial check
  updateHeader();

  // Select the header end
```

**Co się zmieniło:**
- `serverHeaderType` — czyta `data-header-type` z `<body>` (wartość z Statamic globals)
- `switcherVisible` — sprawdza czy przyciski są w DOM
- Gdy switcher ukryty: `localStorage.removeItem("headerType")` czyści stary wybór użytkownika; `stickyMode` bierze wartość z serwera
- Gdy switcher widoczny: zachowanie identyczne z dotychczasowym (localStorage > fallback do server value)
- `updateHeader()` na starcie nie jest wywoływany dwukrotnie (usunięto redundantny blok `if (savedType)`)

---

## Czego NIE robić

- Nie zmieniać logiki `updateHeader()` — działa poprawnie
- Nie modyfikować `window.setHeaderSticky` (linie ~1364–1381) — ta funkcja jest poprawna i niezależna
- Nie zmieniać `content/globals/pl/theme_settings.yaml` — `header_type: sticky` jest już ustawione prawidłowo
- Nie zmieniać blueprintu `theme_settings.yaml` — pole `header_type` z domyślną wartością `sticky` pozostaje bez zmian

---

## Walidacja po implementacji

```bash
php artisan statamic:stache:refresh
```

Następnie w przeglądarce (lokalnie `http://127.0.0.1:8001`):
1. Upewnij się że `show_theme_switcher = false` w Globals → Theme Settings
2. Odwiedź stronę główną — header powinien być sticky (przyklejony po scrollu)
3. Sprawdź mobile (DevTools responsive mode)
4. W DevTools → Application → Local Storage → sprawdź czy `headerType` zostało usunięte
5. Sprawdź w DevTools że `<body data-header-type="sticky">` jest w HTML
6. Włącz `show_theme_switcher = true`, zrestartuj — switcher powinien działać jak wcześniej (localStorage)

---

## Commit po zakończeniu

```
fix: Sticky header domyślnie z Statamic globals — niezależnie od show_theme_switcher

- layout.antlers.html: <body data-header-type="{{ theme_settings:header_type }}">
- custom.js: stickyMode czyta data-header-type gdy switcher ukryty; czyści stale localStorage
```

---

## Ostatnio zamknięte

- `BUGFIX-slider-seamless-loop` ✅ accepted (2026-06-18)
- `FEATURE-logos-slider-with-icons` ✅ accepted (2026-06-18)
- `ICONIFY-prefix-extension` ✅ accepted (2026-06-17)
- `FEATURE-icon-box-with-text` ✅ accepted (2026-06-17)
- `ICONIFY-magic-translator-check` ✅ verified (2026-06-17)
- `FEATURE-iconify-install` ✅ accepted (2026-06-17)
- `AUDYT-2026-06-17-tasks` ✅ zamknięty przez Claude (2026-06-18)
- `SETUP-git-workflow` ✅ zamknięty przez Claude (2026-06-18)

## Następne po aktywnym

- Decyzja użytkownika: retłumaczenie Home EN lub Formularze kontaktowe
