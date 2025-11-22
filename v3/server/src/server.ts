/**
 * Server Principal - SGFILA v3.0
 * Sistema de Gerenciamento de Filas com TypeScript
 */

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { ClientToServerEvents, ServerToClientEvents } from '../../shared/types';
import { SocketHandlers } from './socket/SocketHandlers.js';
import { StatisticsPersistence } from './services/StatisticsPersistence.js';
import { AdvancedStatisticsService } from './services/AdvancedStatisticsService.js';
import { StateManager } from './services/StateManager.js';

// Setup __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração
const NODE_ENV = process.env.NODE_ENV || 'development';
const HOST = process.env.HOST || '127.0.0.1'; // restringe bind por padrão
const PORT = Number(process.env.PORT) || 3000;
const MODO_TESTE = process.env.MODO_TESTE === 'true' || false;
const INTERVALO_SNAPSHOT_MS = 3600000; // 1 hora

// Cria aplicação Express
const app = express();
const httpServer = createServer(app);

// Configura Socket.IO com tipos
// Em produção, restringe CORS a localhost/loopback na porta do servidor;
// Em desenvolvimento, permite Vite (5173/5174) e porta local do servidor.
const ORIGIN_ENV = process.env.CORS_ORIGIN;
const ORIGINS = ORIGIN_ENV
  ? ORIGIN_ENV.split(',').map(s => s.trim()).filter(Boolean)
  : (NODE_ENV === 'production'
      ? [`http://localhost:${PORT}`, `http://127.0.0.1:${PORT}`]
      : [
          `http://localhost:${PORT}`,
          `http://127.0.0.1:${PORT}`,
          'http://localhost:5173',
          'http://127.0.0.1:5173',
          'http://localhost:5174',
          'http://127.0.0.1:5174'
        ]);
const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: ORIGINS,
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

// Inicializa serviço de persistência de estatísticas
const statisticsPersistence = new StatisticsPersistence(__dirname, MODO_TESTE);
let ultimoSnapshotTimestamp: number | null = null;

// Inicializa pasta de estatísticas
statisticsPersistence.inicializar().catch(erro => {
  console.error('Erro ao inicializar persistência de estatísticas:', erro);
});

// Função para salvar snapshot de estatísticas
async function salvarSnapshotSeNecessario() {
  try {
    const agora = Date.now();

    // Verifica se precisa criar snapshot (a cada hora)
    if (!ultimoSnapshotTimestamp || (agora - ultimoSnapshotTimestamp) >= INTERVALO_SNAPSHOT_MS) {
      const stateManager = StateManager.getInstance();
      const estado = stateManager.getEstado();

      const estatisticasAvancadas = AdvancedStatisticsService.calcularEstatisticasAvancadas(
        estado,
        MODO_TESTE
      );

      await statisticsPersistence.adicionarSnapshot(estatisticasAvancadas);
      await statisticsPersistence.atualizarEstatisticasFinais(estatisticasAvancadas);

      ultimoSnapshotTimestamp = agora;
    }
  } catch (erro) {
    console.error('Erro ao salvar snapshot de estatísticas:', erro);
  }
}

// Intervalo para verificar e salvar snapshots (verifica a cada 5 minutos)
setInterval(salvarSnapshotSeNecessario, 300000); // 5 minutos

// Configura handlers Socket.IO (com estatísticas avançadas habilitadas e persistência)
const socketHandlers = new SocketHandlers(io, true, statisticsPersistence);

io.on('connection', (socket) => {
  socketHandlers.setupHandlers(socket);
});

// Inicia servidor (bind restrito ao HOST por padrão)
httpServer.listen(PORT, HOST, async () => {
  console.log('=================================');
  console.log('SGFILA v3.0 - TypeScript + Vue 3');
  console.log('=================================');
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
  console.log(`Modo teste: ${MODO_TESTE ? 'ATIVADO' : 'DESATIVADO'}`);
  console.log(`CORS origins: ${Array.isArray(ORIGINS) ? ORIGINS.join(', ') : ORIGINS}`);
  console.log('Pressione Ctrl+C para parar');
  console.log('=================================');

  // Salva snapshot inicial
  await salvarSnapshotSeNecessario();
});

// Tratamento de erros
process.on('uncaughtException', (error) => {
  console.error('Erro não tratado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejeitada:', promise, 'razão:', reason);
});
