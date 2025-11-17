// utils.js - Funções utilitárias

function calcularTempoEspera(timestamp) {
    const agora = new Date().getTime();
    return Math.round((agora - timestamp) / 60000);
}

function formatarTempo(milissegundos) {
    if (isNaN(milissegundos) || milissegundos === 0 || !isFinite(milissegundos)) {
        return '0 min';
    }
    if (milissegundos < 60000) return "< 1 min";
    const minutos = Math.round(milissegundos / 60000);
    return `${minutos} min`;
}

function beep(times = 1) {
    try {
        for (let i = 0; i < times; i++) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.value = times === 1 ? 800 : 1000;
            gainNode.gain.value = 0.1;

            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
            }, 200);
        }
    } catch (e) {
        console.log('Áudio não suportado');
    }
}
