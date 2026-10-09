import Image from 'next/image';
import Icone from './Icone';
import Logo from './Logo';
import Quiz from './Quiz';
import Seta from './Seta';
import styles from './Hero.module.css';
import { config } from '@/config';
import { topo } from '@/content/copy';
import foto from '@/assets/trabalhador.jpg';

// Toque em "Sim"/"Não" antes do React assumir a página não se perde:
// fica na fila e o quiz responde assim que carrega.
const FILA_DE_TOQUES = `window.__filaQuiz=[];document.addEventListener('click',function(e){if(window.__quizPronto)return;var a=e.target&&e.target.closest?e.target.closest('[data-opcao]'):null;if(a){e.preventDefault();window.__filaQuiz.push(a);}},true);`;

// espaço que não quebra entre "R$" e o número, e em "30 mil"
const NBSP = String.fromCharCode(160);
const destaque = topo.titulo.destaque.replace(/R\$ /g, `R$${NBSP}`).replace(/ mil/g, `${NBSP}mil`);

export default function Hero() {
  return (
    <section className={`${styles.hero} granulado`} aria-labelledby="titulo-principal">
      <div className={styles.brilho} aria-hidden="true" />
      <Seta className={styles.fundo} variante="suave" />
      <Seta className={`${styles.fundo} ${styles.fundoLinha}`} variante="linha" />

      <div className={`container ${styles.grade}`}>
        <Logo className={styles.logo} />

        <div className={styles.cabecalho}>
          <h1 className={styles.titulo} id="titulo-principal">
            {topo.titulo.antes}
            <span className={styles.destaque}>{destaque}</span>
            {topo.titulo.depois}
          </h1>
          <p className={styles.sub}>{topo.subtitulo}</p>
        </div>

        <div className={styles.areaQuiz}>
          <script dangerouslySetInnerHTML={{ __html: FILA_DE_TOQUES }} />
          <Quiz whatsapp={config.whatsapp} instagram={config.instagram} pixelDireto={Boolean(config.pixelId)} />
          <p className={styles.apoio}>
            <Icone nome="relogio" />
            {topo.apoio}
          </p>
        </div>

        <div className={styles.visual}>
          <Seta className={styles.seta} />
          <figure className={styles.foto}>
            <Image
              src={foto}
              alt={topo.fotoAlt}
              fill
              sizes="(min-width: 960px) 470px, (orientation: landscape) and (max-height: 540px) 50vw, calc(100vw - 32px)"
              quality={72}
              placeholder="blur"
              style={{ objectFit: 'cover', objectPosition: '50% 22%' }}
            />
          </figure>
          <p className={`${styles.selo} ${styles.selo1}`}>
            <Icone nome="escudo" />
            {topo.selos[0]}
          </p>
          <p className={`${styles.selo} ${styles.selo2}`}>
            <Icone nome="folha" />
            {topo.selos[1]}
          </p>
        </div>
      </div>
    </section>
  );
}
