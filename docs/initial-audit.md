# Auditoria inicial — 01/10/2026

Fonte: [AUD0593 no repositório de origem](https://github.com/ricardoakinaga-dev/cvg-operational-harness/blob/main/docs/04_audit/0593_repository_score_audit_2026-10-01.md). A auditoria foi realizada antes da extração, sobre checkout sujo do monorepo e snapshot de código. É referência de riscos, não auditoria independente deste novo commit.

- Nota geral do checkout auditado: **63/100**.
- Prontidão demonstrada para piloto: **51/100**.
- Produção: **NO_GO**.
- Testes existentes no snapshot: 2.357 passaram, 189 foram ignorados, zero falharam; 37 testes específicos do assistente passaram.
- Oito probes sintéticos reproduziram falhas ou limites. Os pontos principais seguem resumidos abaixo.

| ID  | Risco observado                                                                        | Efeito                                                     | Próxima prova/critério                                                             |
| --- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| F01 | Tarefas são abertas antes da confirmação da nota                                       | Extração incerta pode disparar cobrança antes da revisão   | Provar que nenhuma pendência ativa antes de `ok`                                   |
| F02 | Falhas de transcrição/envio podem ser marcadas como processadas                        | Reinício não retoma a falha nem entrega pendente           | Simular indisponibilidade e recuperação sem perda ou duplicação                    |
| F03 | Linha JSONL final truncada causa `SyntaxError` na inicialização                        | Serviço não sobe após cauda incompleta                     | Recuperar prefixo íntegro e alertar corrupção intermediária                        |
| F04 | Ticks simultâneos podem enviar lembrete duplicado                                      | Ruído e ação repetida                                      | Tick concorrente com transporte lento produz uma entrega                           |
| F05 | Envio pendente bloqueia fila e pausa; health ainda responde 200                        | Gestor pode não conseguir pausar e health mascara bloqueio | Timeout, controle da fila e alerta comprovados                                     |
| F06 | Verificação numérica não associa número a paciente/campo; ID duvidoso entra na memória | Troca de valor ou identidade pode parecer validada         | Não usar ID até confirmação; testar números trocados entre pacientes               |
| F07 | Imagem e rede não provam todos os controles de isolamento prometidos                   | Superfície de execução/egress maior que documentada        | Qualificar imagem e política de rede do deploy                                     |
| F08 | Restore, alerta recebido e qualidade dos áudios não foram provados                     | Operação e adoção desconhecidas                            | Restore eventos+mídia, alerta recebido, homologação do canal e áudio               |
| F09 | Audit reportou três pacotes HIGH e um MODERATE no monorepo                             | Manutenção do supply chain pendente                        | Reauditar lockfile independente deste repo e atualizar se aplicável                |
| F10 | README, navegação e CI do monorepo ainda apontavam para missão anterior                | Critério de prontidão e propriedade pouco claros           | Este repo mantém documentação e comandos próprios; CI do assistente ainda pendente |

A cópia extraída não resolve automaticamente esses riscos. Faça reteste após correções e vincule cada resultado aos bytes do novo candidato.

## Instalação limpa deste repositório

Em 01/10/2026, `npm ci` foi executado com Node 22.23.2 e concluiu com sucesso. O npm reportou um alerta LOW no conjunto reduzido de dependências deste repositório; a recomendação do monorepo para três HIGH e um MODERATE não foi transferida como se fosse o mesmo lockfile. O alerta LOW ainda não foi investigado nesta entrega.
