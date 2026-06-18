<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import { BubbleMenu } from '@tiptap/vue-3/menus';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';

const emit = defineEmits(['update:value']);

const props = defineProps({
    value: { default: '' },
    name: { type: String, default: '' },
    fieldPath: { type: String, default: '' },
    config: { type: Object, default: () => ({}) },
    readOnly: { type: Boolean, default: false },
    handle: { type: String, default: '' },
    meta: { type: Object, default: () => ({}) },
});

function update(value) {
    emit('update:value', value);
}

const mode = ref('wysiwyg');
const isFullscreen = ref(false);
const sourceEl = ref(null);
const showAssetBrowser = ref(false);
const selectedAssets = ref([]);
const dynamicContainer = ref(null);
let cmInstance = null;

onMounted(() => {
    console.log('[wysiwyg-html] mounted, meta:', JSON.stringify(props.meta), ', config.container:', props.config?.container);
});

const editor = useEditor({
    content: props.value || '',
    editable: !props.readOnly,
    extensions: [
        StarterKit.configure({
            heading: { levels: [1, 2, 3, 4, 5, 6] },
        }),
        Link.configure({ openOnClick: false }),
        Underline,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Image.extend({
            addAttributes() {
                return {
                    ...this.parent?.(),
                    style: {
                        default: null,
                        parseHTML: element => element.getAttribute('style'),
                        renderHTML: attributes => {
                            if (!attributes.style) {
                                return {};
                            }

                            return { style: attributes.style };
                        },
                    },
                };
            },
        }).configure({ inline: false }),
    ],
    onUpdate({ editor }) {
        if (mode.value === 'wysiwyg') {
            update(editor.getHTML());
        }
    },
});

async function initCodeMirror(content) {
    await nextTick();

    if (!sourceEl.value) {
        return;
    }

    if (!window.CodeMirror) {
        sourceEl.value.value = content;
        return;
    }

    destroyCodeMirror();

    cmInstance = window.CodeMirror.fromTextArea(sourceEl.value, {
        mode: 'htmlmixed',
        lineNumbers: true,
        lineWrapping: true,
        readOnly: props.readOnly || false,
    });

    cmInstance.setValue(content);
    cmInstance.refresh();
    cmInstance.on('change', () => {
        update(cmInstance.getValue());
    });
}

function destroyCodeMirror() {
    if (cmInstance) {
        cmInstance.toTextArea();
        cmInstance = null;
    }
}

async function switchToHtml() {
    const html = editor.value?.getHTML() ?? '';

    mode.value = 'html';
    await initCodeMirror(html);
}

async function switchToWysiwyg() {
    const html = cmInstance
        ? cmInstance.getValue()
        : (sourceEl.value?.value ?? '');

    destroyCodeMirror();
    mode.value = 'wysiwyg';
    await nextTick();
    editor.value?.commands.setContent(html, false);
    update(html);
}

function toggleMode() {
    mode.value === 'wysiwyg' ? switchToHtml() : switchToWysiwyg();
}

function toggleFullscreen() {
    isFullscreen.value = !isFullscreen.value;
}

function cmd(fn) {
    if (!editor.value || props.readOnly) {
        return;
    }

    fn(editor.value.chain().focus());
}

function cpUrl(path) {
    const base = window.Statamic?.$config?.get('cpUrl') ?? '/cp';

    return `${base}/${path}`.replace(/([^:])\/{2,}/g, '$1/');
}

function insertLink() {
    if (!editor.value || props.readOnly) {
        return;
    }

    const url = window.prompt('URL:', editor.value.getAttributes('link').href ?? '');

    if (url === null) {
        return;
    }

    if (url === '') {
        cmd((c) => c.unsetLink().run());
        return;
    }

    cmd((c) => c.setLink({ href: url }).run());
}

function insertImage() {
    if (!editor.value || props.readOnly) {
        return;
    }

    const url = window.prompt('URL obrazu:', '');

    if (!url) {
        return;
    }

    cmd((c) => c.setImage({ src: url }).run());
}

function setHeading(level) {
    const n = parseInt(level, 10);

    if (n === 0) {
        cmd((c) => c.setParagraph().run());
    } else {
        cmd((c) => c.setHeading({ level: n }).run());
    }
}

