const { io } = require('../client/node_modules/socket.io-client');

async function run() {
  const sock = io('http://localhost:3000');
  let initialEstado = null;
  let guicheId = null;
  let emittedNumero = null;
  const metrics = {};

  const waitFor = (event, timeoutMs = 15000) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      sock.off(event, onEvent);
      reject(new Error(`Timeout esperando evento: ${event}`));
    }, timeoutMs);
    function onEvent(payload) {
      clearTimeout(timer);
      resolve(payload);
    }
    sock.on(event, onEvent);
  });

  const onceEstado = () => waitFor('estadoAtualizado');

  await new Promise((resolve) => sock.on('connect', resolve));

  metrics.emitStart = Date.now();
  sock.emit('emitirSenha', { tipo: 'normal', subtipo: '', servicoDoCliente: 'Cadastro' });
  const afterEmit = await onceEstado();
  metrics.emitEnd = Date.now();
  const last = afterEmit.estado.senhas[afterEmit.estado.senhas.length - 1];
  emittedNumero = last && last.numero;
  guicheId = (afterEmit.estado.guichesConfigurados && afterEmit.estado.guichesConfigurados[0] && afterEmit.estado.guichesConfigurados[0].id) || 'G1';

  metrics.callStart = Date.now();
  sock.emit('chamarSenha', { guicheId });
  const afterCall = await onceEstado();
  metrics.callEnd = Date.now();
  const chamada = afterCall.estado.atendimentosAtuais[guicheId];
  metrics.tempoEspera = chamada ? chamada.tempoEspera : null;
  metrics.chamadaTimestamp = chamada ? chamada.chamadaTimestamp : null;

  metrics.finishStart = Date.now();
  sock.emit('finalizarAtendimento', { guicheId });
  const afterFinish = await onceEstado();
  metrics.finishEnd = Date.now();
  const finalSenha = (afterFinish.estado.senhas || []).find(s => s.numero === emittedNumero);
  metrics.tempoAtendimento = finalSenha ? finalSenha.tempoAtendimento : null;
  metrics.finalizadoTimestamp = finalSenha ? finalSenha.finalizadoTimestamp : null;

  const summary = {
    numero: emittedNumero,
    guicheId,
    latencies: {
      emitMs: metrics.emitEnd - metrics.emitStart,
      callMs: metrics.callEnd - metrics.callStart,
      finishMs: metrics.finishEnd - metrics.finishStart
    },
    tempos: {
      espera: metrics.tempoEspera,
      atendimento: metrics.tempoAtendimento
    },
    timestamps: {
      chamada: metrics.chamadaTimestamp,
      finalizado: metrics.finalizadoTimestamp
    },
    servicoDoCliente: last && last.servicoDoCliente
  };

  console.log('SMOKE_SUMMARY', JSON.stringify(summary, null, 2));
  sock.disconnect();
}

run().catch(err => {
  console.error('SMOKE_ERROR', err && err.message || err);
  process.exit(1);
});