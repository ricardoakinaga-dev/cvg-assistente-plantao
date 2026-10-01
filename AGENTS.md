# Instruções do repositório — Assistente de Plantão CVG

Este repositório contém somente o Assistente de Plantão e seus componentes locais. O Operational Harness continua em https://github.com/ricardoakinaga-dev/cvg-operational-harness.

- Missão e decisões: `docs/decisions/ADR-001-missao-assistente.md`.
- Contrato da fase 1: `docs/phase-1.md`.
- Operação: `docs/runbook.md`.
- Estado e achados conhecidos: `docs/initial-audit.md`.

Use apenas dados sintéticos em desenvolvimento. Não use dados reais de pacientes em testes ou demonstrações. O assistente não escreve no HIS, não executa comandos e não fala com tutores. Não conecte provedor, canal ou serviço real sem a configuração e decisão correspondentes documentadas. Uso real permanece bloqueado enquanto os itens aplicáveis da barra de liberação e os achados críticos estiverem abertos.

Antes de BUILD, vincule a mudança a uma task do backlog de fase 1 em `docs/phase-1.md`, confira decisões da ADR e atualize documentação e evidências. Para mudança de contrato ou segurança, descreva a SPEC e seus critérios antes de implementar. Nunca inclua `.env`, tokens, dados operacionais, mídias de pacientes ou backups no Git.

Comandos disponíveis: `npm run typecheck`, `npm run lint`, `npm run docs:check`, `npm run bundle` e `npm test`. O comando `npm run verify` executa esses gates em sequência.
