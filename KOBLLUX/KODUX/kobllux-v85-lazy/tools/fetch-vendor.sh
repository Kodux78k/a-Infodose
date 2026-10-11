#!/bin/sh
# Baixa o PDF.js 3.11.174 (mesma versão do loader) para uso offline. Rode na raiz do projeto, com internet.
set -e
B=https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174
mkdir -p vendor/pdfjs
curl -fL "$B/pdf.min.js"        -o vendor/pdfjs/pdf.min.js
curl -fL "$B/pdf.worker.min.js" -o vendor/pdfjs/pdf.worker.min.js
ls -l vendor/pdfjs
