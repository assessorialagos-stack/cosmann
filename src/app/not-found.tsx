import type { Metadata } from 'next';
import Logo from '@/components/Logo';
import Seta from '@/components/Seta';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: 'Página não encontrada | Cosmann Financeira',
  robots: { index: false },
};

export default function NaoEncontrada() {
  return (
    <main className={`${styles.erro} granulado`}>
      <Seta className={styles.forma} variante="suave" />
      <div className={styles.caixa}>
        <Logo className={styles.logo} />
        <h1 className={styles.titulo}>Página não encontrada</h1>
        <a className="botao" href="/">
          Voltar para a página
        </a>
      </div>
    </main>
  );
}
