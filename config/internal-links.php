<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Blog Collection Handle
    |--------------------------------------------------------------------------
    |
    | The handle of the Statamic collection that contains your blog posts.
    | The apply_internal_links modifier will only run on entries belonging
    | to this collection. Common values: blog, posts, articles, news.
    |
    */

    'blog_collection' => 'blog',

    /*
    |--------------------------------------------------------------------------
    | Admin Site Handle
    |--------------------------------------------------------------------------
    |
    | The site handle used to query the internal_links collection. This should
    | be the handle of the site you use to manage content in the CP.
    | Common values: pl, en, default.
    |
    */

    'admin_site' => 'en',

];
