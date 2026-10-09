const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export interface OpcaoMes {
  valor: string; // AAAA-MM
  rotulo: string; // "Outubro de 2026"
}

/**
 * Mês atual e os 6 anteriores, do mais recente para o mais antigo.
 * Quem tem "menos de 6 meses" na empresa entrou em um desses meses.
 * Roda no navegador, com a data do aparelho (nunca no build).
 */
export function opcoesEntrada(hoje: Date = new Date(), quantidade = 7): OpcaoMes[] {
  return Array.from({ length: quantidade }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    return {
      valor: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      rotulo: `${MESES[d.getMonth()]} de ${d.getFullYear()}`,
    };
  });
}

/** "AAAA-MM" vira um número de mês corrido, para comparar. */
export function indiceMes(aaaaMm: string): number {
  const [ano, mes] = aaaaMm.split('-').map(Number);
  return ano * 12 + mes - 1;
}
