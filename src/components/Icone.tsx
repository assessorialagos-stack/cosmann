// Ícones de linha desenhados para a página (sem biblioteca externa).
export type NomeIcone =
  | 'folha'
  | 'taxa'
  | 'avalista'
  | 'relogio'
  | 'seta'
  | 'voltar'
  | 'check'
  | 'instagram'
  | 'whatsapp'
  | 'info'
  | 'calendario'
  | 'escudo';

interface Props {
  nome: NomeIcone;
  className?: string;
}

const WHATSAPP =
  'M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41z';

function Traco({ nome }: { nome: NomeIcone }) {
  switch (nome) {
    case 'folha':
      return (
        <>
          <path d="M6.5 3.5h8l3.5 3.5v13.5h-11.5z" />
          <path d="M14.5 3.5V7H18" />
          <path d="M9.5 11.5h5.5M9.5 15h3.5" />
        </>
      );
    case 'taxa':
      return (
        <>
          <path d="m3.5 7 6 6 4-4 7 7" />
          <path d="M20.5 11v5h-5" />
        </>
      );
    case 'avalista':
      return (
        <>
          <circle cx="9" cy="8" r="3.6" />
          <path d="M3 20a6 6 0 0 1 12 0" />
          <path d="m15.5 11.5 2 2 4-4.5" />
        </>
      );
    case 'relogio':
      return (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </>
      );
    case 'seta':
      return <path d="m9 5.5 6.5 6.5L9 18.5" />;
    case 'voltar':
      return <path d="m14.5 6-6 6 6 6" />;
    case 'check':
      return <path d="m5 12.5 4.5 4.5L19 7.5" />;
    case 'instagram':
      return (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <path d="M17.5 6.5h.01" />
        </>
      );
    case 'info':
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5.5M12 7.6h.01" />
        </>
      );
    case 'calendario':
      return (
        <>
          <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
          <path d="M8.5 14h2M13.5 14h2M8.5 17h2" />
        </>
      );
    case 'escudo':
      return (
        <>
          <path d="M12 3 5 6v5.5c0 4.4 3 8.2 7 9.5 4-1.3 7-5.1 7-9.5V6z" />
          <path d="m9 12 2.2 2.2L15.5 10" />
        </>
      );
    default:
      return null;
  }
}

export default function Icone({ nome, className }: Props) {
  if (nome === 'whatsapp') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
        <path d={WHATSAPP} />
      </svg>
    );
  }
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <Traco nome={nome} />
    </svg>
  );
}
