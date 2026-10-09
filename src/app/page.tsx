import Beneficios from '@/components/Beneficios';
import ComoFunciona from '@/components/ComoFunciona';
import Convite from '@/components/Convite';
import Hero from '@/components/Hero';
import Revelar from '@/components/Revelar';
import Rodape from '@/components/Rodape';
import Sobre from '@/components/Sobre';

// Página estática (gerada no build e servida pela CDN da Vercel);
// só o quiz e o efeito de surgir rodam no navegador.
export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Beneficios />
        <ComoFunciona />
        <Sobre />
        <Convite />
      </main>
      <Rodape />
      <Revelar />
    </>
  );
}
