<?php

namespace Skalisty\InternalLinks\Support;

class LinkableContentParser
{
    private const HIDE_REGEXES = [
        'headings' => '/<h[1-6][^>]*>.*?<\/\s?h[1-6]>/isu',
        'embeds' => '/<!--\s*wp:embed.*?\/wp:embed\s*-->/isu',
        'figures' => '/<figure[^>]*>.*?<\/\s?figure>/isu',
        'images' => '/<img\b[^>]*>/isu',
        'links' => '/<a\b[^>]*>.*?<\/\s?a>/isu',
        'iframes' => '/<iframe\b[^>]*>.*?<\/\s?iframe>/isu',
    ];

    private string $content;

    private array $hidden = [];

    private int $counter = 0;

    public function __construct(string $content)
    {
        $this->content = $content;
        $this->hideTags();
    }

    public function replaceKeyword(string $keyword, string $url, array $options = []): self
    {
        $keyword = trim($keyword);
        $max = max(1, (int) ($options['max'] ?? 1));

        if ($keyword === '' || $url === '') {
            return $this;
        }

        $attrs = $this->linkAttributes(
            (bool) ($options['nofollow'] ?? false),
            (bool) ($options['target_blank'] ?? false)
        );

        $pattern = $this->replacePattern($keyword);
        $replaced = 0;

        $this->content = preg_replace_callback($pattern, function (array $matches) use ($url, $attrs, &$replaced, $max) {
            if ($replaced >= $max) {
                return $matches[0];
            }

            $keywordMatch = $matches[1] ?? '';
            $suffix = '';

            if ($keywordMatch === '') {
                $keywordMatch = $matches[2] ?? '';
                $suffix = $matches[3] ?? '';
            }

            if ($keywordMatch === '') {
                return $matches[0];
            }

            $replaced++;

            return sprintf(
                '<a href="%s"%s>%s</a>%s',
                htmlspecialchars($url, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
                $attrs,
                htmlspecialchars($keywordMatch, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
                $suffix
            );
        }, $this->content, $max);

        // Hide freshly created links so following keywords cannot link inside them.
        if ($replaced > 0) {
            $this->hideTags();
        }

        return $this;
    }

    public function getContent(): string
    {
        $content = $this->content;

        foreach ($this->hidden as $hash => $original) {
            $content = str_replace($hash, $original, $content);
        }

        return $content;
    }

    private function hideTags(): void
    {
        foreach (self::HIDE_REGEXES as $regex) {
            preg_match_all($regex, $this->content, $matches);

            foreach ($matches[0] ?? [] as $match) {
                $hash = $this->nextHash();
                $this->hidden[$hash] = $match;
                $this->content = str_replace($match, $hash, $this->content);
            }
        }
    }

    private function replacePattern(string $keyword): string
    {
        $quoted = preg_quote($keyword, '/');

        return "/(?<![a-z\-.\p{L}])({$quoted})(?![a-z\-.\p{L}.])|(?<![a-z\-.\p{L}])({$quoted})(\.(?=\s|<|$))/iu";
    }

    private function linkAttributes(bool $nofollow, bool $targetBlank): string
    {
        $attributes = [];
        $rel = [];

        if ($nofollow) {
            $rel[] = 'nofollow';
        }

        if ($targetBlank) {
            $rel[] = 'noopener';
            $attributes[] = 'target="_blank"';
        }

        if ($rel !== []) {
            $attributes[] = 'rel="'.implode(' ', $rel).'"';
        }

        return $attributes === [] ? '' : ' '.implode(' ', $attributes);
    }

    private function nextHash(): string
    {
        return '###IL_HIDDEN_'.$this->counter++.'_'.md5((string) microtime(true)).'###';
    }
}
