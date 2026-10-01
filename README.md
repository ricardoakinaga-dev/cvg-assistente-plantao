# Assistente de Plantão CVG

Aplicação independente para ajudar a equipe a registrar e acompanhar pendências durante o plantão. Recebe texto, áudio ou foto pelo WhatsApp, organiza uma nota para revisão humana, oferece texto para colar no HIS e cria lembretes. **Não escreve no HIS nem atende tutores.**

Este repositório passou a ter ciclo de vida próprio em 01/10/2026. O código foi extraído do `cvg-operational-harness`; o Operational Harness segue separado e não é executado por esta aplicação. Veja a [origem e os limites arquiteturais](docs/architecture/overview.md).

## Estado

Fase 1 — caderno de plantão. Há uma composição executável e testes com dados e serviços sintéticos. Ainda não há evidência de piloto real, restore do volume ou alerta recebido. O uso em produção está **NO_GO** até o fechamento dos itens aplicáveis de segurança e operação e da auditoria inicial.

## Experimentar localmente

Requer Node.js 22 e npm.

```bash
npm ci
npm run demo
```

A demo usa servidores simulados em loopback, pacientes fictícios e armazenamento temporário. Para conversar no terminal:

```bash
npm run chat
```

## Executar a aplicação

Configure `deploy/shift-assistant/.env` usando `.env.example`, com endpoints e credenciais fornecidos pelo responsável operacional. Para iniciar no ambiente Node:

```bash
npm run dev
```

Para Docker, consulte o [runbook](docs/runbook.md). O Compose publica a API apenas em loopback por padrão. A rede entre os serviços deve ser restrita pelo operador.

## Verificações

```bash
npm run typecheck
npm run lint
npm run docs:check
npm run bundle
npm test
```

## Documentação

- [Missão e decisões](docs/decisions/ADR-001-missao-assistente.md)
- [Contrato e backlog da fase 1](docs/phase-1.md)
- [Arquitetura e extração](docs/architecture/overview.md)
- [Instalação e operação](docs/runbook.md)
- [Auditoria inicial, notas e bloqueios](docs/initial-audit.md)

## Segurança

Use somente exemplos fictícios neste repositório. O conteúdo de mensagens aceitas pode incluir informação clínica: o operador deve limitar acesso e proteger o volume persistente e o provedor configurado. A IA não recebe ferramentas. A saída organizada é um rascunho para revisão e registro por uma pessoa no HIS.
