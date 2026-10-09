import Icone from './Icone';
import Seta from './Seta';
import styles from './Convite.module.css';
import { convite } from '@/content/copy';

export default function Convite() {
  return (
    <section className={`${styles.convite} granulado`} aria-labelledby="t-convite">
      <Seta className={`${styles.forma} ${styles.forma1}`} variante="suave" />
      <Seta className={`${styles.forma} ${styles.forma2}`} variante="linha" />
      <div className={`container ${styles.conteudo}`} data-revelar="">
        <span className={`traco ${styles.traco}`} aria-hidden="true" />
        <h2 className={`titulo-secao ${styles.titulo}`} id="t-convite">
          {convite.titulo}
        </h2>
        {/* rola de volta para o quiz sem reiniciar (ver Quiz.tsx) */}
        <a className={`botao ${styles.botao}`} href="#quiz" data-ir-quiz="">
          {convite.botao}
          <Icone nome="seta" />
        </a>
      </div>
    </section>
  );
}
