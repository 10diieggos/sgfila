Este arquivo contém as falhas recorrentes detectadas pelo usuário.
Eles devem ser testados com frequência para garantir que estão resolvidas.

---

### Bug: Reset do Serviço na Emissão de Senha (Corrigido em 2025-11-24)

**Problema:**
Ao emitir uma nova senha, o campo "Serviço do cliente" (texto e checkbox) não era limpo. Isso criava o risco de o atendente emitir a senha seguinte com o serviço do cliente anterior selecionado por engano.

**Solução:**
No arquivo `v3/client/src/App.vue`, na função `handleEmitirSenha`, a linha `servicoSelecionado.value = ''` foi adicionada após a chamada `emitirSenha(...)`. Isso garante que o campo de serviço seja resetado imediatamente após a emissão.

**Teste de Verificação:**
Foi criado e/ou atualizado o teste E2E em `v3/e2e/specs/servico-reset.spec.ts`. Este teste executa os seguintes passos:
1.  Acessa a página da aplicação.
2.  Preenche o campo de serviço com um texto.
3.  Emite uma senha (normal, prioritária e contratual).
4.  Fecha o modal de confirmação da nova senha.
5.  **Verifica se o campo de serviço foi limpo (`''`).**
6.  Repete o processo selecionando um serviço sugerido (checkbox).

**Comando para executar o teste:**
```bash
# Navegue até a pasta de testes E2E
cd v3/e2e

# Execute o teste específico
npx playwright test specs/servico-reset.spec.ts
```
O teste agora passa com sucesso, confirmando que a correção está funcionando e prevenindo a regressão deste comportamento.