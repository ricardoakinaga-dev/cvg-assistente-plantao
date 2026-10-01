# Barra para liberar o piloto

Critérios derivados da decisão aprovada para o uso interno da equipe da CVG. O conjunto aplicável precisa ser verificado no mesmo deploy antes de iniciar o piloto. Esta barra não é certificação jurídica.

| #   | Condição                          | Evidência necessária                                                                             | Situação na extração                                                                        |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| 1   | Só a equipe fala com o assistente | Teste no deploy com membro e número não cadastrado                                               | Testes sintéticos passaram na captura de origem; suíte deste checkout não foi executada     |
| 2   | Poder zero e isolamento           | Inventário de capacidades, sem shell, não root, volume mínimo e egress de rede restrito          | Parcial; container ainda não prova ausência de shell e Compose não restringe egress         |
| 3   | HIS somente leitura               | Credencial mínima e tentativa de escrita negada                                                  | Não aplicável na fase 1; reabrir antes da integração HIS                                    |
| 4   | Segredos fora do código/imagem    | Scan atual e inspeção da imagem                                                                  | Scan do repositório de origem não comprova este; workflow e inspeção da imagem pendentes    |
| 5   | Privacidade e retenção            | Regras de acesso, tratamento do provedor, inventário do dado e remoção só após backup confirmado | Persistência sem expiração no código; controles administrativos/contratuais não comprovados |
| 6   | Backup restaurado                 | Restore de eventos e mídia com conferência de integridade                                        | Pendente                                                                                    |
| 7   | Alguém percebe falha              | Alertas de serviço/fila/lembrete e prova de recebimento                                          | Pendente; health pode responder saudável com fila bloqueada                                 |
| 8   | Desligar e retomar                | Teste sob condições normais e de falha, sem perder pendências                                    | Fluxo normal passou na captura de origem; pausa sob envio pendente falhou                   |

Notas antigas não substituem a evidência descrita acima. Enquanto houver condição aplicável pendente, manter `NO_GO` para uso real.
