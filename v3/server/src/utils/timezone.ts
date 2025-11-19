/**
 * Utilitários para gerenciamento de timezone (América/São Paulo - Brasília)
 * SGFILA v3.0
 */

const TIMEZONE_BRASILIA = 'America/Sao_Paulo';

/**
 * Obtém a data atual no fuso horário de Brasília
 */
export function getDataBrasilia(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: TIMEZONE_BRASILIA }));
}

/**
 * Obtém a data formatada YYYY-MM-DD no fuso horário de Brasília
 */
export function getDataFormatadaBrasilia(): string {
  const data = getDataBrasilia();
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

/**
 * Obtém a hora atual (0-23) no fuso horário de Brasília
 */
export function getHoraBrasilia(): number {
  return getDataBrasilia().getHours();
}

/**
 * Obtém timestamp do início do dia atual em Brasília (00:00:00)
 */
export function getInicioHojeBrasilia(): number {
  const data = getDataBrasilia();
  data.setHours(0, 0, 0, 0);
  return data.getTime();
}

/**
 * Obtém timestamp do fim do dia atual em Brasília (23:59:59.999)
 */
export function getFimHojeBrasilia(): number {
  const data = getDataBrasilia();
  data.setHours(23, 59, 59, 999);
  return data.getTime();
}

/**
 * Converte timestamp para data formatada YYYY-MM-DD em Brasília
 */
export function timestampParaDataBrasilia(timestamp: number): string {
  const data = new Date(new Date(timestamp).toLocaleString('en-US', { timeZone: TIMEZONE_BRASILIA }));
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

/**
 * Converte timestamp para hora (0-23) em Brasília
 */
export function timestampParaHoraBrasilia(timestamp: number): number {
  const data = new Date(new Date(timestamp).toLocaleString('en-US', { timeZone: TIMEZONE_BRASILIA }));
  return data.getHours();
}

/**
 * Obtém o horário formatado HH:MM:SS em Brasília
 */
export function getHorarioFormatadoBrasilia(timestamp?: number): string {
  const data = timestamp
    ? new Date(new Date(timestamp).toLocaleString('en-US', { timeZone: TIMEZONE_BRASILIA }))
    : getDataBrasilia();

  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  const segundos = String(data.getSeconds()).padStart(2, '0');

  return `${horas}:${minutos}:${segundos}`;
}

/**
 * Obtém data e hora formatados DD/MM/YYYY HH:MM:SS em Brasília
 */
export function getDataHoraCompletaBrasilia(timestamp?: number): string {
  const data = timestamp
    ? new Date(new Date(timestamp).toLocaleString('en-US', { timeZone: TIMEZONE_BRASILIA }))
    : getDataBrasilia();

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  const segundos = String(data.getSeconds()).padStart(2, '0');

  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}

/**
 * Verifica se dois timestamps são do mesmo dia em Brasília
 */
export function saoMesmoDiaBrasilia(timestamp1: number, timestamp2: number): boolean {
  return timestampParaDataBrasilia(timestamp1) === timestampParaDataBrasilia(timestamp2);
}

/**
 * Verifica se o timestamp é de hoje em Brasília
 */
export function ehHojeBrasilia(timestamp: number): boolean {
  return timestampParaDataBrasilia(timestamp) === getDataFormatadaBrasilia();
}

/**
 * Obtém timestamp do início de uma data específica em Brasília (00:00:00)
 */
export function getInicioDiaBrasilia(dataFormatada: string): number {
  // dataFormatada no formato YYYY-MM-DD
  const [ano, mes, dia] = dataFormatada.split('-').map(Number);

  // Cria data em UTC
  const dataUTC = new Date(Date.UTC(ano, mes - 1, dia, 0, 0, 0, 0));

  // Ajusta para Brasília (considerando que estamos criando uma data no fuso desejado)
  const dataBrasilia = new Date(dataUTC.toLocaleString('en-US', { timeZone: TIMEZONE_BRASILIA }));
  dataBrasilia.setHours(0, 0, 0, 0);

  return dataBrasilia.getTime();
}

/**
 * Obtém timestamp do fim de uma data específica em Brasília (23:59:59.999)
 */
export function getFimDiaBrasilia(dataFormatada: string): number {
  const [ano, mes, dia] = dataFormatada.split('-').map(Number);
  const dataUTC = new Date(Date.UTC(ano, mes - 1, dia, 23, 59, 59, 999));
  const dataBrasilia = new Date(dataUTC.toLocaleString('en-US', { timeZone: TIMEZONE_BRASILIA }));
  dataBrasilia.setHours(23, 59, 59, 999);
  return dataBrasilia.getTime();
}
