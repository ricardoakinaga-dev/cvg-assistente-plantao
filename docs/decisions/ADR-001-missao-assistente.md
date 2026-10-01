# ADR-001 — Assistente de Plantão como projeto independente

- Status: aceita pelo usuário em 30/09/2026; extração para repositório próprio executada em 01/10/2026.
- Repositório: `ricardoakinaga-dev/cvg-assistente-plantao`.
- Projeto de origem: `ricardoakinaga-dev/cvg-operational-harness`.
- Captura do código de origem: checkout com HEAD `cc1402ff163a34352c10405e9e5c77c653596084`, inspecionado em 01/10/2026; os arquivos do assistente e dependências selecionadas foram registrados por SHA-256 em `docs/architecture/source-manifest.json`.

## Contexto

O harness genérico e o assistente têm objetivos e ritmos de produto diferentes. Manter ambos no mesmo repositório confundia a missão, o backlog, as verificações e o que significava estar pronto para uso.

## Decisão

Este projeto contém o Assistente de Plantão: uma aplicação focada em registrar o plantão da equipe, preparar notas para revisão e acompanhar pendências. O `cvg-operational-harness` permanece um repositório distinto para runtime reutilizável de agentes.

O assistente não depende do runtime de execução do Operational Harness. O provider compatível com API OpenAI e os helpers de classificação/egress incluídos em `packages/` são um recorte local das fontes do repositório de origem, necessário para a aplicação nesta versão. Essa cópia tem proveniência registrada e pode ser substituída por uma dependência versionada quando houver um pacote com contrato e publicação estáveis.

## Decisões de produto preservadas

- WhatsApp da equipe por WAHA ou Evolution, com número dedicado, por decisão D1.
- Whisper local para transcrição; modelo externo compatível com API OpenAI apenas para organizar o texto, sem ferramentas, por D2.
- Piloto por turno com equipe da internação, por D3.
- Áudios, conversas e notas são documentos sem expiração automática; só saem da base ativa após backup confirmado, por D4.
- O HIS permanece fonte da verdade. Fase 1 não lê nem escreve no HIS.

## Consequências

- Este repositório passa a ter seu próprio README, instruções, documentação de fase, runbook, scripts de verificação e ciclo de release.
- Mudanças no Operational Harness não se aplicam automaticamente a esta cópia do provider; provenance deve ser atualizada ao sincronizar alterações.
- Recursos de outras fases, como HIS, passagem de turno, escalonamento e painel, ficam fora do contrato atual.
- A separação de repositórios não resolve os riscos listados na auditoria inicial e não libera o uso real.
