@extends('statamic::layout')

@section('title', 'Tłumaczenia UI')

@section('content')
    <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">Tłumaczenia UI</h1>
    </div>

    <div class="card p-0 overflow-hidden">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Język</th>
                    <th>Przetłumaczone</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @foreach ($sites as $site)
                    <tr>
                        <td class="font-medium">{{ $site['name'] }}</td>
                        <td>{{ $site['count'] }} / {{ $site['total'] }}</td>
                        <td class="text-right">
                            <a href="{{ $site['url'] }}" class="btn btn-sm">Edytuj</a>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
