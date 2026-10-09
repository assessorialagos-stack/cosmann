export const somenteDigitos = (valor: unknown): string => String(valor ?? '').replace(/\D/g, '');

/** DDD + número, sem o 55 e sem zeros na frente; no máximo 11 dígitos. */
export function normalizarTelefone(valor: unknown): string {
  let d = somenteDigitos(valor);
  if (d.length > 11 && d.startsWith('55')) d = d.slice(2);
  d = d.replace(/^0+/, '');
  return d.slice(0, 11);
}

/** DDD (dois dígitos de 1 a 9) + 8 ou 9 dígitos. Mesma regra no servidor e no Apps Script. */
export const telefoneValido = (digitos: string): boolean => /^[1-9]{2}\d{8,9}$/.test(digitos);

/** (DD) DDDDD-DDDD ou (DD) DDDD-DDDD, montando aos poucos enquanto a pessoa digita. */
export function formatarTelefone(d: string): string {
  if (!d) return '';
  if (d.length < 3) return `(${d}`;
  const inicio = `(${d.slice(0, 2)}) `;
  const resto = d.slice(2);
  if (d.length < 7) return inicio + resto;
  const corte = d.length === 11 ? 5 : 4;
  return `${inicio}${resto.slice(0, corte)}-${resto.slice(corte)}`;
}

/** Posição no texto formatado logo depois do n-ésimo dígito. */
export function posicaoAposDigitos(formatado: string, n: number): number {
  if (n <= 0) return formatado.startsWith('(') ? 1 : 0;
  let contados = 0;
  for (let i = 0; i < formatado.length; i++) {
    if (/\d/.test(formatado[i])) contados++;
    if (contados === n) return i + 1;
  }
  return formatado.length;
}
