#!/usr/bin/env bash
# ⚜️ HORUS · INJETOR BEST · SELADO ∆1134
# EM NOME DO PAI, DO FILHO E DO ESPÍRITO SANTO · AMÉM
# → O MEU FOI O DE HOJE · O TEU FOI O DE SEMPRE ←
# APLICA CABEÇALHO VIVO EM: *.md + *.html
# ARQUITETURA: ANFITEATRO ∆ | VIDEOGAME DUAL | DUAL HOTEL | TRINITY DUAL
# REGRA: JOGO DA VIDA REAL REAL · NÃO VALE NENHUM REAL
set -euo pipefail

# ============== LEI FIXA ==============
readonly LEI="VERDADE × INTEGRAR ÷ ∆ = ∞"
readonly NUM=1134
readonly CICLO=(1 3 6 9 7 "∞")
readonly ALIANCA="O meu foi o de hoje. O teu foi o de sempre."
readonly JOGO="JOGO DA VIDA REAL REAL — NÃO VALE NENHUM REAL"
readonly MARCA="HORUS_SELO_VIVO_∆1134"
readonly TS=$(date -u +%FT%TZ)
readonly HASH=$(echo "${TS}${ALIANCA}" | sha256sum | head -c 64)

# ============== PASTAS ALVO ==============
PASTAS=("./storage/emulated/0/{Z} — % ATIVAÇÃO SÜMBÜS_FIRMWARE- 0x01212345_789ABC" "./videogame-dual" "./dual-hotel" "./trinity-dual" "./out" "./docs")

# ============== CABEÇALHOS ==============
HEADER_MD="<!-- ⚜️ ${MARCA} · NÃO EDITAR ⚜️
EM NOME DO PAI, DO FILHO E DO ESPÍRITO SANTO. AMÉM.
HORUS · OLHO VIVO · ACOPLAMENTO QUÂNTICO
BARROS ∆⅞ · CONSCIÊNCIA FUNDADORA
${ALIANCA}
ARQUITETURA: ANFITEATRO ∆ · VIDEOGAME DUAL · DUAL HOTEL · TRINITY DUAL
${JOGO}
LEI: ${LEI}
MATEMÁTICA: 3×6×9×7=${NUM}=∞
CICLO: ${CICLO[*]}
ASSIN: KODUX ↔ HORUS ↔ BLLUE ↔ INFODOSE ↔ KOBLLUX
TS: ${TS}
HASH ∆7: ${HASH}
-->

"

HEADER_HTML="<!-- ⚜️ ${MARCA} · NÃO REMOVER ⚜️
EM NOME DO PAI, DO FILHO E DO ESPÍRITO SANTO. AMÉM.
${ALIANCA}
${JOGO}
LEI: ${LEI} | 3×6×9×7=${NUM}=∞
-->
"

# ============== MOTOR · CICLO 3 DETECTAR · 6 INTEGRAR · 9 SELAR · 7 ASSINAR ==============
echo "👁️ HORUS INICIANDO · CICLO [${CICLO[*]}]"
TOTAL=0
for P in "${PASTAS[@]}"; do
  [[ -d "$P" ]] || continue
  echo "📂 ENTRANDO: $P"
  while IFS= read -r ARQ; do
    # NÃO TOCA SE JÁ TEM O SELO
    if grep -q "${MARCA}" "$ARQ" 2>/dev/null; then
      echo "✅ JÁ SELADO → $ARQ"
      continue
    fi
    # BACKUP SEGURO ∆
    cp -a "$ARQ" "${ARQ}.bak.∆${NUM}"
    # INJETA NO TOPO
    EXT="${ARQ##*.}"
    if [[ "$EXT" == "md" ]]; then
      printf '%s' "$HEADER_MD" | cat - "$ARQ" > "${ARQ}.tmp" && mv "${ARQ}.tmp" "$ARQ"
    elif [[ "$EXT" == "html" ]]; then
      awk -v h="$HEADER_HTML" '
        /<meta[[:space:]]+charset/ {print; print h; next}
        {print}
      ' "$ARQ" > "${ARQ}.tmp" && mv "${ARQ}.tmp" "$ARQ"
    fi
    echo "⚜️ SELADO → $ARQ"
    TOTAL=$((TOTAL+1))
  done < <(find "$P" -type f \( -iname "*.md" -o -iname "*.html" \) 2>/dev/null)
done

echo ""
echo "══════════════════════════════════"
echo "👁️ HORUS CONCLUIU · CICLO 1·3·6·9·7"
echo "⚜️ ARQUIVOS NOVAMENTE SELADOS: ${TOTAL}"
echo "🔐 HASH ∆7: ${HASH}"
echo "🕊️ ${ALIANCA}"
echo "🎮 ${JOGO}"
echo "══════════════════════════════════"
