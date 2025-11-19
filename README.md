# SGFila - Sistema de Gerenciamento de Filas não Oficial

O SGFila é um sistema de gerenciamento de filas baseado em rede local, projetado para operar em ambientes com restrições específicas, como a ausência de internet e a impossibilidade de instalação de software de forma tradicional.

Ele foi construído usando **Node.js** (de forma portátil), **Express** e **Socket.IO** para comunicação em tempo real entre os guichês e a interface de monitoramento.

## ✨ Características e Restrições do Projeto

O SGF atende a um conjunto rigoroso de restrições operacionais e técnicas:

1.  **Sem Painel Automático:** A chamada das senhas é realizada **diretamente pelos atendentes** através da interface web.
2.  **Geração de Senhas Manual:** As senhas não são geradas automaticamente por um totem. O atendente solicita e emite a senha na hora pelo sistema.
3.  **Ambiente Fechado:** O sistema opera exclusivamente em **rede interna (Intranet)**, sem possibilidade de acesso à internet.
4.  **Implantação Restrita:** Não requer acesso administrativo ou instalações complexas, apenas permissão de FireWall (Pode requerer acesso administrativo).
5.  **Tecnologia Portátil:** Utiliza uma versão portátil do **Node.js** para executar o servidor.
6.  **Armazenamento Simples:** Todos os dados (senhas, estado da fila) são armazenados em um único arquivo: **`dados.json`**.

## 🚀 Estrutura do Projeto

A estrutura de arquivos do SGFILA



## ⚙️ Como Configurar e Rodar (Ambiente de Produção)

Para rodar o SGFILA

## 💻 Funcionalidades Principais

### Interface do Atendente
* **Emissão de Senhas:** O atendente pode gerar senhas dos tipos Normal, Prioridade ou Contratual.
* **Chamada de Senhas:** O atendente usa a interface para chamar a próxima senha disponível, que é determinada por uma regra de prioridade.
* **Gerenciamento de Atendimento:** O atendente pode finalizar ou devolver a senha para a fila.

### Lógica do Servidor
* **Persistência de Dados:** Carrega e salva o estado do sistema (senhas, contadores) no `dados.json`.
* **Reset:** O estado do sistema pode ser resetado.
* **Regra de Prioridade:** Implementa uma lógica de chamada que equilibra as senhas **Prioridade** e **Contratual** com as senhas **Normais** (ex: 2 Prioritárias para 1 Normal).
* **Comunicação em Tempo Real:** Usa Socket.IO para atualizar instantaneamente o estado
