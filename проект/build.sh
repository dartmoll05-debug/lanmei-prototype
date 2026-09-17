#!/bin/bash
# Пересборка прототипа Lanmei в один открываемый с диска файл dist/index.html.
# pnpm exec vite build молча падает на проверке зависимостей — зовём vite напрямую.
set -e
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd "$(dirname "$0")"
node_modules/.bin/vite build
python3 - <<'PY'
import io, re
h=io.open('dist/index.html',encoding='utf-8').read()
js=re.search(r'<script type="module"[^>]*src="\./(assets/[^"]+\.js)"[^>]*></script>',h)
css=re.search(r'<link rel="stylesheet"[^>]*href="\./(assets/[^"]+\.css)"[^>]*>',h)
if css: h=h.replace(css.group(0),'<style>'+io.open('dist/'+css.group(1),encoding='utf-8').read()+'</style>')
if js:  h=h.replace(js.group(0),'<script type="module">'+io.open('dist/'+js.group(1),encoding='utf-8').read().replace('</script>','<\\/script>')+'</script>')
io.open('dist/index.html','w',encoding='utf-8').write(h)
print('встроено: dist/index.html открывается двойным кликом')
PY
