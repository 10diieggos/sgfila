/**
 * Script para gerar dados de teste de estatísticas
 * Uso: node gerar-dados-teste.js [numero-de-dias]
 * Exemplo: node gerar-dados-teste.js 30
 */

import { gerarDadosTeste } from './dist/utils/gerarDadosTeste.js';

const dias = parseInt(process.argv[2]) || 30;

console.log(`
╔═══════════════════════════════════════════════════════════╗
║   GERADOR DE DADOS DE TESTE - SGFILA v3.0                ║
╚═══════════════════════════════════════════════════════════╝
`);

gerarDadosTeste(dias)
  .then(() => {
    console.log('\n✨ Pronto! Reinicie o servidor para usar os dados.');
    process.exit(0);
  })
  .catch((erro) => {
    console.error('\n❌ Erro:', erro);
    process.exit(1);
  });
