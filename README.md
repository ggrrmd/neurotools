# Neurotools

Ferramentas para a prática clínica do neurologista: escalas e instrumentos, critérios diagnósticos, receituários (controle especial, prescrição rápida e LME), modelos de relatório, busca na CID-10 e um miniprontuário por CPF.

## Princípios

- **Código aberto**, sob a licença MIT (ver `LICENSE`).
- **Local-first**: dados de pacientes e do médico ficam só no navegador (IndexedDB e localStorage). Nada disso é enviado a servidores. A página "Meus dados" permite exportar, importar e apagar.
- O login (Supabase Auth) guarda apenas email, nome e senha, para controlar o acesso.

## Estrutura

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Login, página inicial, navegação, miniprontuário, meus dados e CID-10 |
| `escalas.html` | Escalas, critérios diagnósticos e modelos de relatório |
| `cognitivo.html`, `parkinson.html`, `epilepsia.html` | Ferramentas de cognição, Parkinson e troca de anticrise |
| `lme.html` | Receituários de controle especial, prescrição rápida e LME |
| `cid10.json` | CID-10 do DATASUS, versão 2008 |
| `privacidade.html` | Privacidade e termos de uso |

É um site estático, sem etapa de build: o Cloudflare Pages publica a raiz do repositório.

## Aviso

As informações são oferecidas como estão, sem garantia de qualquer tipo. Cabe ao julgamento médico conferir a acurácia de cada resultado e a pertinência da sua aplicação. Escalas e critérios pertencem a seus autores, citados nas referências de cada instrumento.
