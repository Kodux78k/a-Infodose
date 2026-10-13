KOBLLUX V87 · State Core integrado

1. Abra index.html no seu fluxo habitual.
2. O KOBState preserva as chaves antigas e acompanha as gravações legadas.
3. Histórico: KOBState.history.add(item), .list(), .count(), .clear().
4. Arquétipo: KOBState.setArchetype("ATLAS"). O formato original maiúsculo é preservado.
5. Players próprios (Tone/Web Audio): chame KOBState.setAudio({ playing: true, source: "tone" }) e atualize para false no evento real de parada.

Consulte RELATORIO-V87.md para mudanças e limites de validação.
