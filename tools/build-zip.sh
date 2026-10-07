#!/usr/bin/env bash
#
# Package the theme into dist/observata.zip for upload to WordPress.
#
# Copies only what the theme needs at runtime, strips Composer dev packages
# (phpstan, phpcs, stubs) via `composer install --no-dev` so the autoloader is
# regenerated correctly, then smoke-tests the package before zipping.
#
# Run via `npm run build:zip` (which builds assets first).

set -euo pipefail

cd "$(dirname "$0")/.."

OUT=dist/observata

# Prefer php/composer on PATH; fall back to the PHP bundled with Local and
# tools/composer.phar (gitignored), so no system-wide install is needed.
PHP=$(command -v php || true)
if [ -z "$PHP" ]; then
	PHP=$(ls -d "$HOME/Library/Application Support/Local/lightning-services"/php-*/bin/*/bin/php 2>/dev/null | sort -V | tail -1 || true)
fi
if [ -z "$PHP" ]; then
	echo "Error: PHP not found. Install PHP or Local (localwp.com)." >&2
	exit 1
fi

if command -v composer >/dev/null 2>&1; then
	COMPOSER=(composer)
elif [ -f tools/composer.phar ]; then
	COMPOSER=("$PHP" tools/composer.phar)
else
	echo "Error: Composer not found. Download https://getcomposer.org/download/latest-stable/composer.phar to tools/composer.phar." >&2
	exit 1
fi

rm -rf "$OUT" dist/observata.zip
mkdir -p "$OUT/client/css"

cp -R \
	*.php style.css style-editor.css screenshot.jpg \
	composer.json composer.lock \
	blocks assets views build vendor inc page-templates \
	"$OUT/"

# Only admin.css is loaded from client/ at runtime (inc/admin-bar.php);
# everything else in client/ is source compiled into build/.
cp client/css/admin.css "$OUT/client/css/"

# Removes dev packages from the copied vendor/ and regenerates the autoloader.
# Packages already match composer.lock, so nothing is downloaded.
"${COMPOSER[@]}" install \
	--working-dir="$OUT" \
	--no-dev \
	--optimize-autoloader \
	--no-interaction \
	--no-progress \
	--quiet

rm -f "$OUT/composer.json" "$OUT/composer.lock"
find "$OUT" -name '.DS_Store' -delete

# Smoke test: the production autoloader must load Timber without dev packages.
"$PHP" -r '
	require $argv[1] . "/vendor/autoload.php";
	if ( ! class_exists( "Timber\\Timber" ) ) {
		fwrite( STDERR, "Smoke test failed: Timber not autoloadable\n" );
		exit( 1 );
	}
' "$OUT"

(cd dist && zip -rq observata.zip observata/)

echo "Built dist/observata.zip ($(du -h dist/observata.zip | cut -f1))"
