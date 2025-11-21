/**
 * Gerador de Dados de Teste - SGFILA v3.0
 * Gera arquivos JSON com estatísticas simuladas
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gerarDistribuicaoPorHora() {
  const distribuicao = [];
  for (let hora = 0; hora < 24; hora++) {
    let emitidas = 0, atendidas = 0;

    if (hora >= 8 && hora <= 17) {
      emitidas = random(10, 30);
      atendidas = random(8, emitidas);
    } else if (hora >= 6 && hora <= 19) {
      emitidas = random(2, 8);
      atendidas = random(1, emitidas);
    } else {
      emitidas = random(0, 3);
      atendidas = emitidas > 0 ? random(0, emitidas) : 0;
    }

    distribuicao.push({
      hora,
      emitidas,
      atendidas,
      naoCompareceu: random(0, Math.floor(emitidas * 0.1)),
      tempoMedioEsperaMs: atendidas > 0 ? random(60000, 600000) : 0,
      tempoMedioAtendimentoMs: atendidas > 0 ? random(30000, 300000) : 0,
      pico: (hora >= 9 && hora <= 11) || (hora >= 14 && hora <= 16)
    });
  }
  return distribuicao;
}

function gerarEstatisticasDia(data, variacao = 0) {
  const baseEmitidas = 150 + Math.floor(variacao * 20);
  const totalEmitidas = random(baseEmitidas - 30, baseEmitidas + 30);
  const totalAtendidas = random(Math.floor(totalEmitidas * 0.75), Math.floor(totalEmitidas * 0.95));
  const totalNaoCompareceu = random(Math.floor(totalEmitidas * 0.03), Math.floor(totalEmitidas * 0.08));
  const totalExcluidas = Math.max(0, totalEmitidas - totalAtendidas - totalNaoCompareceu);

  const tempoMedioEsperaMs = random(300000, 900000);
  const tempoMedioAtendimentoMs = random(120000, 300000);

  const distribuicaoPorHora = gerarDistribuicaoPorHora();

  const performancePorAtendente = [
    {
      guicheId: 'guiche-1',
      guicheNome: 'Guichê 1',
      totalAtendimentos: Math.floor(totalAtendidas / 3),
      tempoMedioAtendimentoMs: random(60000, 180000),
      tempoTotalAtivoMs: random(10000000, 20000000),
      eficiencia: random(5, 15),
      taxaOcupacao: random(60, 90),
      maiorTempoAtendimentoMs: random(300000, 600000),
      menorTempoAtendimentoMs: random(30000, 90000)
    },
    {
      guicheId: 'guiche-2',
      guicheNome: 'Guichê 2',
      totalAtendimentos: Math.floor(totalAtendidas / 3),
      tempoMedioAtendimentoMs: random(60000, 180000),
      tempoTotalAtivoMs: random(10000000, 20000000),
      eficiencia: random(5, 15),
      taxaOcupacao: random(60, 90),
      maiorTempoAtendimentoMs: random(300000, 600000),
      menorTempoAtendimentoMs: random(30000, 90000)
    },
    {
      guicheId: 'guiche-3',
      guicheNome: 'Guichê 3',
      totalAtendimentos: Math.floor(totalAtendidas / 3),
      tempoMedioAtendimentoMs: random(60000, 180000),
      tempoTotalAtivoMs: random(10000000, 20000000),
      eficiencia: random(5, 15),
      taxaOcupacao: random(60, 90),
      maiorTempoAtendimentoMs: random(300000, 600000),
      menorTempoAtendimentoMs: random(30000, 90000)
    }
  ];

  const emitPrioridade = Math.floor(totalEmitidas * 0.25);
  const emitContratual = Math.floor(totalEmitidas * 0.15);
  const emitNormal = totalEmitidas - emitPrioridade - emitContratual;

  return {
    totalEmitidas,
    totalAtendidas,
    totalNaoCompareceu,
    totalExcluidas,
    tempoMedioEsperaGeral: `${Math.floor(tempoMedioEsperaMs / 60000)} min`,
    tempoMedioEsperaGeralMs: tempoMedioEsperaMs,
    tempoMedioAtendimentoGeral: `${Math.floor(tempoMedioAtendimentoMs / 60000)} min`,
    tempoMedioAtendimentoGeralMs: tempoMedioAtendimentoMs,
    proximaSenha: '---',
    detalhesPorTipo: {
      prioridade: {
        emitidas: emitPrioridade,
        atendidas: Math.floor(emitPrioridade * 0.9),
        tempoMedioEspera: '8 min',
        tempoMedioEsperaMs: random(300000, 600000),
        tempoMedioAtendimento: '3 min',
        tempoMedioAtendimentoMs: random(120000, 240000),
        maiorTempoEspera: '45 min',
        maiorTempoEsperaMs: random(1800000, 2700000),
        menorTempoEspera: '2 min',
        menorTempoEsperaMs: random(60000, 180000)
      },
      contratual: {
        emitidas: emitContratual,
        atendidas: Math.floor(emitContratual * 0.85),
        tempoMedioEspera: '6 min',
        tempoMedioEsperaMs: random(240000, 480000),
        tempoMedioAtendimento: '2 min',
        tempoMedioAtendimentoMs: random(90000, 180000),
        maiorTempoEspera: '30 min',
        maiorTempoEsperaMs: random(1200000, 1800000),
        menorTempoEspera: '1 min',
        menorTempoEsperaMs: random(30000, 120000)
      },
      normal: {
        emitidas: emitNormal,
        atendidas: Math.floor(emitNormal * 0.8),
        tempoMedioEspera: '12 min',
        tempoMedioEsperaMs: random(600000, 1200000),
        tempoMedioAtendimento: '4 min',
        tempoMedioAtendimentoMs: random(180000, 300000),
        maiorTempoEspera: '60 min',
        maiorTempoEsperaMs: random(2400000, 3600000),
        menorTempoEspera: '3 min',
        menorTempoEsperaMs: random(120000, 240000)
      }
    },
    detalhesPorGuiche: {
      'guiche-1': {
        atendidas: performancePorAtendente[0].totalAtendimentos,
        tempoMedioAtendimento: `${Math.floor(performancePorAtendente[0].tempoMedioAtendimentoMs / 60000)} min`,
        tempoMedioAtendimentoMs: performancePorAtendente[0].tempoMedioAtendimentoMs
      },
      'guiche-2': {
        atendidas: performancePorAtendente[1].totalAtendimentos,
        tempoMedioAtendimento: `${Math.floor(performancePorAtendente[1].tempoMedioAtendimentoMs / 60000)} min`,
        tempoMedioAtendimentoMs: performancePorAtendente[1].tempoMedioAtendimentoMs
      },
      'guiche-3': {
        atendidas: performancePorAtendente[2].totalAtendimentos,
        tempoMedioAtendimento: `${Math.floor(performancePorAtendente[2].tempoMedioAtendimentoMs / 60000)} min`,
        tempoMedioAtendimentoMs: performancePorAtendente[2].tempoMedioAtendimentoMs
      }
    },
    guichesAtivos: 3,
    dataReferencia: data,
    timestampInicio: new Date(data + 'T08:00:00').getTime(),
    timestampFim: new Date(data + 'T18:00:00').getTime(),
    periodoAtivo: false,
    modoTeste: true,
    distribuicaoPorHora,
    horasPico: [
      {
        horarioInicio: 9,
        horarioFim: 11,
        quantidadeSenhas: distribuicaoPorHora.slice(9, 12).reduce((sum, h) => sum + h.emitidas, 0),
        descricao: '9h - 11h'
      },
      {
        horarioInicio: 14,
        horarioFim: 16,
        quantidadeSenhas: distribuicaoPorHora.slice(14, 17).reduce((sum, h) => sum + h.emitidas, 0),
        descricao: '14h - 16h'
      }
    ],
    performancePorAtendente,
    devolucoes: {
      totalDevolucoes: random(2, 8),
      porMotivo: {
        'retorno_impressao': { quantidade: random(1, 3), percentual: 40 },
        'erro_operacional': { quantidade: random(0, 2), percentual: 20 },
        'ausente_retornou': { quantidade: random(1, 2), percentual: 25 },
        'reabertura_atendimento': { quantidade: random(0, 2), percentual: 15 }
      },
      tempoMedioAteRetornoMs: random(300000, 900000)
    },
    qualidade: {
      taxaAtendimento: (totalAtendidas / totalEmitidas) * 100,
      taxaNaoComparecimento: (totalNaoCompareceu / totalEmitidas) * 100,
      taxaDevolucao: random(2, 6),
      eficienciaGeral: totalAtendidas / 8,
      tempoOciosoMedioMs: random(60000, 180000)
    },
    projecao: null,
    mediaAtendimentosPorHora: totalAtendidas / 24,
    picoMaximoAtendimentos: Math.max(...distribuicaoPorHora.map(h => h.emitidas)),
    horarioPicoMaximo: '10h',
    periodoMenorMovimento: '20h'
  };
}

async function main() {
  const numeroDias = parseInt(process.argv[2]) || 30;

  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║   GERADOR DE DADOS DE TESTE - SGFILA v3.0                ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  console.log(`🔧 Gerando ${numeroDias} dias de dados de teste...\n`);

  const pastaEstatisticas = path.join(__dirname, 'dist/estatisticas');

  try {
    await fs.mkdir(pastaEstatisticas, { recursive: true });
    console.log(`✓ Pasta criada: ${pastaEstatisticas}\n`);
  } catch (erro) {
    console.error('Erro ao criar pasta:', erro);
    process.exit(1);
  }

  const dataHoje = new Date();
  let diasCriados = 0;

  for (let i = numeroDias - 1; i >= 0; i--) {
    const data = new Date(dataHoje);
    data.setDate(data.getDate() - i);
    const dataStr = data.toISOString().split('T')[0];

    const variacao = (numeroDias - i) / numeroDias;
    const estatisticas = gerarEstatisticasDia(dataStr, variacao);

    const arquivo = {
      data: dataStr,
      modoTeste: true,
      criadoEm: new Date(dataStr + 'T08:00:00').getTime(),
      atualizadoEm: new Date(dataStr + 'T18:00:00').getTime(),
      snapshots: [
        {
          timestamp: new Date(dataStr + 'T10:00:00').getTime(),
          hora: 10,
          estatisticas
        },
        {
          timestamp: new Date(dataStr + 'T14:00:00').getTime(),
          hora: 14,
          estatisticas
        }
      ],
      estatisticasFinais: estatisticas
    };

    const nomeArquivo = `estatisticas_${dataStr}.json`;
    const caminhoArquivo = path.join(pastaEstatisticas, nomeArquivo);

    try {
      await fs.writeFile(caminhoArquivo, JSON.stringify(arquivo, null, 2), 'utf-8');
      console.log(`✓ ${nomeArquivo} - ${estatisticas.totalEmitidas} senhas`);
      diasCriados++;
    } catch (erro) {
      console.error(`✗ Erro ao criar ${nomeArquivo}:`, erro);
    }
  }

  console.log(`\n✅ ${diasCriados} dias de dados gerados com sucesso!`);
  console.log(`📁 Localização: ${pastaEstatisticas}`);
  console.log('\n💡 Agora você pode testar os filtros:');
  console.log('   ✓ Hoje: dados do dia atual');
  console.log('   ✓ Últimos 7 dias: agregação semanal');
  console.log('   ✓ Últimos 30 dias: agregação mensal');
  console.log('   ✓ Personalizado: escolha o período');
  console.log('\n🚀 Reinicie o servidor para ver os dados!\n');
}

main();
