# Theme Switcher — przełącznik widoczności w CP ✅ ZAMKNIĘTY

Data: 2026-06-01
Status: ✅ Potwierdzone przez użytkownika

## Zakres

1. `resources/blueprints/globals/theme_settings.yaml` — dodano pole `show_theme_switcher` (toggle, default: true)
2. `resources/views/layout.antlers.html` — przycisk + sidebar otoczone `{{ theme_settings }}{{ if show_theme_switcher }}...{{ /if }}{{ /theme_settings }}`

## Kluczowy wniosek

`default: true` w blueprincie NIE zapisuje wartości do istniejących plików danych globals — działa tylko dla nowych wpisów. Dla istniejących globals wartość `show_theme_switcher: false` dopisana ręcznie do `content/globals/pl/theme_settings.yaml`.

Składnia warunku dla pola globala: `{{ theme_settings }}{{ if show_theme_switcher }}...{{ /if }}{{ /theme_settings }}` (bezpieczniejsze niż `{{ if {theme_settings:show_theme_switcher} }}`).
