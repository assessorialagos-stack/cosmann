import type { NextConfig } from 'next';

// O botão da Tela C é a saída principal da página: avisa no log do build
// quando o WhatsApp do VendeAI (55 + DDD + número) não está cadastrado.
const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? '').replace(/\D/g, '');
const whatsappCompleto = whatsapp.length === 10 || whatsapp.length === 11 ? `55${whatsapp}` : whatsapp;
if (!/^55[1-9]{2}\d{8,9}$/.test(whatsappCompleto)) {
  console.warn('[cosmann] ATENÇÃO: NEXT_PUBLIC_WHATSAPP_NUMERO ausente ou inválido. O botão da Tela C fica sem número. Use 55 + DDD + número e faça Redeploy.');
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // a Vercel entrega AVIF/WebP no tamanho certo de cada tela
    formats: ['image/avif', 'image/webp'],
    qualities: [72, 80],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
