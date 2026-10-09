// Valores que mudam sem mexer no código: variáveis de ambiente da Vercel
// (Settings > Environment Variables). As NEXT_PUBLIC_* entram no build.

const limpar = (valor?: string) => (valor ?? '').trim();

/** Aceita "(49) 99999-0000", "49999990000" ou "5549999990000" e devolve 55 + DDD + número */
export function normalizarWhatsApp(valor?: string): string {
  const digitos = limpar(valor).replace(/\D/g, '');
  return digitos.length === 10 || digitos.length === 11 ? `55${digitos}` : digitos;
}

export const config = {
  /** WhatsApp do VendeAI: 55 + DDD + número (a preencher) */
  whatsapp: normalizarWhatsApp(process.env.NEXT_PUBLIC_WHATSAPP_NUMERO),
  instagram: limpar(process.env.NEXT_PUBLIC_INSTAGRAM_URL) || 'https://www.instagram.com/cosmannfinanceira/',
  /** CNPJ publicado no rodapé do site atual da Cosmann (confirmar com o cliente) */
  cnpj: limpar(process.env.NEXT_PUBLIC_CNPJ) || '24.521.212/0001-82',
  siteUrl: limpar(process.env.NEXT_PUBLIC_SITE_URL) || 'https://consignado.cosmann.com.br',
  gtmId: limpar(process.env.NEXT_PUBLIC_GTM_ID),
  pixelId: limpar(process.env.NEXT_PUBLIC_META_PIXEL_ID).replace(/\D/g, ''),
} as const;
