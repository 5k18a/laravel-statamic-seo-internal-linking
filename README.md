# Skalisty Internal Links

Statamic 6 addon do automatycznego linkowania slow kluczowych w tresci CMS.

Wariant A MVP dziala w czasie renderowania przez modifier Antlers i korzysta z natywnej kolekcji Statamic `internal_links` jako storage mappingow keyword -> entry.

## Instalacja

Addon jest lokalnym pakietem Composer:

```bash
composer require skalisty/internal-links @dev
php artisan vendor:publish --tag=internal-links-blueprints --force
php artisan statamic:stache:refresh
```

W glownym projekcie musi istnieć path repository:

```json
{
    "type": "path",
    "url": "./addons/skalisty/internal-links"
}
```

## Uzycie

Addon dziala wylacznie w tresci **wpisow blogowych** (kolekcja `blogs`). Modifier `apply_internal_links` jest uzywany tylko w szablonach `blog-detail-*.antlers.html`.

Dodaj mapping w CP w kolekcji `Internal Links`:

- wybierz `target_entry`
- dodaj jedno lub wiecej slow kluczowych
- wlacz `enabled`

Nastepnie zastosuj modifier w widoku Antlers:

```antlers
{{ content | apply_internal_links }}
```

Modifier moze byc uzywany na dowolnym string/HTML output:

```antlers
{{ free_text_content | apply_internal_links }}
{{ wysiwyg_html | apply_internal_links }}
```

## Zachowanie

- Linkowane sa tylko aktywne wpisy kolekcji `internal_links` z aktualnego site.
- URL docelowy pochodzi z wybranego entry i dopasowuje sie do jezyka przez natywne URL-e Statamic.
- Istniejace linki, naglowki, figury, obrazki, iframe oraz WordPress embed comments sa ukrywane przed podmiana.
- Linkowanie jest case-insensitive i respektuje granice slow z uwzglednieniem znakow Unicode.
- Wyższy `weight` oznacza wcześniejsze przetwarzanie mappingu.

## Przyklad

Mapping:

- keyword: `akwarium`
- target entry: `sztuczna-rafa-koralowa`

Content:

```html
<h2>akwarium w naglowku</h2>
<p>akwarium w paragrafie</p>
```

Output:

```html
<h2>akwarium w naglowku</h2>
<p><a href="/oferta/sztuczna-rafa-koralowa">akwarium</a> w paragrafie</p>
```

## Blueprint

Blueprint kolekcji zawiera:

- `target_entry` - picker entries: pages, services, projects
- `keywords` - replicator slow kluczowych
- `weight` - priorytet podmiany
- `nofollow`
- `open_in_new_window`
- `enabled`

## Roadmap

- Wariant A: MVP storage + modifier + parser HTML.
- Wariant B: settings global, exclusions per entry, cron/pre-computation.
- Wariant C: logs, custom CP panel, sugestie auto-linkow, import/export.
