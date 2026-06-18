@extends('statamic::layout')

@section('title', 'Translator API')

@section('content')
    <div class="flex items-center justify-between mb-6">
        <h1 class="flex-1 text-3xl font-bold">Translator API</h1>
    </div>

    @if (session('success'))
        <div class="p-2 mb-4 bg-green-100 text-green-800 rounded">
            {{ session('success') }}
        </div>
    @endif

    <div class="card p-4">
        <form method="POST" action="{{ cp_route('translator-api.update') }}">
            @csrf

            <div class="mb-4">
                <label class="block mb-1 font-medium">Usługa tłumaczeń</label>
                <input
                    type="text"
                    value="{{ $service }}"
                    class="input-text w-full"
                    readonly
                >
            </div>

            <div class="mb-4">
                <label class="block mb-1 font-medium">DeepL API Key</label>
                <input
                    type="password"
                    name="deepl_api_key"
                    value="{{ $apiKey }}"
                    class="input-text w-full font-mono"
                    autocomplete="off"
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx"
                >
                <p class="text-xs text-grey mt-1">
                    Klucz DeepL Free API kończy się na <code>:fx</code>.
                    Znajdziesz go w panelu
                    <a href="https://www.deepl.com/account/summary" target="_blank" class="text-blue underline">deepl.com/account</a>.
                </p>
            </div>

            <button type="submit" class="relative inline-flex items-center justify-center px-4 h-10 text-sm font-medium rounded-lg bg-linear-to-b from-primary/90 to-primary hover:bg-primary-hover text-white border border-primary-border shadow-ui-md cursor-pointer">Zapisz klucz</button>
        </form>
    </div>
@endsection
