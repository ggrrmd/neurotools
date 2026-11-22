# Guia para manutenção do Neurotools

Este guia serve para quem for alterar o site (inclusive uma nova conversa com o Claude).

## Onde está cada coisa

- **Código-fonte e site publicado são o mesmo repositório**: github.com/ggrrmd/neurotools, branch `main`. Não há etapa de build: cada push publica sozinho no Cloudflare (Worker com assets estáticos, configurado em `wrangler.jsonc`). Endereço oficial: https://neurotools.com.br (domínio no Registro.br, DNS no Cloudflare); o endereço https://neurotools.ggrr-md.workers.dev continua ativo.
- `.assetsignore` lista o que não vai para o site (README, CHANGELOG, docs, arquivos técnicos).

| Arquivo | O que tem |
|---|---|
| `index.html` | Casca do site: login (Supabase), menu, página inicial, páginas de seção, miniprontuário, Meus dados, CID-10. Contém o catálogo de ferramentas (`ANTIGAS`, `ESCALAS`, `SECAO`, `DOENCA`, `SUBG`, `DESC`, `CRIT_PREVISTOS`, `REL_PREVISTOS`) e a versão (`NT_VERSAO`). |
| `escalas.html` | Motor `NT.def({...})` com todas as escalas, os critérios diagnósticos (blocos "lote 1" a "lote 4") e os relatórios de texto (bloco "Relatórios"). |
| `cognitivo.html`, `parkinson.html`, `epilepsia.html` | Ferramentas em React já compiladas (minificadas). Edite com cuidado, por substituição de trechos. |
| `lme.html` | Receituários e LME, gera PDFs com pdf-lib. |
| `exames.html` | Pedido de exames (HTML/JS puro). Traz o recorte da TUSS embutido (`TUSS_CAT`, `TUSS_SUB`, `TUSS`), a busca com sinônimos (`TROCAS`, `PACOTES`) e os geradores de Word (XML do Office num zip sem compressão) e de PDF (fontes padrão Helvetica e Courier em WinAnsi, carimbo convertido em JPEG), ambos feitos à mão, sem biblioteca externa. Guarda no `localStorage` o estado de trabalho (`nt.exEstado`, sem o nome do paciente), os modelos (`nt.exModelos`) e a foto do carimbo (`nt.carimbo`). |
| `docs/tuss-recorte.xlsx`, `docs/gerar_tuss.py` | Planilha do recorte da TUSS e o script que gera o bloco de dados de `exames.html` (com os sinônimos de busca de cada código). |
| `cid10.json` | CID-10 do DATASUS, versão 2008. |
| `privacidade.html`, `404.html` | Páginas estáticas. |
| `worker.js` | Única parte com servidor: responde a `POST /api/contato` (botão "Fale conosco"), confere a sessão no Supabase e envia o email pelo Resend. Todo o resto é servido como arquivo estático (`env.ASSETS`). |

## Como acrescentar

- **Escala, critério ou relatório**: crie um `NT.def({ id, area, nome, ... })` em `escalas.html` (antes da linha final que abre a escala pelo endereço) e acrescente a entrada em `ESCALAS` no `index.html`. Para critério, ponha também `id: 'criterios'` em `SECAO` e a doença em `DOENCA`; para relatório, `id: 'relatorios'` em `SECAO` e uma descrição em `DESC`. Todo instrumento termina com `refs` em estilo Vancouver.
- **Dados do médico** vêm de `localStorage.lme_cfg` (tela "Dados do médico" do LME); nas ferramentas React, pelo objeto `window.NTMED`. Nunca escreva dados pessoais no código.
- **Dados de pacientes** ficam só no navegador (IndexedDB `neurotools`, objeto `ntLocal` no `index.html`). Nada de paciente vai para servidor.

## Dúvidas mais comuns

- Perguntas e respostas na lista `DUVIDAS` do `index.html` (grupos com pares pergunta e resposta; a resposta aceita HTML, com `data-ir` para links internos e `data-contato` para abrir o Fale conosco). A página é a vista `duvidas`.

## Pedido de exames: como mexer na TUSS

