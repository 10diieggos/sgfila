# SGF - Sistema de Gerenciamento de Filas (Correios)

O SGF é um sistema de gerenciamento de filas baseado em rede local, projetado para operar em ambientes com restrições específicas, como a ausência de internet e a impossibilidade de instalação de software de forma tradicional.

Ele foi construído usando **Node.js** (de forma portátil), **Express** e **Socket.IO** para comunicação em tempo real entre os guichês e a interface de monitoramento.

## ✨ Características e Restrições do Projeto

O SGF atende a um conjunto rigoroso de restrições operacionais e técnicas:

1.  **Sem Painel Automático:** A chamada das senhas é realizada **diretamente pelos atendentes** através da interface web.
2.  **Geração de Senhas Manual:** As senhas não são geradas automaticamente por um totem. O atendente solicita e emite a senha na hora pelo sistema.
3.  **Ambiente Fechado:** O sistema opera exclusivamente em **rede interna (Intranet)**, sem necessidade de acesso à internet.
4.  **Implantação Restrita:** Não requer acesso administrativo ou instalações complexas.
5.  **Tecnologia Portátil:** Utiliza uma versão portátil do **Node.js** para executar o servidor.
6.  **Armazenamento Simples:** Todos os dados (senhas, estado da fila) são armazenados em um único arquivo: **`dados.json`**.

## 🚀 Estrutura do Projeto

A estrutura de arquivos do SGF é organizada para facilidade de implantação e manutenção:

└── sgf/ ├── server.js # Lógica do servidor (Node.js, Express, Socket.IO) ├── package.json # Dependências do projeto ├── package-lock.json # Lockfile de dependências ├── dados.json # Armazenamento de estado e dados (NÃO deve ser versionado no Git) ├── index.html # Interface web (Guichê e Fila de Espera) ├── jquery-3.6.0.min.js # Biblioteca jQuery (CDN offline) ├── .gitignore # Arquivos e pastas ignorados pelo controle de versão (e.g., node_modules/, dados.json) ├── webfonts/ # Ícones da interface (Font Awesome local) └── css/ # Arquivos de estilo (all.min.css)


## ⚙️ Como Configurar e Rodar (Ambiente de Produção)

Para rodar o SGF, siga estes passos:

1.  **Pré-requisitos:** Certifique-se de ter a versão portátil do Node.js configurada em sua máquina.
2.  **Dependências:** Na pasta raiz (`sgf/`), instale as dependências usando o npm (caso o `node_modules` não esteja incluído na sua versão portátil):
    ```bash
    npm install
    ```
3.  **Iniciar o Servidor:** Inicie o servidor Node.js.
    ```bash
    node server.js
    # OU
    npm start
    ```
4.  **Acesso:** O servidor será iniciado na porta 3000 (ou outra porta configurada em `server.js`).
    * O sistema pode ser acessado em qualquer computador na rede interna via: `http://<IP_DO_SERVIDOR>:3000`

## 💻 Funcionalidades Principais

### Interface do Atendente (`index.html`)
* **Emissão de Senhas:** O atendente pode gerar senhas dos tipos Normal, Prioridade ou Contratual.
* **Chamada de Senhas:** O atendente usa a interface para chamar a próxima senha disponível, que é determinada por uma regra de prioridade.
* **Gerenciamento de Atendimento:** O atendente pode finalizar ou devolver a senha para a fila.

### Lógica do Servidor (`server.js`)
* **Persistência de Dados:** Carrega e salva o estado do sistema (senhas, contadores) no `dados.json`.
* **Reset Diário:** O estado do sistema é resetado automaticamente quando um novo dia é detectado.
* **Regra de Prioridade:** Implementa uma lógica de chamada que equilibra as senhas **Prioridade** e **Contratual** com as senhas **Normais** (ex: 2 Prioritárias para 1 Normal).
* **Comunicação em Tempo Real:** Usa Socket.IO para atualizar instantaneamente o estado