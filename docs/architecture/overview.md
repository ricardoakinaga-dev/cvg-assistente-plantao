# Arquitetura atual

```text
WhatsApp da equipe
       │ webhook com segredo
       ▼
Server HTTP ── allowlist de membros e grupos diretos
       │
       ▼
Fila local ── registro append-only e anexos no volume persistente
       │
       ├── áudio ──► Whisper local
       ├── texto ───► provider OpenAI-compatible ──► JSON validado
       ├── foto ────► anexo salvo; legenda organizada
       │
       ├── montagem determinística da resposta e das tarefas
       └── comandos e lembretes ──► WhatsApp da equipe
```

O modelo retorna estrutura; não recebe tools. O aplicativo valida o JSON, persiste nota e tarefas e envia uma resposta à pessoa que escreveu. Na fase 1 não há leitura nem escrita no HIS. O profissional revisa a nota e faz o registro no HIS por conta própria.

## Fronteiras

- `src/shift-assistant/server.ts`: segredo do webhook, limite de corpo, health e entrada HTTP.
- `whatsapp.ts`, `transcriber.ts`, `organizer.ts`: adapters de canal, Whisper e modelo.
- `assistant.ts`, `commands.ts`, `domain.ts`: fluxo, tarefas, comandos e contrato de saída.
- `store.ts`: reconstrução em memória de `events.jsonl` e armazenamento das mídias.
- `packages/shift-model-provider`: adapter OpenAI-compatible extraído para este produto.
- `packages/shared`: classificação e proteção de egress usadas pelo adapter.
- `deploy/shift-assistant`: imagem e Compose do serviço.

## Relação com o Operational Harness

O processo de runtime, orquestrador, policy, approval, journal e worker do `cvg-operational-harness` não compõe este serviço. A aplicação usa somente um adapter de provider e helpers necessários ao transporte. Não há import em runtime do repositório antigo. As cópias e seus hashes de origem estão no [manifesto de proveniência](source-manifest.json).

Essa decisão permite que cada repositório seja validado e liberado no seu próprio ritmo. Uma futura integração é uma mudança de arquitetura e exige contrato e revisão próprios; não está implícita nesta extração.

## Limites conhecidos

Consulte [auditoria inicial](../initial-audit.md). Em particular, tarefas ainda são criadas antes de confirmação, erros transitórios podem ser encerrados sem retry, o scheduler pode duplicar envio concorrente e o backup/alerta não têm prova operacional. O diagrama mostra a estrutura, não comprova controles de deploy.
