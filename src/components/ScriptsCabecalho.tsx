import Script from 'next/script';
import { config } from '@/config';

/**
 * SCRIPTS NO CABEÇALHO — espaço da Lagos para o pixel e o rastreamento.
 *
 * Jeito 1 (sem mexer em código): preencha NEXT_PUBLIC_GTM_ID e/ou
 * NEXT_PUBLIC_META_PIXEL_ID na Vercel e faça um novo deploy.
 *
 * Jeito 2: cole o snippet no bloco "COLE AQUI" abaixo, dentro de um
 * <Script id="nome-unico" strategy="afterInteractive">{`...código...`}</Script>
 *
 * A página já envia os eventos do funil para window.dataLayer (nunca nome nem telefone):
 *   quiz_inicio · quiz_resposta {pergunta, resposta} · quiz_resultado {resultado}
 *   lead_reaquecimento {event_id} · clique_whatsapp {event_id, tempo_empresa, emprestimo_folha, valor_desejado}
 *   clique_instagram · clique_convite_final
 */
export default function ScriptsCabecalho() {
  const { gtmId, pixelId } = config;
  return (
    <>
      {gtmId && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}
      {pixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
        </Script>
      )}

      {/* ===== COLE AQUI outros scripts de rastreamento ===== */}

      {/* ===== FIM ===== */}
    </>
  );
}
