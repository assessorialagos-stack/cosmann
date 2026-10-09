import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import ScriptsCabecalho from '@/components/ScriptsCabecalho';
import { config } from '@/config';
import { meta } from '@/content/copy';
import './globals.css';

// Montserrat servida pelo próprio site (sem chamar o Google), com fallback de
// mesmas medidas gerado pelo Next: o texto não pula quando a fonte chega.
const montserrat = localFont({
  src: '../fonts/montserrat-latin.woff2',
  weight: '400 800',
  style: 'normal',
  display: 'swap',
  variable: '--fonte-montserrat',
  adjustFontFallback: 'Arial',
});

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: meta.titulo,
  description: meta.descricao,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Cosmann Financeira',
    title: meta.titulo,
    description: meta.descricao,
    url: '/',
  },
  // o iPhone não transforma endereço/CNPJ em link (a página não tem links para fora)
  formatDetection: { telephone: false, address: false, email: false, date: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#005081',
  colorScheme: 'only light',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <head>
        {/* ===== Scripts de rastreamento (pixel da Meta, GTM, GA4…): ver src/components/ScriptsCabecalho.tsx ===== */}
        <ScriptsCabecalho />
      </head>
      <body>
        {config.gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${config.gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
