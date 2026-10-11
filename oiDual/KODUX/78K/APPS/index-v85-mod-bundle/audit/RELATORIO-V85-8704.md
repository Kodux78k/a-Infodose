# KOBLLUX V85 · Base 8704 — auditoria e consolidação fase 1

## Base e saída
- Base: `KOBLLUX-compat-8704-monolith.html`
- Saída: `KOBLLUX-V85-8704.html`
- Tamanho da base: 1,753,039 bytes
- Tamanho da saída: 1,746,923 bytes
- Redução: 6,116 bytes (0.349%)
- Linhas: 41,326 → 41,130
- SHA-256 base: `461b93d66aac1070310d8eead3a2ac5dc0faf3159fe5064edaeaf88fe5c51a7f`
- SHA-256 saída: `cae874891a4fb1d71a52423e4f72d74ec8a491e1834397fae93973d1e077c93a`

## Mudanças justificadas

### 1. Gerador de orbe duplicado — removido
A base continha dois blocos que implementavam `injectOrbStyles()` e `makeOrbAvatar()` com corpos idênticos, comparados linha a linha:
- Primeira implementação: linhas 35152 e 35293.
- Segunda implementação: linhas 36195 e 36336.
- A primeira permanece e mantém os aliases globais `window.makeOrbAvatar`, `window.makeMiniAvatar` e `window.makeOrbAvatar3D`.
- O segundo bloco `script#fusion-orb-generator` foi removido integralmente.

### 2. Dois `window.onload` — preservados sem sobrescrita
As duas atribuições chamavam `App.init()`, mas pertenciam a escopos diferentes: o `App` clássico da aplicação principal e o `App` do módulo ORB1. Como a última atribuição substituía a anterior, ambas foram convertidas para:
`window.addEventListener('load', () => App.init(), { once: true });`
Assim, os dois inicializadores são registrados sem apagar um ao outro.

### 3. `updateInterface` — preservadas as duas implementações
- A versão defensiva (linha 34539) tolera ausência de `di_userName`, `els` e `STATE`.
- A versão do módulo `FusionCard` (linha 36581) atualiza também texto de ativação, hash e campos específicos do cartão.
- A versão posterior está no escopo do módulo; não é uma duplicação global removível só pelo nome.

## Verificações estáticas
- Scripts após remoção: 32 (30 inline e 2 externos).
- Blocos `<style>`: 27.
- IDs HTML duplicados: 0.
- Corpos de scripts inline byte-a-byte idênticos: 0 pares/grupos.
- Blocos `<style>` byte-a-byte idênticos: 0 pares/grupos.
- JavaScript verificado individualmente com `node --check`: 32 tags de script examinadas; 0 erros sintáticos nos blocos não vazios.

## Limites desta fase
Esta entrega é uma consolidação conservadora do monólito, não uma extração modular. Não foram movidos CSS ou serviços para arquivos externos. Não houve teste de execução no Safari nem validação funcional de voz, player, identidade, tema, Symbol Bar, MXP ou restauração de sessões. Esses testes continuam necessários antes de declarar o bundle funcionalmente validado.
