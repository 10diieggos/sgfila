console.log('Tentando importar...');
import('./shared/types.js')
  .then(mod => {
    console.log('Modulo importado!');
    console.log('Exports disponiveis:', Object.keys(mod));
    console.log('getConfigPadrao existe?', typeof mod.getConfigPadrao);
    if (mod.getConfigPadrao) {
      console.log('Testando funcao...');
      const config = mod.getConfigPadrao();
      console.log('Config versao:', config.versao);
    }
  })
  .catch(err => {
    console.error('Erro ao importar:', err.message);
  });
