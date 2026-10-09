import Logo from './Logo';
import styles from './Rodape.module.css';
import { config } from '@/config';
import { rodape } from '@/content/copy';

interface Props {
  /** A página da política não mostra o link para ela mesma */
  comLinkPolitica?: boolean;
}

export default function Rodape({ comLinkPolitica = true }: Props) {
  return (
    <footer className={styles.rodape}>
      <div className={`container ${styles.grade}`}>
        <Logo className={styles.logo} decorativo />
        <div>
          <p className={styles.texto}>{rodape.texto(config.cnpj)}</p>
          {comLinkPolitica && (
            <a className={styles.link} href="/politica-de-privacidade" target="_blank" rel="noopener">
              {rodape.politica}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
