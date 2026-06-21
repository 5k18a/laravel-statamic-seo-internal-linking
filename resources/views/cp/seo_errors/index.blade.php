@extends('statamic::layout')

@section('title', 'Błędy SEO (404)')

@section('content')
    @php
        $queryWithout = function (array $remove = []) use ($currentLocale, $currentSort, $currentOrder, $currentSearch, $currentPerPage) {
            $query = array_filter([
                'locale' => $currentLocale ?: null,
                'sort' => $currentSort !== 'last_hit_at' ? $currentSort : null,
                'order' => $currentOrder !== 'desc' ? $currentOrder : null,
                'search' => $currentSearch ?: null,
                'per_page' => $currentPerPage !== 25 ? $currentPerPage : null,
            ]);
            foreach ($remove as $k) unset($query[$k]);
            return $query;
        };

        $sortUrl = function (string $field) use ($currentSort, $currentOrder, $queryWithout) {
            $newOrder = $currentSort === $field && $currentOrder === 'asc' ? 'desc' : 'asc';
            return request()->fullUrlWithQuery(array_merge($queryWithout([]), [
                'sort' => $field,
                'order' => $newOrder,
                'page' => null,
            ]));
        };

        $sortLabel = function (string $field) use ($currentSort, $currentOrder) {
            if ($currentSort !== $field) return '';
            return $currentOrder === 'asc' ? ' ↑' : ' ↓';
        };
    @endphp

    {{-- Header --}}
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                    <path d="M12 9v4"/>
                    <path d="M12 17h.01"/>
                </svg>
            </div>
            <div>
                <h1 class="text-2xl font-bold leading-tight">Błędy SEO (404)</h1>
                <p class="text-sm text-gray-500 mt-0.5">
                    @if ($currentSearch !== '' || $currentLocale !== '')
                        Wyświetlono <span class="font-semibold">{{ $totalFiltered }}</span> z <span class="font-semibold">{{ $totalUnfiltered }}</span> wpisów
                    @else
                        <span class="font-semibold">{{ $totalUnfiltered }}</span> {{ $totalUnfiltered === 1 ? 'wpis' : ($totalUnfiltered % 10 >= 2 && $totalUnfiltered % 10 <= 4 && ($totalUnfiltered % 100 < 12 || $totalUnfiltered % 100 > 14) ? 'wpisy' : 'wpisów') }}
                    @endif
                </p>
            </div>
        </div>
    </div>

    {{-- Toolbar --}}
    <div class="bg-white border border-gray-200 rounded-lg shadow-ui-sm p-4 mb-4">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {{-- Left: search + filters --}}
            <div class="flex flex-col gap-2 sm:flex-row sm:items-end flex-1 lg:max-w-2xl">
                <form method="GET" action="{{ cp_route('seo-errors-manager.index') }}" class="flex-1 flex flex-col gap-1">
                    <label for="seo-errors-search" class="text-xs font-medium text-gray-700">Szukaj URL</label>
                    <div class="relative">
                        <input
                            type="text"
                            id="seo-errors-search"
                            name="search"
                            value="{{ $currentSearch }}"
                            placeholder="np. /oferta lub architectural"
                            class="w-full px-3 h-10 pr-10 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        >
                        @if ($currentSearch !== '')
                            <a href="{{ request()->fullUrlWithQuery(['search' => null, 'page' => null]) }}" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 no-underline text-lg leading-none">×</a>
                        @endif
                    </div>
                    <input type="hidden" name="locale" value="{{ $currentLocale }}">
                    <input type="hidden" name="sort" value="{{ $currentSort }}">
                    <input type="hidden" name="order" value="{{ $currentOrder }}">
                    <input type="hidden" name="per_page" value="{{ $currentPerPage }}">
                </form>

                <form method="GET" action="{{ cp_route('seo-errors-manager.index') }}" class="flex flex-col gap-1 sm:w-48">
                    <label for="seo-errors-locale" class="text-xs font-medium text-gray-700">Locale</label>
                    <select id="seo-errors-locale" name="locale" class="px-3 h-10 border border-gray-300 rounded-lg bg-white text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" onchange="this.form.submit()">
                        <option value="">Wszystkie</option>
                        @foreach ($sites as $site)
                            <option value="{{ $site->handle() }}" @selected($currentLocale === $site->handle())>
                                {{ $site->name() }} ({{ $site->handle() }})
                            </option>
                        @endforeach
                    </select>
                    <input type="hidden" name="search" value="{{ $currentSearch }}">
                    <input type="hidden" name="sort" value="{{ $currentSort }}">
                    <input type="hidden" name="order" value="{{ $currentOrder }}">
                    <input type="hidden" name="per_page" value="{{ $currentPerPage }}">
                </form>
            </div>

            {{-- Right: per-page + auto-prune + selected count + bulk delete --}}
            <div class="flex flex-col gap-2 sm:flex-row sm:items-end">
                <form method="GET" action="{{ cp_route('seo-errors-manager.index') }}" class="flex flex-col gap-1">
                    <label for="seo-errors-per-page" class="text-xs font-medium text-gray-700">Na stronie</label>
                    <select id="seo-errors-per-page" name="per_page" class="px-3 h-10 border border-gray-300 rounded-lg bg-white text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" onchange="this.form.submit()">
                        @foreach ($perPageOptions as $option)
                            <option value="{{ $option }}" @selected($currentPerPage === $option)>{{ $option }}</option>
                        @endforeach
                    </select>
                    <input type="hidden" name="search" value="{{ $currentSearch }}">
                    <input type="hidden" name="locale" value="{{ $currentLocale }}">
                    <input type="hidden" name="sort" value="{{ $currentSort }}">
                    <input type="hidden" name="order" value="{{ $currentOrder }}">
                </form>

                <div class="flex flex-col gap-1">
                    <label for="seo-errors-auto-prune" class="text-xs font-medium text-gray-700">
                        Auto-usuwaj
                        @if ($settings['last_pruned_at'])
                            <span class="text-gray-400 ml-1" title="Ostatnio uruchomione: {{ \Carbon\Carbon::parse($settings['last_pruned_at'])->format('Y-m-d H:i') }} ({{ $settings['last_prune_count'] }} wpisów)">
                                · {{ \Carbon\Carbon::parse($settings['last_pruned_at'])->diffForHumans() }}
                            </span>
                        @endif
                    </label>
                    <select
                        id="seo-errors-auto-prune"
                        class="px-3 h-10 border border-gray-300 rounded-lg bg-white text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        data-url="{{ cp_route('seo-errors-manager.settings') }}"
                        data-previous="{{ $settings['auto_prune_days'] }}"
                    >
                        @foreach ($autoPruneDaysOptions as $days)
                            <option value="{{ $days }}" @selected((int) $settings['auto_prune_days'] === $days)>
                                {{ $days === 0 ? 'Wyłączone' : ($days.' dni') }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-gray-700 invisible">&nbsp;</span>
                    <div class="flex items-center gap-2">
                        <button
                            type="button"
                            id="seo-errors-bulk-delete"
                            class="relative inline-flex items-center justify-center px-4 h-10 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white border border-red-700 shadow-ui-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
                            data-url="{{ cp_route('seo-errors-manager.bulk-delete') }}"
                            disabled
                        >
                            Usuń zaznaczone (<span id="seo-errors-selected-count">0</span>)
                        </button>
                        <button
                            type="button"
                            id="seo-errors-delete-all"
                            class="relative inline-flex items-center justify-center px-4 h-10 text-sm font-medium rounded-lg bg-white hover:bg-red-50 text-red-700 border border-red-700 shadow-ui-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            data-url="{{ cp_route('seo-errors-manager.delete-all') }}"
                            data-total="{{ $totalFiltered }}"
                            data-locale="{{ $currentLocale }}"
                            data-search="{{ $currentSearch }}"
                            @if ($totalFiltered === 0) disabled @endif
                            title="Usuwa wszystkie wpisy z aktualnego filtra (search + locale). Wymaga wpisania potwierdzenia."
                        >
                            @if ($currentSearch !== '' || $currentLocale !== '')
                                Usuń wszystkie z filtra ({{ $totalFiltered }})
                            @else
                                Usuń wszystkie ({{ $totalFiltered }})
                            @endif
                        </button>
                    </div>
                </div>
            </div>
        </div>

        @if ($currentSearch !== '' || $currentLocale !== '')
            <div class="mt-3 flex items-center gap-2 text-xs">
                <span class="text-gray-500">Aktywne filtry:</span>
                @if ($currentSearch !== '')
                    <span class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        Szukaj: "{{ $currentSearch }}"
                        <a href="{{ request()->fullUrlWithQuery(['search' => null, 'page' => null]) }}" class="text-blue-600 hover:text-blue-900 no-underline ml-1 font-bold">×</a>
                    </span>
                @endif
                @if ($currentLocale !== '')
                    <span class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        Locale: {{ $currentLocale }}
                        <a href="{{ request()->fullUrlWithQuery(['locale' => null, 'page' => null]) }}" class="text-blue-600 hover:text-blue-900 no-underline ml-1 font-bold">×</a>
                    </span>
                @endif
                <a href="{{ cp_route('seo-errors-manager.index') }}" class="text-gray-500 hover:text-gray-800 no-underline">Wyczyść wszystkie</a>
            </div>
        @endif
    </div>

    {{-- Table card --}}
    <div class="bg-white border border-gray-200 rounded-lg shadow-ui-sm overflow-hidden">
        <table class="data-table w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th class="w-10 p-3 text-left">
                        <input type="checkbox" id="seo-errors-select-all" aria-label="Zaznacz wszystkie">
                    </th>
                    <th class="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        <a href="{{ $sortUrl('url') }}" class="no-underline text-gray-600 hover:text-gray-900">URL{{ $sortLabel('url') }}</a>
                    </th>
                    <th class="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Locale</th>
                    <th class="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        <a href="{{ $sortUrl('hits') }}" class="no-underline text-gray-600 hover:text-gray-900">Trafienia{{ $sortLabel('hits') }}</a>
                    </th>
                    <th class="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        <a href="{{ $sortUrl('last_hit_at') }}" class="no-underline text-gray-600 hover:text-gray-900">Ostatnie trafienie{{ $sortLabel('last_hit_at') }}</a>
                    </th>
                    <th class="p-3"></th>
                </tr>
            </thead>
            <tbody id="seo-errors-table-body" class="divide-y divide-gray-200">
                @forelse ($errors as $error)
                    <tr data-key="{{ $error['key'] }}" class="hover:bg-gray-50">
                        <td class="p-3">
                            <input
                                type="checkbox"
                                class="seo-error-checkbox"
                                value="{{ $error['key'] }}"
                                aria-label="Zaznacz błąd {{ $error['url'] }}"
                            >
                        </td>
                        <td class="p-3 font-mono text-sm">
                            <a href="{{ $error['url'] }}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 hover:underline">{{ $error['url'] }}</a>
                        </td>
                        <td class="p-3">
                            <span class="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">{{ $error['locale'] }}</span>
                        </td>
                        <td class="p-3 text-sm font-medium">
                            {{ $error['hits'] }}
                        </td>
                        <td class="p-3 font-mono text-xs text-gray-600">
                            {{ $error['last_hit_at'] ?: '—' }}
                        </td>
                        <td class="p-3 text-right">
                            <div class="flex justify-end gap-2">
                                <a href="{{ $error['create_redirect_url'] }}" class="relative inline-flex items-center justify-center px-3 h-8 text-xs font-medium rounded-lg bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 shadow-ui-sm cursor-pointer no-underline">
                                    Utwórz przekierowanie
                                </a>
                                <button
                                    type="button"
                                    class="seo-error-delete relative inline-flex items-center justify-center px-3 h-8 text-xs font-medium rounded-lg bg-white hover:bg-red-50 text-red-600 border border-gray-300 shadow-ui-sm cursor-pointer"
                                    data-url="{{ $error['delete_url'] }}"
                                >
                                    Usuń
                                </button>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="text-center text-gray-500 py-12">
                            <div class="flex flex-col items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300">
                                    <path d="M9 12l2 2 4-4"/>
                                    <circle cx="12" cy="12" r="10"/>
                                </svg>
                                <p class="text-sm font-medium text-gray-700">
                                    @if ($currentSearch !== '' || $currentLocale !== '')
                                        Brak wyników dla wybranych filtrów
                                    @else
                                        Brak błędów 404
                                    @endif
                                </p>
                                @if ($currentSearch !== '' || $currentLocale !== '')
                                    <a href="{{ cp_route('seo-errors-manager.index') }}" class="text-xs text-primary hover:underline no-underline">Wyczyść filtry</a>
                                @else
                                    <p class="text-xs text-gray-500">Świetna robota — nic do sprzątania.</p>
                                @endif
                            </div>
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        {{-- Footer: counter (always) + paginator buttons (when needed) --}}
        @if ($paginator->total() > 0)
            <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <div class="text-xs text-gray-600">
                    @if ($paginator->total() === 1)
                        <span class="font-semibold">1</span> wpis
                    @elseif ($paginator->lastPage() === 1)
                        <span class="font-semibold">{{ $paginator->firstItem() }}</span>–<span class="font-semibold">{{ $paginator->lastItem() }}</span> z <span class="font-semibold">{{ $paginator->total() }}</span> wpisów
                    @else
                        Strona <span class="font-semibold">{{ $paginator->currentPage() }}</span> z <span class="font-semibold">{{ $paginator->lastPage() }}</span>
                        <span class="text-gray-400 mx-1">·</span>
                        <span class="font-semibold">{{ $paginator->firstItem() }}</span>–<span class="font-semibold">{{ $paginator->lastItem() }}</span> z <span class="font-semibold">{{ $paginator->total() }}</span>
                    @endif
                </div>
                @if ($paginator->hasPages())
                    <div class="flex items-center gap-1">
                        @if ($paginator->onFirstPage())
                            <span class="px-3 h-8 inline-flex items-center text-xs text-gray-400 border border-gray-200 rounded cursor-not-allowed">‹ Poprzednia</span>
                        @else
                            <a href="{{ $paginator->previousPageUrl() }}" class="px-3 h-8 inline-flex items-center text-xs text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded no-underline">‹ Poprzednia</a>
                        @endif

                        {{-- Numbered pages (compact: current ± 2, plus first/last) --}}
                        @php
                            $current = $paginator->currentPage();
                            $last = $paginator->lastPage();
                            $window = 2;
                            $pages = collect(range(max(1, $current - $window), min($last, $current + $window)));
                            if (!$pages->contains(1)) $pages->prepend(1);
                            if (!$pages->contains($last) && $last > 1) $pages->push($last);
                            $pages = $pages->unique()->sort()->values();
                        @endphp
                        @foreach ($pages as $i => $p)
                            @if ($i > 0 && $p - $pages[$i - 1] > 1)
                                <span class="px-2 text-xs text-gray-400">…</span>
                            @endif
                            @if ($p === $current)
                                <span class="px-3 h-8 inline-flex items-center text-xs font-semibold text-white bg-primary border border-primary rounded">{{ $p }}</span>
                            @else
                                <a href="{{ $paginator->url($p) }}" class="px-3 h-8 inline-flex items-center text-xs text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded no-underline">{{ $p }}</a>
                            @endif
                        @endforeach

                        @if ($paginator->hasMorePages())
                            <a href="{{ $paginator->nextPageUrl() }}" class="px-3 h-8 inline-flex items-center text-xs text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded no-underline">Następna ›</a>
                        @else
                            <span class="px-3 h-8 inline-flex items-center text-xs text-gray-400 border border-gray-200 rounded cursor-not-allowed">Następna ›</span>
                        @endif
                    </div>
                @endif
            </div>
        @endif
    </div>
@endsection

@section('scripts')
    <script>
        // Full event delegation — survives Vue/Inertia re-render of #statamic DOM.
        (() => {
            const CSRF_TOKEN = '{{ csrf_token() }}';

            const $ = (id) => document.getElementById(id);
            const $$ = (sel) => Array.from(document.querySelectorAll(sel));

            const updateToolbar = () => {
                const checkboxes = $$('.seo-error-checkbox');
                const selected = checkboxes.filter((cb) => cb.checked).length;

                const selCount = $('seo-errors-selected-count');
                const bulk = $('seo-errors-bulk-delete');
                const all = $('seo-errors-select-all');

                if (selCount) selCount.textContent = selected;
                if (bulk) bulk.disabled = selected === 0;
                if (all) {
                    all.checked = selected > 0 && selected === checkboxes.length;
                    all.indeterminate = selected > 0 && selected < checkboxes.length;
                }
            };

            const toast = (type, msg) => {
                if (window.Statamic && Statamic.$toast) {
                    Statamic.$toast[type](msg);
                } else if (type === 'error') {
                    alert(msg);
                }
            };

            const request = async (url, opts = {}) => {
                const res = await fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': CSRF_TOKEN,
                        ...(opts.headers || {}),
                    },
                    ...opts,
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok || data.ok === false) {
                    throw new Error(data.message || 'Operacja nie powiodła się.');
                }
                return data;
            };

            document.addEventListener('change', (e) => {
                if (e.target.id === 'seo-errors-select-all') {
                    const checked = e.target.checked;
                    $$('.seo-error-checkbox').forEach((cb) => { cb.checked = checked; });
                    updateToolbar();
                } else if (e.target.classList && e.target.classList.contains('seo-error-checkbox')) {
                    updateToolbar();
                }
            });

            document.addEventListener('click', async (e) => {
                const deleteBtn = e.target.closest('.seo-error-delete');
                if (deleteBtn) {
                    e.preventDefault();
                    if (!confirm('Czy na pewno usunąć ten błąd 404?')) return;
                    deleteBtn.disabled = true;
                    try {
                        await request(deleteBtn.dataset.url, { method: 'DELETE' });
                        deleteBtn.closest('tr')?.remove();
                        updateToolbar();
                        toast('success', 'Błąd 404 usunięty.');
                    } catch (err) {
                        deleteBtn.disabled = false;
                        toast('error', err.message);
                    }
                    return;
                }
                const bulkBtn = e.target.closest('#seo-errors-bulk-delete');
                if (bulkBtn && !bulkBtn.disabled) {
                    e.preventDefault();
                    const selected = $$('.seo-error-checkbox').filter((cb) => cb.checked);
                    if (selected.length === 0) return;
                    if (!confirm(`Czy na pewno usunąć zaznaczone błędy 404 (${selected.length})?`)) return;
                    bulkBtn.disabled = true;
                    try {
                        const ids = selected.map((cb) => cb.value);
                        const data = await request(bulkBtn.dataset.url, {
                            method: 'POST',
                            body: JSON.stringify({ ids }),
                        });
                        selected.forEach((cb) => cb.closest('tr')?.remove());
                        updateToolbar();
                        toast('success', `Usunięto błędy 404: ${data.deleted}.`);
                    } catch (err) {
                        updateToolbar();
                        toast('error', err.message);
                    }
                    return;
                }

                // Delete all (2-step confirmation)
                const deleteAllBtn = e.target.closest('#seo-errors-delete-all');
                if (deleteAllBtn && !deleteAllBtn.disabled) {
                    e.preventDefault();
                    const total = parseInt(deleteAllBtn.dataset.total, 10) || 0;
                    const locale = deleteAllBtn.dataset.locale || '';
                    const search = deleteAllBtn.dataset.search || '';

                    if (total === 0) {
                        toast('error', 'Brak wpisów do usunięcia.');
                        return;
                    }

                    // Step 1: standard confirm with details
                    const filterInfo = (locale !== '' || search !== '')
                        ? `\n\nFiltr aktywny:` +
                          (locale ? `\n  • Locale: ${locale}` : '') +
                          (search ? `\n  • Szukaj: "${search}"` : '')
                        : '\n\nBez filtrów — wszystkie błędy 404 we wszystkich locale.';

                    if (!confirm(
                        `⚠ UWAGA: Operacja nieodwracalna!\n\n` +
                        `Zamierzasz usunąć ${total} ${total === 1 ? 'wpis' : 'wpisów'} 404.${filterInfo}\n\n` +
                        `Kontynuować?`
                    )) {
                        return;
                    }

                    // Step 2: type-to-confirm prompt
                    const typed = prompt(
                        `Aby ostatecznie potwierdzić usunięcie ${total} ${total === 1 ? 'wpisu' : 'wpisów'}, ` +
                        `wpisz słowo:\n\nUSUN\n\n(bez polskiego ogonka)`
                    );

                    if (typed === null) {
                        // user clicked Cancel
                        return;
                    }

                    if (typed.trim().toUpperCase() !== 'USUN') {
                        toast('error', 'Potwierdzenie nie zgadza się. Anulowano.');
                        return;
                    }

                    deleteAllBtn.disabled = true;

                    try {
                        const data = await request(deleteAllBtn.dataset.url, {
                            method: 'POST',
                            body: JSON.stringify({
                                confirm: 'USUN',
                                locale: locale,
                                search: search,
                            }),
                        });
                        toast('success', `Usunięto błędy 404: ${data.deleted}. Przeładowuję listę…`);
                        // Reload after a brief moment so user sees the toast
                        setTimeout(() => window.location.reload(), 800);
                    } catch (err) {
                        deleteAllBtn.disabled = false;
                        toast('error', err.message);
                    }
                }
            });

            // Search input: submit on Enter / debounced auto-submit on type stop
            let searchDebounceTimer = null;
            document.addEventListener('input', (e) => {
                if (e.target.id !== 'seo-errors-search') return;
                clearTimeout(searchDebounceTimer);
                searchDebounceTimer = setTimeout(() => {
                    e.target.closest('form')?.submit();
                }, 500);
            });

            // Auto-prune dropdown: save setting via AJAX with confirm
            document.addEventListener('change', async (e) => {
                if (e.target.id !== 'seo-errors-auto-prune') return;
                const select = e.target;
                const days = parseInt(select.value, 10);
                const previous = parseInt(select.dataset.previous, 10);

                if (days === previous) return;

                if (days > 0) {
                    const msg =
                        `Włączyć auto-usuwanie wpisów starszych niż ${days} dni?\n\n` +
                        `Uruchamiać się będzie codziennie o 03:00 (poprzez Laravel Scheduler).\n` +
                        `Wymaga skonfigurowanego crona na hostingu:\n` +
                        `* * * * * php artisan schedule:run`;
                    if (!confirm(msg)) {
                        select.value = String(previous);
                        return;
                    }
                } else {
                    if (!confirm('Wyłączyć auto-usuwanie starych wpisów?')) {
                        select.value = String(previous);
                        return;
                    }
                }

                try {
                    await request(select.dataset.url, {
                        method: 'POST',
                        body: JSON.stringify({ auto_prune_days: days }),
                    });
                    select.dataset.previous = String(days);
                    toast('success', days > 0
                        ? `Auto-usuwanie włączone: ${days} dni. Pierwsze uruchomienie o 03:00.`
                        : 'Auto-usuwanie wyłączone.'
                    );
                } catch (err) {
                    select.value = String(previous);
                    toast('error', err.message);
                }
            });

            const tryUpdate = (attempts = 0) => {
                if ($('seo-errors-bulk-delete')) {
                    updateToolbar();
                } else if (attempts < 30) {
                    setTimeout(() => tryUpdate(attempts + 1), 100);
                }
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => tryUpdate());
            } else {
                tryUpdate();
            }
        })();
    </script>
@endsection
