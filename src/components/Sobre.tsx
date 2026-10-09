import type { CSSProperties } from 'react';
import Image from 'next/image';
import Seta from './Seta';
import styles from './Sobre.module.css';
import { sobre } from '@/content/copy';
import fachada from '@/assets/fachada-cosmann.webp';

export default function Sobre() {
  return (
    <section className={`${styles.sobre} granulado`} aria-labelledby="t-sobre">
      <div className={`container ${styles.grade}`}>
        <div data-revelar="">
          <p className="sobretitulo">{sobre.sobretitulo}</p>
          <h2 className={styles.titulo} id="t-sobre">
            <span className={styles.numero}>{sobre.tituloNumero}</span> <span className={styles.resto}>{sobre.tituloResto}</span>
          </h2>
          <p className={styles.paragrafo}>{sobre.texto}</p>
        </div>

        <div className={styles.visual} data-revelar="" style={{ '--atraso': '120ms' } as CSSProperties}>
          <Seta className={styles.seta} />
          <figure className={styles.foto}>
            <Image
              src={fachada}
              alt={sobre.fotoAlt}
              fill
              sizes="(min-width: 760px) 560px, calc(100vw - 32px)"
              quality={80}
              placeholder="blur"
              style={{ objectFit: 'cover' }}
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
