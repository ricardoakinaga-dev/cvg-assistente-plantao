# Fase 1 — Caderno de plantão

Status: implementação local extraída para seu repositório em 01/10/2026. A direção do produto e as decisões D1–D4 foram aprovadas pelo usuário em 30/09/2026 no projeto de origem. Essa aprovação não é liberação de produção; este projeto mantém o veredito **NO_GO** até fechar os bloqueios aplicáveis.

## Objetivo

Verificar se a equipe consegue registrar áudio, texto ou foto pelo WhatsApp, revisar a nota organizada, criar lembretes para promessas e acompanhar pendências. O HIS continua sendo o registro oficial. O assistente não escreve nele.

## Comportamento implementado

1. WAHA e Evolution podem chamar `POST /webhooks/waha` ou `/webhooks/evolution`, autenticando com `x-cvg-webhook-secret` ou parâmetro `secret`.
2. Apenas mensagens diretas de membros em `SHIFT_MEMBERS` são aceitas. Grupos, mensagens próprias e remetentes desconhecidos são ignorados.
3. A mensagem recebida é persistida antes do processamento e deduplicada por ID. Mensagens não marcadas como processadas voltam a ser enfileiradas na inicialização.
4. Áudios vão ao servidor Whisper configurado. Fotos ficam anexadas à nota e a legenda vira texto. Texto transcrito/informado é enviado ao modelo compatível com API OpenAI para extrair pacientes, evolução, exames, condutas, pendências e dúvidas.
5. A saída JSON é validada com Zod. O serviço monta deterministicamente o texto para colar no HIS e os lembretes. Números não encontrados no texto original são sinalizados.
6. Comandos: `pendências`, `feito N`, `adiar N 30`, `adiar N 1h`, `ok`, `corrigir <texto>`, `ajuda`, `novo paciente`. Gestor: `pausar assistente`, `retomar assistente`.
7. Lembrete sem horário usa duas horas; lembretes repetem a cada 30 minutos, até quatro vezes, exceto quando pausado.
8. Registro em `SHIFT_DATA_DIR/events.jsonl` e anexos em `SHIFT_DATA_DIR/media/`; não há apagamento automático por prazo.

## Backlog de fase 1

| ID     | Trabalho                          | Aceite verificável                                                        | Estado conhecido                                                                     |
| ------ | --------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| AP-007 | Adapter de WhatsApp com allowlist | Remetente desconhecido não recebe resposta e fica sem conteúdo registrado | Implementado em código; providers reais não homologados                              |
| AP-008 | Transcrição Whisper local         | 10 áudios veterinários sintéticos de 60 s com qualidade aceitável         | Adapter existe; corpus/qualidade não comprovados                                     |
| AP-009 | Extração estruturada              | 20 casos sintéticos; números e doses preservados literalmente             | Schema e testes existem; associação de valores entre pacientes não é detectada       |
| AP-010 | Resposta e confirmação/correção   | Fluxo ponta a ponta e nenhuma tarefa ativa antes da confirmação           | Parcial: notas têm confirmação, mas tarefas e lembretes são ativados antes dela      |
| AP-011 | Pendências e lembretes            | Persistem após restart, sem duplicata concorrente, em até um minuto       | Fluxo normal passou na captura de origem; retry e concorrência têm falhas conhecidas |
| AP-012 | Comandos                          | Testar cada comando e propriedade do item por usuário                     | Testes sintéticos presentes                                                          |
| AP-013 | Retenção e backup                 | Não remover dado antes do backup; restore inclui eventos e mídia          | Sem expiração implementada; restore não comprovado                                   |
| AP-014 | Deploy mínimo                     | Não root, imagem isolada e egress restrito por rede                       | Parte dos controles existe; imagem/rede ainda sem qualificação completa              |
| AP-015 | Guia da equipe                    | Lido pelos dois pilotos                                                   | Não comprovado nesta extração                                                        |
| AP-016 | Piloto de duas semanas            | Uso por turno registrado e decisão seguir/ajustar/parar                   | Não iniciado/comprovado                                                              |

## Fora desta fase

Consulta ao HIS, fechamento automático a partir de registros do HIS, passagem de plantão, escalonamento, painel do gestor, leitura visual da foto, fala com tutor e ações clínicas/financeiras. Esses itens exigem fase e especificação próprias.

## Critério antes de uso real

Os itens aplicáveis da [barra de liberação](release-bar.md) precisam de evidência do mesmo deploy. A [auditoria inicial](initial-audit.md) lista condições bloqueadoras observadas. O histórico de teste sintético não é certificação ou prova de uso hospitalar.