function setImageAlign(align) {
    if (!editor.value || props.readOnly) {
        return;
    }

    let style = '';

    if (align === 'left') {
        style = 'display: block; margin-left: 0; margin-right: auto;';
    }

    if (align === 'center') {
        style = 'display: block; margin-left: auto; margin-right: auto;';
    }

    if (align === 'right') {
        style = 'display: block; margin-left: auto; margin-right: 0;';
    }

    editor.value.chain().focus().updateAttributes('image', { style }).run();
}

function editImageUrl() {
    if (!editor.value || props.readOnly) {
        return;
    }

    const current = editor.value.getAttributes('image').src ?? '';
    const newSrc = window.prompt('URL obrazu:', current);

    if (newSrc === null) {
        return;
    }

    if (newSrc === '') {
        editor.value.chain().focus().deleteSelection().run();
    } else {
        editor.value.chain().focus().updateAttributes('image', { src: newSrc }).run();
    }
}

async function onAssetSelected(assets) {
    if (!assets || assets.length === 0) {
        return;
    }

    showAssetBrowser.value = false;

    const token = window.Statamic?.$config?.get('csrfToken')
        || document.querySelector('meta[name="csrf-token"]')?.content
        || '';

    try {
        const response = await fetch(cpUrl('assets-fieldtype'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({ assets }),
        });

        if (!response.ok) {
            return;
        }

        const data = await response.json();

        data.forEach((asset) => {
            if (asset.isImage && asset.url) {
                cmd((c) => c.setImage({ src: asset.url }).run());
            }
        });
    } catch (e) {
        console.error('[wysiwyg-html] asset fetch error:', e);
    }

    selectedAssets.value = [];
}

async function openBrowser() {
    if (props.readOnly) {
        return;
    }

    if (effectiveContainer.value) {
        console.log('[wysiwyg-html] openBrowser: używam effectiveContainer');
        showAssetBrowser.value = true;
        return;
    }

    console.warn('[wysiwyg-html] openBrowser: meta.container jest null, próbuję pobrać przez API');
    const handle = props.config?.container ?? 'assets';
    const fieldConfig = { handle: props.handle || 'content', type: 'wysiwyg_html', container: handle };

    const utf8btoa = (str) => btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    );

    const token = window.Statamic?.$config?.get('csrfToken')
        || document.querySelector('meta[name="csrf-token"]')?.content || '';

    try {
        const response = await fetch(cpUrl('fields/field-meta'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({ config: utf8btoa(JSON.stringify(fieldConfig)), value: '' }),
        });

        if (!response.ok) {
            console.error('[wysiwyg-html] openBrowser: fields/field-meta zwrócił', response.status);
            return;
        }

        const data = await response.json();
        console.log('[wysiwyg-html] openBrowser: field-meta response:', JSON.stringify(data));

        if (data.meta?.container) {
            dynamicContainer.value = data.meta.container;
            showAssetBrowser.value = true;
        } else {
            console.error('[wysiwyg-html] openBrowser: brak container w meta response');
        }
    } catch (e) {
        console.error('[wysiwyg-html] openBrowser: wyjątek:', e);
    }
}

watch(
    () => props.meta?.container,
    (newContainer) => {
        if (newContainer) {
            dynamicContainer.value = newContainer;
        }
    },
    { immediate: true }
);

const effectiveContainer = computed(() => dynamicContainer.value ?? null);

const currentHeadingLevel = computed(() => {
    if (!editor.value) {
        return '0';
    }

    for (let i = 1; i <= 6; i++) {
        if (editor.value.isActive('heading', { level: i })) {
            return String(i);
        }
    }

    return '0';
});

watch(
    () => props.value,
    (newVal) => {
        if (mode.value === 'wysiwyg') {
            if (editor.value && editor.value.getHTML() !== newVal) {
                editor.value.commands.setContent(newVal || '', false);
            }
        } else if (cmInstance && cmInstance.getValue() !== newVal) {
            cmInstance.setValue(newVal || '');
        } else if (sourceEl.value && sourceEl.value.value !== (newVal || '')) {
            sourceEl.value.value = newVal || '';
        }
    }
);

