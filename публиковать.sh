#!/bin/bash
# Пересобирает оба варианта, копирует dist в blue/ и violet/, коммитит и пушит — Pages обновится сам.
set -e; cd "$(dirname "$0")"
bash проект/build.sh && bash проект-фиолет/build.sh
rm -rf blue violet && cp -R проект/dist blue && cp -R проект-фиолет/dist violet
git add -A && git commit -m "Обновление прототипа $(date +%d.%m.%Y)" && git push
