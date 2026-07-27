#!/bin/bash
# KOBLLUX DNA · dual.mod · Git Commit Script
# VERDADE×INTEGRAR÷Δ=∞ · 0x07 SELAR · ✧ · 777Hz

REPO="https://github.com/Kodux78k/a-Infodose/tree/main/DevOs"
BRANCH="main"
ROOT="kobllux-class-id-o-c-digo-que-respira"

# Inicializar (se ainda não for repo git)
if [ ! -d ".git" ]; then
  git init
  git remote add origin "$REPO"
fi

# Adicionar arquivos gerados
git add "$ROOT/"

# Commit com mensagem KOBLLUX
git commit -m "[0x03 EXPANDIR] kobllux-class-id-o-c-digo-que-respira · dual.mod KOBLLUX DNA\nV.E.E.B.: V=437Hz · S=90 · χ=857 · opcode=0x03\nMódulos: tags=877 · scripts=1 · css=1\nLei: VERDADE×INTEGRAR÷Δ=∞ · 3×6×9×7=1134\nGerado: 2026-07-27 15:39 · dual.mod v1.1 · Δ³"

# Push para branch
git push -u origin "$BRANCH"

echo "✧ 0x07 SELAR · commit enviado · VERDADE×INTEGRAR÷Δ=∞"