onBeforeUnmount(() => {
    destroyCodeMirror();
    editor.value?.destroy();
});
</script>

<template>
    <Teleport :disabled="!isFullscreen" to="body">
        <div
            class="wysiwyg-html-fieldtype border rounded"
            :class="{ 'opacity-50': readOnly, 'is-fullscreen': isFullscreen }"
        >
            <div class="wysiwyg-html-toolbar flex flex-wrap items-center gap-1 p-1 border-b bg-gray-100 text-xs">
                <template v-if="mode === 'wysiwyg'">
                    <button
                        type="button"
                        class="toolbar-btn"
                        :class="{ 'is-active': editor?.isActive('bold') }"
                        @click="cmd(c => c.toggleBold().run())"
                    >
                        B
                    </button>
                    <button
                        type="button"
                        class="toolbar-btn italic"
                        :class="{ 'is-active': editor?.isActive('italic') }"
                        @click="cmd(c => c.toggleItalic().run())"
                    >
                        I
                    </button>
                    <button
                        type="button"
                        class="toolbar-btn underline"
                        :class="{ 'is-active': editor?.isActive('underline') }"
                        @click="cmd(c => c.toggleUnderline().run())"
                    >
                        U
                    </button>
                    <button
                        type="button"
                        class="toolbar-btn"
                        :class="{ 'is-active': editor?.isActive('strike') }"
                        @click="cmd(c => c.toggleStrike().run())"
                    >
                        S
                    </button>
                    <span class="toolbar-sep">|</span>
                    <select
                        class="toolbar-select"
                        :value="currentHeadingLevel"
                        :disabled="readOnly"
                        title="Styl naglowka"
                        @change="setHeading($event.target.value)"
                    >
                        <option value="0">Normalny</option>
                        <option value="1">H1</option>
                        <option value="2">H2</option>
                        <option value="3">H3</option>
                        <option value="4">H4</option>
                        <option value="5">H5</option>
                        <option value="6">H6</option>
                    </select>
                    <span class="toolbar-sep">|</span>
                    <button
                        type="button"
                        class="toolbar-btn"
                        :class="{ 'is-active': editor?.isActive('bulletList') }"
                        @click="cmd(c => c.toggleBulletList().run())"
                    >
                        UL
                    </button>
                    <button
                        type="button"
                        class="toolbar-btn"
                        :class="{ 'is-active': editor?.isActive('orderedList') }"
                        @click="cmd(c => c.toggleOrderedList().run())"
                    >
                        OL
                    </button>
                    <span class="toolbar-sep">|</span>
                    <button
                        type="button"
                        class="toolbar-btn"
                        :class="{ 'is-active': editor?.isActive('link') }"
                        :title="editor?.isActive('link') ? 'Usun link' : 'Wstaw link'"
                        @click="insertLink()"
                    >
                        🔗
                    </button>
                    <span class="toolbar-sep">|</span>
                    <button
                        type="button"
                        class="toolbar-btn"
                        :class="{ 'is-active': editor?.isActive({ textAlign: 'left' }) }"
                        title="Wyrownaj do lewej"
                        @click="cmd(c => c.setTextAlign('left').run())"
                    >
                        ←
                    </button>
                    <button
                        type="button"
                        class="toolbar-btn"
                        :class="{ 'is-active': editor?.isActive({ textAlign: 'center' }) }"
                        title="Wysrodkuj"
                        @click="cmd(c => c.setTextAlign('center').run())"
                    >
                        ↔
                    </button>
                    <button
                        type="button"
                        class="toolbar-btn"
                        :class="{ 'is-active': editor?.isActive({ textAlign: 'right' }) }"
                        title="Wyrownaj do prawej"
                        @click="cmd(c => c.setTextAlign('right').run())"
                    >
                        →
                    </button>
                    <span class="toolbar-sep">|</span>
                    <button
                        type="button"
                        class="toolbar-btn"
                        :class="{ 'is-active': editor?.isActive('blockquote') }"
                        title="Cytat blokowy"
                        @click="cmd(c => c.toggleBlockquote().run())"
                    >
                        ❝
                    </button>
                    <button
                        type="button"
                        class="toolbar-btn"
                        :class="{ 'is-active': editor?.isActive('code') }"
                        title="Kod inline"
                        @click="cmd(c => c.toggleCode().run())"
                    >
                        `
                    </button>
                    <button
                        type="button"
                        class="toolbar-btn"
                        title="Pozioma linia"
                        @click="cmd(c => c.setHorizontalRule().run())"
                    >
                        ─
                    </button>
                    <button
                        type="button"
                        class="toolbar-btn"
                        title="Wstaw obraz (URL)"
                        @click="insertImage()"
                    >
                        🖼
                    </button>
                    <button
                        type="button"
                        class="toolbar-btn"
                        title="Wstaw obraz z biblioteki assets"
                        @click="openBrowser()"
                    >
                        📁
                    </button>
                    <span class="toolbar-sep">|</span>
                    <button
                        type="button"
                        class="toolbar-btn"
                        @click="cmd(c => c.undo().run())"
                    >
                        ↩
                    </button>
                    <button
                        type="button"
                        class="toolbar-btn"
                        @click="cmd(c => c.redo().run())"
                    >
                        ↪
                    </button>
                </template>

                <button
                    type="button"
                    class="toolbar-btn toolbar-btn--toggle"
                    :title="isFullscreen ? 'Zamknij pelny ekran' : 'Pelny ekran'"
                    @click="toggleFullscreen()"
                >
                    {{ isFullscreen ? '⊠' : '⊡' }}
                </button>
                <button
                    type="button"
                    class="toolbar-btn toolbar-btn--toggle ml-auto"
                    :title="mode === 'wysiwyg' ? 'Przelacz na widok HTML' : 'Przelacz na widok wizualny'"
                    @click="toggleMode"
                >
                    {{ mode === 'wysiwyg' ? '</>' : 'Visual' }}
                </button>
            </div>

            <div
                v-show="mode === 'wysiwyg'"
                class="wysiwyg-html-content p-2 min-h-[150px] prose max-w-none"
            >
                <BubbleMenu
                    v-if="editor"
                    :editor="editor"
                    :should-show="({ editor: ed }) => ed.isActive('image')"
                    class="wysiwyg-bubble-menu"
                >
                    <button type="button" class="bubble-btn" title="Wyrownaj do lewej" @click="setImageAlign('left')">⬅</button>
                    <button type="button" class="bubble-btn" title="Wysrodkuj" @click="setImageAlign('center')">⬛</button>
                    <button type="button" class="bubble-btn" title="Wyrownaj do prawej" @click="setImageAlign('right')">➡</button>
                    <span class="bubble-sep">|</span>
                    <button type="button" class="bubble-btn" title="Edytuj URL obrazu" @click="editImageUrl()">✏</button>
                    <span class="bubble-sep">|</span>
                    <button type="button" class="bubble-btn bubble-btn--danger" title="Usun obraz" @click="cmd(c => c.deleteSelection().run())">✕</button>
                </BubbleMenu>
                <EditorContent :editor="editor" />
            </div>

            <div v-show="mode === 'html'" class="wysiwyg-html-source">
                <textarea
                    ref="sourceEl"
                    @input="!cmInstance && update($event.target.value)"
                />
            </div>

            <Teleport v-if="showAssetBrowser && effectiveContainer" to="body">
                <div
                    class="wysiwyg-asset-overlay"
                    @click.self="showAssetBrowser = false"
                >
                    <div class="wysiwyg-asset-panel">
                        <div class="wysiwyg-asset-panel__header">
                            <span>{{ meta.container.title || 'Biblioteka assets' }}</span>
                            <button
                                type="button"
                                class="wysiwyg-asset-panel__close"
                                @click="showAssetBrowser = false"
                            >
                                ✕
                            </button>
                        </div>
                        <div class="wysiwyg-asset-panel__body">
                            <asset-browser
                                :container="effectiveContainer"
                                :selected-assets="selectedAssets"
                                :max-files="1"
                                :selected-path="''"
                                @selections-updated="onAssetSelected"
                            />
                        </div>
                    </div>
                </div>
            </Teleport>
        </div>
    </Teleport>
</template>

<style scoped>
.toolbar-btn {
    padding: 2px 6px;
    border-radius: 3px;
    cursor: pointer;
    font-weight: 500;
    background: transparent;
}

.toolbar-btn:hover {
    background: #e5e7eb;
}

.toolbar-btn.is-active {
    background: #d1fae5;
    color: #065f46;
}

.toolbar-btn--toggle {
    font-family: monospace;
    border: 1px solid #d1d5db;
}

.toolbar-sep {
    color: #d1d5db;
    margin: 0 2px;
}

.toolbar-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.toolbar-select {
    padding: 2px 6px;
    border-radius: 3px;
    border: 1px solid #d1d5db;
    font-size: 11px;
    background: transparent;
    cursor: pointer;
    height: 24px;
}

.toolbar-select:hover {
    background: #e5e7eb;
}

.toolbar-select:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.wysiwyg-html-content :deep(.ProseMirror) {
    min-height: 200px;
    outline: none;
    padding: 2px 0;
    cursor: text;
}

.wysiwyg-html-content {
    max-width: none;
}

.wysiwyg-html-content :deep(.ProseMirror img) {
    cursor: pointer;
    border-radius: 2px;
    transition: outline 0.1s ease;
}

.wysiwyg-html-content :deep(.ProseMirror img.ProseMirror-selectednode) {
    outline: 3px solid #3b82f6;
    outline-offset: 2px;
}

.wysiwyg-html-source textarea,
.wysiwyg-html-source .CodeMirror {
    min-height: 200px;
    width: 100%;
}

.wysiwyg-html-source textarea {
    padding: 0.75rem;
    font-size: 12px;
    font-family: monospace;
    border: 0;
    resize: vertical;
}

.wysiwyg-html-source .CodeMirror {
    height: auto;
    font-size: 12px;
    font-family: monospace;
}

.wysiwyg-html-fieldtype.is-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    border-radius: 0;
    display: flex;
    flex-direction: column;
    background: white;
    overflow: hidden;
}

.wysiwyg-html-fieldtype.is-fullscreen .wysiwyg-html-toolbar {
    flex-shrink: 0;
}

.wysiwyg-html-fieldtype.is-fullscreen .wysiwyg-html-content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.wysiwyg-html-fieldtype.is-fullscreen .wysiwyg-html-content :deep(.ProseMirror) {
    flex: 1;
    min-height: unset;
    height: auto;
}

.wysiwyg-html-fieldtype.is-fullscreen .wysiwyg-html-source {
    flex: 1;
    min-height: 0;
    overflow: auto;
}

.wysiwyg-html-fieldtype.is-fullscreen .wysiwyg-html-source .CodeMirror,
.wysiwyg-html-fieldtype.is-fullscreen .wysiwyg-html-source textarea {
    height: 100%;
    min-height: unset;
}

.wysiwyg-asset-overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.wysiwyg-asset-panel {
    background: white;
    border-radius: 8px;
    width: 90vw;
    max-width: 1100px;
    height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.wysiwyg-asset-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
    font-weight: 600;
    flex-shrink: 0;
}

.wysiwyg-asset-panel__close {
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    background: transparent;
}

.wysiwyg-asset-panel__close:hover {
    background: #f3f4f6;
}

.wysiwyg-asset-panel__body {
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

.wysiwyg-bubble-menu {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 4px 8px;
    background: #1f2937;
    border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    z-index: 50;
}

.bubble-btn {
    padding: 3px 8px;
    border-radius: 3px;
    cursor: pointer;
    color: white;
    font-size: 13px;
    background: transparent;
    line-height: 1.2;
    border: none;
    min-width: 24px;
}

.bubble-btn:hover {
    background: rgba(255, 255, 255, 0.15);
}

.bubble-btn--danger:hover {
    background: rgba(239, 68, 68, 0.5);
}

.bubble-sep {
    color: rgba(255, 255, 255, 0.25);
    margin: 0 2px;
    font-size: 11px;
}
</style>

<style>
body:has(.wysiwyg-asset-overlay) [data-reka-popper-content-wrapper] {
    z-index: 10001 !important;
}
</style>
