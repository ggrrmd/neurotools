# Histórico de versões

Numeração: **1.x** para entregas com novidades (novas escalas, critérios, relatórios ou seções); **1.x.y** para correções pequenas; **2.0** reservado para mudança grande de estrutura.

## 1.1.2 (9 de novembro de 2026)

- Endereço oficial: aberto por outro endereço (como neurotools.ggrr-md.workers.dev), o site vai direto para neurotools.com.br; se houver dados guardados no endereço antigo, mostra um aviso com o botão para exportar a cópia antes de mudar.

## 1.1.1 (9 de novembro de 2026)

- Lembrete semanal de cópia de segurança: a página Meus dados mostra a data da última cópia (.json), e a página inicial avisa quando há dados novos e a última cópia tem 7 dias ou mais (ou nunca foi feita).

## 1.1.0 (9 de novembro de 2026)

- LME: seis novos PCDTs (distonia e espasmo hemifacial, dor crônica, esclerose lateral amiotrófica, espasticidade, miastenia gravis e osteoporose), com CID, medicamentos, exames e termo de esclarecimento de cada protocolo; condições em ordem alfabética.
- LME: medicamentos não controlados saem em receituário simples; os controlados continuam na receita de controle especial; morfina e metadona entram no laudo, mas não na receita (exigem Notificação de Receita A). Toxina botulínica, pamidronato e ácido zoledrônico só aparecem nos meses de aplicação, no laudo e nas receitas.
- Cabeçalhos e assinaturas de receitas, LME, pedidos de exames, fichas e relatórios passam a mostrar "CRM:" e "RQE:" antes dos números.
- Escalas e instrumentos (Movimento): tabela de antipsicóticos, bloqueio D2 e risco de parkinsonismo.
- Epilepsia: "Troca de FAE (cronograma)". Relatório de isenção de IR (e demais relatórios): campo "Sexo" no lugar de "Concordância".
- Botão "Sair da conta" visível no menu; alerta de receitas a renovar desabilitado; relatório de aposentadoria retirado da lista até ficar pronto.
- Textos do login, do rodapé e da página inicial revistos; referências a "neste aparelho" passam a "neste navegador".
- Login: traçado de EEG sem a cintilação na área do paroxismo.

## 1.0.0 (7 de novembro de 2026)

Primeira versão pública.

- Login com Supabase (entrar, criar conta com confirmação por email, nova senha) e página inicial com favoritos.
- Receituários: receita de controle especial (RDC 1.000/2025), prescrição rápida e LME dos PCDTs de Parkinson, Alzheimer, epilepsia e esquizofrenia.
- Escalas e instrumentos: 57 instrumentos em cognição, movimento, epilepsia, neuromuscular, cefaleia, sono, dor neuropática e vascular.
- Critérios diagnósticos: 53 critérios em 9 áreas, incluindo neuroimunologia e psiquiatria.
- Relatórios: antiamiloide, foslevodopa, anti-CGRP, isenção de imposto de renda, interdição, pessoa com deficiência, toxina botulínica e atestado.
- CID-10 do DATASUS (versão 2008) com busca por palavra ou código.
- Miniprontuário por CPF e página Meus dados (exportar, importar, apagar), tudo guardado só no aparelho.
- Referência em estilo Vancouver em cada instrumento e aviso de código aberto e isenção de responsabilidade em todas as páginas.
