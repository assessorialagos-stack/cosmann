import { indiceMes } from './meses';
import { normalizarTelefone, telefoneValido } from './telefone';

/** Campos de campanha guardados junto com o contato (atribuição dos anúncios). */
export const CAMPOS_UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
export type CampoUtm = (typeof CAMPOS_UTM)[number];

export interface Lead {
  nome: string;
  whatsapp: string; // DDD + número
  entrada: string; // AAAA-MM
  utm: Partial<Record<CampoUtm, string>>;
}

export type ErroLead = 'nome_invalido' | 'whatsapp_invalido' | 'entrada_invalida' | 'autorizacao_ausente';
export type ResultadoLead = { ok: true; lead: Lead } | { ok: false; erro: ErroLead };

/** Tira caracteres invisíveis e de controle e junta espaços repetidos. */
// Faixas montadas por código (o arquivo-fonte fica só com ASCII; caracteres
// como U+2028 escritos direto dentro de uma regex quebram o JavaScript).
const chr = (codigo: number) => String.fromCharCode(codigo);
const faixa = (de: number, ate: number) => `${chr(de)}-${chr(ate)}`;
const INVISIVEIS = new RegExp(`[${chr(0xad)}${faixa(0x200b, 0x200f)}${faixa(0x202a, 0x202e)}${faixa(0x2060, 0x2069)}${chr(0xfeff)}]`, 'g');
// controles (inclui tab e quebras de linha) + todos os tipos de espaço
const ESPACOS = [0x20, 0xa0, 0x1680, 0x2028, 0x2029, 0x202f, 0x205f, 0x3000].map(chr).join('') + faixa(0x2000, 0x200a);
const CONTROLES_E_ESPACOS = new RegExp(`[${faixa(0x00, 0x1f)}${faixa(0x7f, 0x9f)}${ESPACOS}]+`, 'g');

export function limparNome(valor: unknown): string {
  return String(valor ?? '')
    .replace(INVISIVEIS, '')
    .replace(CONTROLES_E_ESPACOS, ' ')
    .trim();
}

const texto = (v: unknown) => String(v ?? '').trim();

/**
 * Mesmas regras no navegador, na função da Vercel e no Apps Script:
 * o que a página aceita, a planilha também aceita.
 */
export function validarLead(dados: Record<string, unknown>, hoje: Date = new Date()): ResultadoLead {
  const nome = limparNome(dados.nome);
  if (nome.length < 2 || nome.length > 120) return { ok: false, erro: 'nome_invalido' };

  const whatsapp = normalizarTelefone(dados.whatsapp);
  if (!telefoneValido(whatsapp)) return { ok: false, erro: 'whatsapp_invalido' };

  const entrada = texto(dados.entrada);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(entrada)) return { ok: false, erro: 'entrada_invalida' };
  const atual = hoje.getFullYear() * 12 + hoje.getMonth();
  const distancia = indiceMes(entrada) - atual;
  // aceita um mês "no futuro" (relógio ou fuso do celular adiantado) e até 24 meses para trás
  if (distancia > 1 || distancia < -24) return { ok: false, erro: 'entrada_invalida' };

  const autorizacao = dados.autorizacao;
  if (!(autorizacao === true || texto(autorizacao).toLowerCase() === 'sim')) return { ok: false, erro: 'autorizacao_ausente' };

  const utm: Lead['utm'] = {};
  for (const campo of CAMPOS_UTM) {
    const valor = texto(dados[campo]).slice(0, 150);
    if (valor) utm[campo] = valor;
  }

  return { ok: true, lead: { nome, whatsapp, entrada, utm } };
}
