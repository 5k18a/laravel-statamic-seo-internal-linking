@extends('statamic::layout')

@section('title', 'Tłumaczenia UI - ' . $site->name())

@section('content')
    <div class="flex items-center justify-between mb-6">
        <div>
            <a href="{{ cp_route('ui-translations.index') }}" class="text-sm text-grey mb-1 block">&larr; Tłumaczenia UI</a>
            <h1 class="text-3xl font-bold">{{ $site->name() }}</h1>
        </div>
    </div>

    @if (session('success'))
        <div class="card p-4 mb-6 bg-green-100 text-green-800">
            {{ session('success') }}
        </div>
    @endif

    <form method="POST" action="{{ cp_route('ui-translations.update', $locale) }}">
        @csrf

        <div class="card p-0 overflow-hidden">
            <table class="data-table">
                <thead>
                    <tr>
                        <th class="w-1/4">Key</th>
                        <th class="w-1/3">Polski</th>
                        <th>{{ $site->name() }}</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($rows as $row)
                        <tr>
                            <td class="font-mono text-xs">{{ $row['key'] }}</td>
                            <td>{{ $row['pl_value'] }}</td>
                            <td>
                                <input
                                    type="text"
                                    name="translations[{{ $row['key'] }}]"
                                    value="{{ $row['translation'] }}"
                                    class="input-text w-full"
                                >
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="mt-6 flex justify-end">
            <button type="submit" class="relative inline-flex items-center justify-center px-4 h-10 text-sm font-medium rounded-lg bg-linear-to-b from-primary/90 to-primary hover:bg-primary-hover text-white border border-primary-border shadow-ui-md cursor-pointer">Zapisz tłumaczenia</button>
        </div>
    </form>
@endsection
