#!/usr/bin/env bash
set -euo pipefail
roots=("$HOME")
[ -d /sdcard ] && roots+=("/sdcard")
printf "# Repositórios locais encontrados\n\n"
for root in "${roots[@]}"; do
  mapfile -t repos < <(find "$root" -type d -name .git 2>/dev/null | sed 's|/.git$||' | sort)
  [ ${#repos[@]} -eq 0 ] && continue
  echo "## $root"
  for d in "${repos[@]}"; do
    remote=$(git -C "$d" remote get-url origin 2>/dev/null || echo "(sem origin)")
    echo "- $d  →  $remote"
  done
  echo
done