- **Novo exame ou código**: acrescente a linha em `docs/tuss-recorte.xlsx` (aba "Recorte TUSS"), ponha sinônimos no dicionário `A` de `docs/gerar_tuss.py`, rode `python3 docs/gerar_tuss.py docs/tuss-recorte.xlsx tuss.js` e troque em `exames.html` o bloco de `var TUSS_CAT` até o fim de `var TUSS = [...]` pelo conteúdo gerado.
- **Pacote** (ex.: função renal = ureia + creatinina): lista `PACOTES` em `exames.html`.
- O modo de cada aba é aberto pela casca com `NTEX.modo('livre' | 'rapido' | 'detalhado' | 'modelos')`; os itens do catálogo são `exames-livre`, `exames-rapido`, `exames-detalhado` e `exames-modelos` (seção `exames`).

## Miniprontuário: comentários

- Escalas, critérios e relatórios: campo `comentario` (e `comentadoEm`) no próprio registro do IndexedDB.
- Receitas e LME: campo `comentario` no item de `historico` do paciente no arquivo do LME (o `lme.html` copia o documento inteiro ao gravar, então o comentário é preservado).

## LME: como acrescentar um PCDT

Em `lme.html`, cada condição tem entradas com a mesma chave em `DOENCAS` (CIDs, diagnóstico e anamnese padrão), `CATALOGO` (medicamentos), `EXAMES` (primeira liberação e renovação) e `TER` (termo de esclarecimento), além de `ORDEM`, `SUBT` e `NOME_DOENCA` no app e `DOENCA_LME` no `index.html`. Campos dos medicamentos: `ceaf` (vai ao LME), `ctrl: false` (receituário simples em vez de controle especial), `notifA` (exige Notificação de Receita A, fica fora da receita), `forma: "out"` com `poso`, `qtd`, `un` e `via` para posologia fixa, `cada` (intervalo em meses entre aplicações), `aviso` e `ter` (opções marcadas no TER).

## Versões

1. Faça as mudanças e teste localmente (`python3 -m http.server` na pasta do repositório).
2. Atualize `NT_VERSAO` (`index.html`) e escreva a entrada no `CHANGELOG.md`.
3. Faça o commit, crie a tag (`git tag v1.1.0`) e envie (`git push --follow-tags`).

## Configuração externa

- **Supabase**: projeto `alxkympzfvjhrmbpuzfh`; a chave publishable fica em `window.NT_SUPABASE` no `index.html` (é pública por natureza). Site URL e Redirect URLs apontam para o endereço do site. Emails enviados pelo Resend (SMTP smtp.resend.com, remetente Neurotools <nao-responda@neurotools.com.br>, domínio verificado; plano gratuito de 100 emails/dia). Modelos de email em português em Authentication > Emails. Contato do projeto: neurotools.contato@gmail.com.
- **DNS (Cloudflare)**: DMARC em `p=none` desde 08/11/2026; endurecer para `p=quarantine` depois de algumas semanas sem problemas de entrega.
- **Cloudflare**: Workers & Pages > neurotools.
- **Contato (Fale conosco)**: o `worker.js` precisa do segredo `RESEND_API_KEY` (Workers & Pages > neurotools > Settings > Variables and Secrets, tipo Secret), com uma chave de API do Resend com permissão de envio. Sem o segredo, o envio responde 503 e o site oferece abrir o programa de email do usuário. Limite de 5 mensagens por conta por hora; as mensagens dividem a cota diária do Resend com os emails de login.

## Pendências conhecidas

- Revisão de direitos autorais das escalas (MDS-UPDRS, HIT-6, ISI, IRLS, Epworth, NPI-Q, TETRAS, TWSTRS, UMSARS, PSPRS, Mini-ACE e textos de DSM-5-TR, ICSD-3-TR e ICHD-3).
- Conferir no original: lista de tipos de crise da ILAE 2025, regra de narcolepsia tipo 1 na ICSD-3-TR, categorias da neuropatia motora multifocal, regra de PIDC possível com critérios de apoio, detalhes da revisão de 2024 dos critérios de McDonald.
- Relatório de aposentadoria por incapacidade (aguardando modelo; reativar com uma entrada em `REL_PREVISTOS` ou como relatório pronto).
- Substituir `cid10.json` pelo arquivo baixado diretamente do DATASUS.
