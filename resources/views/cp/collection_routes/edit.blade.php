@extends('statamic::layout')

@section('title', 'Trasy URL — ' . $label)

@section('content')
    <div class="flex items-center justify-between mb-6">
        <div>
            <a href="{{ cp_route('collection-routes.index') }}" class="text-sm text-grey mb-1 block">&larr; Trasy URL kolekcji</a>
            <h1 class="text-3xl font-bold">{{ $label }}</h1>
        </div>
    </div>

    @if (session('success'))
        <div class="card p-4 mb-6 bg-green-100 text-green-800">
            {{ session('success') }}
        </div>
    @endif

    <form method="POST" action="{{ cp_route('collection-routes.update', $collection) }}">
        @csrf

        <div class="card p-0 overflow-hidden">
            <table class="data-table">
                <thead>
                    <tr>
                        <th class="w-28">Język</th>
                        <th>Trasa URL</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($sites as $handle => $site)
                        <tr>
                            <td>
                                <span class="font-medium">{{ strtoupper($handle) }}</span>
                                <div class="text-xs text-grey-60">{{ $site->name() }}</div>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="routes[{{ $handle }}]"
                                    value="{{ $routes[$handle] ?? '' }}"
                                    class="input-text w-full font-mono"
                                    placeholder="/{slug}"
                                >
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="mt-6 flex justify-end">
            <button type="submit" class="relative inline-flex items-center justify-center px-4 h-10 text-sm font-medium rounded-lg bg-linear-to-b from-primary/90 to-primary hover:bg-primary-hover text-white border border-primary-border shadow-ui-md cursor-pointer">Zapisz trasy</button>
        </div>
    </form>
@endsection
