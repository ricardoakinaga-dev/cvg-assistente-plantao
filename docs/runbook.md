# Runbook — Fase 1

Contrato da fase: [`phase-1.md`](phase-1.md). Barra de liberação: [`release-bar.md`](release-bar.md).

## Serviços necessários

1. WAHA ou Evolution API com número dedicado da equipe.
2. Servidor Whisper local compatível com `POST /v1/audio/transcriptions`.
3. Modelo externo compatível com `/chat/completions`, por HTTPS e sob o tratamento de dados aprovado.
4. Volume persistente para `SHIFT_DATA_DIR`, incluído em backup.

Para executar o Node fora do Docker, `SHIFT_DATA_DIR` precisa apontar para um diretório local gravável; o `.env.example` usa `./runtime-data`. No Compose, o ambiente é ajustado para `/data`, que fica no volume persistente.

## Demonstração segura

```bash
npm ci
npm run demo
npm run chat
```

As duas opções usam serviços simulados e dados fictícios. `chat` suporta `/audio <fala>`, `/avancar 2h`, `/gestor <mensagem>` e `/sair`.

## Docker Compose

```bash
cp deploy/shift-assistant/.env.example deploy/shift-assistant/.env
# preencher a configuração aprovada no ambiente seguro
docker compose -f deploy/shift-assistant/compose.yaml up -d --build
curl http://127.0.0.1:3400/health
```

O exemplo mantém a API vinculada a `127.0.0.1`. A integração do webhook deve ocorrer por rede interna controlada. Defina regras de rede de saída para WAHA/Evolution, Whisper e modelo antes de qualquer conexão operacional. Não exponha esta porta diretamente à internet.

## Variáveis

| Variável                                                   | Uso                                          |
| ---------------------------------------------------------- | -------------------------------------------- |
| `SHIFT_PROVIDER`                                           | `waha` ou `evolution`                        |
| `SHIFT_MEMBERS`                                            | Allowlist `telefone=Nome;telefone=Gestor*`   |
| `SHIFT_WEBHOOK_SECRET`                                     | Segredo de no mínimo 24 caracteres           |
| `SHIFT_DATA_DIR`                                           | Diretório de `events.jsonl` e `media/`       |
| `SHIFT_HOST`, `SHIFT_PORT`                                 | Interface e porta do servidor                |
| `SHIFT_TICK_SECONDS`                                       | Intervalo do scheduler, mínimo de 10 s       |
| `WAHA_URL`, `WAHA_API_KEY`, `WAHA_SESSION`                 | Configuração de WAHA                         |
| `EVOLUTION_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE` | Configuração Evolution                       |
| `WHISPER_URL`, `WHISPER_MODEL`                             | Transcrição local                            |
| `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`, `LLM_LOCATION` | Modelo compatível; externo por padrão, HTTPS |

O processo falha ao iniciar se faltar configuração obrigatória e não deve imprimir valores de segredo. Nunca comite `.env`.

## Webhooks

- WAHA: `POST /webhooks/waha`, evento `message`.
- Evolution: `POST /webhooks/evolution`, evento `MESSAGES_UPSERT`.
- Preferir header `x-cvg-webhook-secret`; query string `?secret=` é fallback e pode vazar em logs de proxy.
- Só mensagens diretas dos números configurados são aceitas. Teste lista de membros e número desconhecido antes de ligar o canal.

## Uso

Envie `ajuda`. Para registrar, mande áudio/texto/foto; confira os campos e valores. Comandos: `pendências`, `feito N`, `adiar N 30`, `ok`, `corrigir <texto>`. O gestor cadastrado pode usar `pausar assistente` e `retomar assistente`.

O texto gerado é rascunho. Revise-o e faça o registro oficial no HIS. Não use para prescrição ou decisão clínica. Não deixe o assistente falar com tutor.

## Retenção, backup e parada

- Nenhuma mídia/evento é expirada automaticamente. Restrinja o acesso ao volume.
- Inclua eventos e mídias no backup. Antes de considerar o piloto pronto, faça restore e confira uma amostra sintética entre ambos; registre o procedimento sem dados sensíveis.
- Pausar pelo comando do gestor reduz envios, mas a auditoria encontrou bloqueio quando um envio está pendente. Até corrigir/retestar, o procedimento emergencial é parar o processo pelo operador e preservar o volume.
- Para parar Compose: `docker compose -f deploy/shift-assistant/compose.yaml down`. O volume nomeado `shift-data` permanece. Não use `down -v` sem decisão explícita de descarte e backup verificado.
- `GET /health` indica que a API responde; na versão atual, isso não prova que a fila e os lembretes estão operacionais.

## Piloto

Ainda não iniciado/comprovado. Quando a barra aplicável for atendida e houver autorização operacional, registrar por turno notas, pendências, fechamentos, problemas e feedback dos participantes durante duas semanas. Ao final, decisão humana: seguir, ajustar ou parar.
