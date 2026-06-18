<?php

namespace Skalisty\WysiwygHtmlFieldtype\Fieldtypes;

use Illuminate\Support\HtmlString;
use Statamic\Fields\Fieldtype;

class WysiwygHtml extends Fieldtype
{
    protected $categories = ['text'];

    protected $icon = 'code';

    public function defaultValue()
    {
        return '';
    }

    public function preProcess($data)
    {
        return $data ?? '';
    }

    public function process($data)
    {
        return $data ?? '';
    }

    public function augment($value)
    {
        return new HtmlString($value ?? '');
    }

    protected function configFieldItems(): array
    {
        return [
            'container' => [
                'display' => 'Asset Container',
                'instructions' => 'Kontener assets do wstawiania obrazkow (uzywany przez edytor WYSIWYG).',
                'type' => 'asset_container',
                'max_items' => 1,
                'width' => 50,
            ],
            'placeholder' => [
                'display' => 'Placeholder',
                'instructions' => 'Tekst wyswietlany gdy pole jest puste.',
                'type' => 'text',
                'width' => 50,
            ],
        ];
    }

    public function preload()
    {
        try {
            $handle = $this->config('container') ?? 'assets';
            $container = \Statamic\Facades\AssetContainer::find($handle);

            if (! $container) {
                \Log::warning('[wysiwyg-html] preload(): kontener nie znaleziony, handle=' . $handle);

                return ['container' => null];
            }

            $user = \Statamic\Facades\User::current();

            $data = [
                'id' => $container->id(),
                'title' => $container->title(),
                'edit_url' => $container->editUrl(),
                'delete_url' => $container->deleteUrl(),
                'blueprint_url' => cp_route('blueprints.asset-containers.edit', $container->handle()),
                'can_view' => $user->can('view', $container),
                'can_upload' => $user->can('store', [\Statamic\Contracts\Assets\Asset::class, $container]),
                'can_edit' => $user->can('edit', $container),
                'can_delete' => $user->can('delete', $container),
                'can_create_folders' => $user->can('create', [\Statamic\Contracts\Assets\AssetFolder::class, $container]),
                'sort_field' => $container->sortField(),
                'sort_direction' => $container->sortDirection(),
            ];

            \Log::debug('[wysiwyg-html] preload(): OK, container=' . $container->id());

            return ['container' => $data];
        } catch (\Throwable $e) {
            \Log::error('[wysiwyg-html] preload() exception: ' . $e->getMessage());

            return ['container' => null];
        }
    }
}
