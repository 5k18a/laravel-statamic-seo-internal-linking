@extends('statamic::layout')

@section('title', 'Trasy URL kolekcji')

@section('content')
    <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">Trasy URL kolekcji</h1>
    </div>

    <div class="card p-0 overflow-hidden">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Kolekcja</th>
                    <th>Aktualna trasa</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @foreach ($collections as $item)
                    <tr>
                        <td class="font-medium">{{ $item['label'] }}</td>
                        <td class="font-mono text-sm">
                            @if ($item['is_localized'])
                                <span class="text-grey-60 italic">wielojęzyczna (per język)</span>
                            @else
                                {{ $item['route_raw'] ?? '—' }}
                            @endif
                        </td>
                        <td class="text-right">
                            <a href="{{ $item['url'] }}" class="btn btn-sm">Edytuj</a>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
