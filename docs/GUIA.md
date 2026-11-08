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
| `cid10.json` | CID-10 do DATASUS, versão 2008. |
| `privacidade.html`, `404.html` | Páginas estáticas. |

## Como acrescentar

- **Escala, critério ou relatório**: crie um `NT.def({ id, area, nome, ... })` em `escalas.html` (antes da linha final que abre a escala pelo endereço) e acrescente a entrada em `ESCALAS` no `index.html`. Para critério, ponha também `id: 'criterios'` em `SECAO` e a doença em `DOENCA`; para relatório, `id: 'relatorios'` em `SECAO` e uma descrição em `DESC`. Todo instrumento termina com `refs` em estilo Vancouver.
- **Dados do médico** vêm de `localStorage.lme_cfg` (tela "Dados do médico" do LME); nas ferramentas React, pelo objeto `window.NTMED`. Nunca escreva dados pessoais no código.
- **Dados de pacientes** ficam só no navegador (IndexedDB `neurotools`, objeto `ntLocal` no `index.html`). Nada de paciente vai para servidor.

## Versões

1. Faça as mudanças e teste localmente (`python3 -m http.server` na pasta do repositório).
2. Atualize `NT_VERSAO` e a versão no texto do login (`index.html`), e escreva a entrada no `CHANGELOG.md`.
3. Faça o commit, crie a tag (`git tag v1.1.0`) e envie (`git push --follow-tags`).

## Configuração externa

- **Supabase**: projeto `alxkympzfvjhrmbpuzfh`; a chave publishable fica em `window.NT_SUPABASE` no `index.html` (é pública por natureza). Site URL e Redirect URLs apontam para o endereço do site. Emails enviados pelo Resend (SMTP smtp.resend.com, remetente Neurotools <nao-responda@neurotools.com.br>, domínio verificado; plano gratuito de 100 emails/dia). Modelos de email em português em Authentication > Emails. Contato do projeto: neurotools.contato@gmail.com.
- **DNS (Cloudflare)**: DMARC em `p=none` desde 08/11/2026; endurecer para `p=quarantine` depois de algumas semanas sem problemas de entrega.
- **Cloudflare**: Workers & Pages > neurotools.

## Pendências conhecidas

- Revisão de direitos autorais das escalas (MDS-UPDRS, HIT-6, ISI, IRLS, Epworth, NPI-Q, TETRAS, TWSTRS, UMSARS, PSPRS, Mini-ACE e textos de DSM-5-TR, ICSD-3-TR e ICHD-3).
- Conferir no original: lista de tipos de crise da ILAE 2025, regra de narcolepsia tipo 1 na ICSD-3-TR, categorias da neuropatia motora multifocal, regra de PIDC possível com critérios de apoio, detalhes da revisão de 2024 dos critérios de McDonald.
- Relatório de aposentadoria por incapacidade (aguardando modelo).
- Substituir `cid10.json` pelo arquivo baixado diretamente do DATASUS.
