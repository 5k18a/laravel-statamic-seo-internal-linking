import WysiwygHtml from './components/fieldtypes/WysiwygHtml.vue';

Statamic.booting(() => {
    Statamic.component('wysiwyg_html-fieldtype', WysiwygHtml);
});
