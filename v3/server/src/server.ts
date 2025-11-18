/**
 * Server Principal - SGFILA v3.0
 * Sistema de Gerenciamento de Filas com TypeScript
 */

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { ClientToServerEvents, ServerToClientEvents } from '../../shared/types.js';
import { SocketHandlers } from './socket/SocketHandlers.js';

// Setup __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração
const PORT = process.env.PORT || 3000;

// Cria aplicação Express
const app = express();
const httpServer = createServer(app);

// Configura Socket.IO com tipos
const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve arquivos estáticos do cliente
const clientPath = join(__dirname, '../../client/dist');
app.use(express.static(clientPath));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(join(clientPath, 'index.html'));
});

// Configura handlers Socket.IO
const socketHandlers = new SocketHandlers(io);

io.on('connection', (socket) => {
  socketHandlers.setupHandlers(socket);
});

// Inicia servidor
httpServer.listen(PORT, () => {
  console.log('=================================');
  console.log('SGFILA v3.0 - TypeScript + Vue 3');
  console.log('=================================');
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Pressione Ctrl+C para parar');
  console.log('=================================');
});

// Tratamento de erros
process.on('uncaughtException', (error) => {
  console.error('Erro não tratado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejeitada:', promise, 'razão:', reason);
});
