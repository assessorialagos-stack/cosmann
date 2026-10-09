import styles from './ComoFunciona.module.css';
import { passos } from '@/content/copy';

export default function ComoFunciona() {
  return (
    <section className={styles.como} aria-labelledby="t-como">
      <div className="container">
        <div data-revelar="">
          <span className="traco" aria-hidden="true" />
          <h2 className="titulo-secao" id="t-como">
            {passos.titulo}
          </h2>
        </div>
        <ol className={styles.passos} role="list" data-revelar="">
          {passos.itens.map((texto, i) => (
            <li key={texto} className={styles.passo}>
              <span className={styles.numero} aria-hidden="true">
                {i + 1}
              </span>
              <p className={styles.texto}>
                <span className="sr-only">Passo {i + 1}: </span>
                {texto}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
