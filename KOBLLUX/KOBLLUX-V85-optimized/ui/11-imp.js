/* ui · imp */
KobBoot.mount('imp', `
  <div id="imp"><div class="panel">
      <div class="tabs"><div class="tab active" data-tab="text">📝 enviar</div><div class="tab" data-tab="audio">🎙️ Áudio→Texto</div><div class="tab" data-tab="file">📄 Arquivo (PDF/TXT/MD)</div></div>
      <div id="tab-text" class="tab-content active"><textarea id="srcText" placeholder="# PRÓLOGO
  Texto aqui..."></textarea><button class="btn" onclick="autoBuild(document.getElementById('srcText').value)">Gerar Livro</button> <button class="btn" onclick="autoBuildNested(document.getElementById('srcText').value)">Gerar (aninhado)</button> <button class="btn" onclick="pasteSrcText()">Colar</button> <button class="btn" id="btn-converter">Converter</button></div>
      <div id="tab-audio" class="tab-content"><textarea id="audioOutput" placeholder="Transcrição aqui..."></textarea><div style="display:flex;gap:8px;margin-top:8px"><button class="btn" id="startRec">🎤 Iniciar</button><button class="btn" id="stopRec">⏹ Parar</button><button class="btn" onclick="autoBuild(document.getElementById('audioOutput').value)">Usar Transcrição</button></div></div>
      <div id="tab-file" class="tab-content"><input type="file" id="fileInput" accept=".pdf,.txt,.md,.rtf, .html"><div id="filePreview" style="margin-top:10px;color:var(--muted);font-size:.9rem"></div></div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px"><button class="btn" onclick="closeImporter()">Fechar</button></div>
    </div></div>
`);
