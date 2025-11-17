// server.js - Servidor principal (refatorado)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Importa módulos
const { carregarEstado, salvarEstado, getEstadoPadrao } = require('./server/state-manager');
const { calcularEstatisticas } = require('./server/statistics');
const setupSocketHandlers = require('./server/socket-handlers');

// Configuração
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;

// Carrega estado inicial
let estado = carregarEstado();

// Função centralizada para emitir o estado atualizado
function broadcastEstadoAtualizado() {
    const estatisticas = calcularEstatisticas(estado.senhas, estado);

    io.emit('estadoAtualizado', {
        estado: estado,
        estatisticas: estatisticas
    });
}

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota raiz serve o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configura handlers do WebSocket
setupSocketHandlers(io, estado, salvarEstado, broadcastEstadoAtualizado);

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`Servidor SGF rodando.`);
    console.log(`Acesse http://localhost:${PORT} no seu navegador.`);
    console.log(`Outros guichês na rede devem acessar http://[IP_DO_SERVIDOR]:${PORT}`);
});
