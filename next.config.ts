import type { NextConfig } from 'next';

// O botão da Tela C é a saída principal da página: o deploy de produção na Vercel
// não acontece sem o WhatsApp do VendeAI (55 + DDD + número). Previews e local seguem.
const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? '').replace(/\D/g, '');
const whatsappCompleto = whatsapp.length === 10 || whatsapp.length === 11 ? `55${whatsapp}` : whatsapp;
if (process.env.VERCEL_ENV === 'production' && !/^55[1-9]{2}\d{8,9}$/.test(whatsappCompleto)) {
  throw new Error('NEXT_PUBLIC_WHATSAPP_NUMERO ausente ou inválido. Use 55 + DDD + número (ex.: 5549999999999) e faça o deploy de novo.');
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
