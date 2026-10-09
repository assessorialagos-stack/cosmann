// A "seta" do logo (três triângulos sobrepostos), usada como forma decorativa.
const LARANJA = 'M16.8 21l.4 160.2 120.3-76z';
const AMARELO = 'M0 0l2.4 140.2 112.5-65.8z';
const BRANCO = 'M56.7 28l1.2 139.4 112.8-66.1z';

interface Props {
  className?: string;
  /** cor: igual ao logo · linha: só contorno claro · suave: branco translúcido */
  variante?: 'cor' | 'linha' | 'suave';
}

export default function Seta({ className, variante = 'cor' }: Props) {
  return (
    <svg className={className} viewBox="0 0 172 182" aria-hidden="true" focusable="false">
      {variante === 'cor' && (
        <>
          <path fill="#FF5E1A" d={LARANJA} />
          <path fill="#F7ED00" d={AMARELO} />
          <path fill="#fff" fillOpacity=".66" d={BRANCO} />
        </>
      )}
      {variante === 'suave' && (
        <>
          <path fill="#fff" fillOpacity=".05" d={LARANJA} />
          <path fill="#fff" fillOpacity=".07" d={AMARELO} />
          <path fill="#fff" fillOpacity=".05" d={BRANCO} />
        </>
      )}
      {variante === 'linha' && (
        <>
          <path fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth=".8" d={AMARELO} />
          <path fill="none" stroke="#fff" strokeOpacity=".14" strokeWidth=".8" d={BRANCO} />
        </>
      )}
    </svg>
  );
}
