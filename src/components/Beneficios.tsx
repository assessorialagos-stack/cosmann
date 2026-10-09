import type { CSSProperties } from 'react';
import Icone from './Icone';
import styles from './Beneficios.module.css';
import { beneficios } from '@/content/copy';

export default function Beneficios() {
  return (
    <section className={`${styles.beneficios} granulado`} aria-labelledby="t-beneficios">
      <div className="container">
        <div data-revelar="">
          <span className="traco" aria-hidden="true" />
          <h2 className="titulo-secao" id="t-beneficios">
            {beneficios.titulo}
          </h2>
        </div>
        <ul className={styles.cartoes} role="list">
          {beneficios.cartoes.map((cartao, i) => (
            <li key={cartao.titulo} className={styles.cartao} data-revelar="" style={{ '--atraso': `${i * 110}ms` } as CSSProperties}>
              <span className={styles.icone}>
                <Icone nome={cartao.icone} />
              </span>
              <h3 className={styles.titulo}>{cartao.titulo}</h3>
              <p className={styles.texto}>{cartao.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
