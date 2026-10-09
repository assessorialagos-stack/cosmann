'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from 'react';
import Icone from './Icone';
import styles from './Quiz.module.css';
import { perguntas, telaA, telaB, telaC } from '@/content/copy';
import { CAMPOS_UTM } from '@/lib/lead';
import { opcoesEntrada, type OpcaoMes } from '@/lib/meses';
import { formatarTelefone, normalizarTelefone, posicaoAposDigitos, telefoneValido } from '@/lib/telefone';
import { linkWhatsApp, mensagemWhatsApp } from '@/lib/whatsapp';

type Pergunta = 'q1' | 'q2' | 'q3' | 'q4';
type Etapa = Pergunta | 'telaA' | 'telaB' | 'telaC';
type Direcao = 'frente' | 'tras' | 'nenhuma';
type Campo = 'nome' | 'whatsapp' | 'entrada' | 'autorizacao';

/** Posição no quiz (vai no history.state para o "voltar" do celular funcionar) */
interface Passo {
  etapa: Etapa;
  historico: Etapa[];
}

const ETAPAS: Etapa[] = ['q1', 'q2', 'q3', 'q4', 'telaA', 'telaB', 'telaC'];
const NUMERO: Record<Pergunta, number> = { q1: 1, q2: 2, q3: 3, q4: 4 };
const ehPergunta = (etapa: Etapa): etapa is Pergunta => etapa in NUMERO;
const RESULTADO: Partial<Record<Etapa, string>> = { telaA: 'nao_clt', telaB: 'reaquecimento', telaC: 'apto' };

// Lógica do briefing: só carteira assinada e tempo de empresa decidem o caminho
const PROXIMA: Record<Pergunta, (resposta: string) => Etapa> = {
  q1: (r) => (r === 'Não' ? 'telaA' : 'q2'),
  q2: (r) => (r === 'Menos de 6 meses' ? 'telaB' : 'q3'),
  q3: () => 'q4',
  q4: () => 'telaC',
};

const CHAVE_ESTADO = 'cosmann:quiz';
const CHAVE_UTM = 'cosmann:utm';
const TRAVA_MS = 350; // toque duplo não responde a pergunta seguinte
const LIMITE_ENVIO_MS = 25000; // maior que o pior caso do servidor (2 tentativas de 8 s)
const INICIO: Passo = { etapa: 'q1', historico: [] };

// Pixel instalado direto pela variável (sem GTM): os eventos também vão para o fbq
let espelharNoPixel = false;
const EVENTO_PADRAO_META: Record<string, string> = { lead_reaquecimento: 'Lead', clique_whatsapp: 'Contact' };

/** Eventos do funil para GTM / pixel — nunca nome nem telefone */
function evento(event: string, dados: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...dados });
  if (!espelharNoPixel || typeof window.fbq !== 'function') return;
  const { event_id: eventId, ...parametros } = dados;
  const padrao = EVENTO_PADRAO_META[event];
  if (padrao) window.fbq('track', padrao, parametros, eventId ? { eventID: eventId } : undefined);
  else window.fbq('trackCustom', event, parametros);
}
const novoId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
const semMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function lerUtm(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE_UTM) ?? '{}');
  } catch {
    return {};
  }
}

interface Props {
  /** 55 + DDD + número do VendeAI */
  whatsapp: string;
  instagram: string;
  /** true quando o pixel da Meta foi instalado pela variável NEXT_PUBLIC_META_PIXEL_ID */
  pixelDireto?: boolean;
}

export default function Quiz({ whatsapp, instagram, pixelDireto = false }: Props) {
  const [passo, setPasso] = useState<Passo>(INICIO);
  const [direcao, setDirecao] = useState<Direcao>('nenhuma');
  const [versao, setVersao] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [leadEnviado, setLeadEnviado] = useState(false);
  const [meses, setMeses] = useState<OpcaoMes[]>([]);
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const [erroEnvio, setErroEnvio] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [anuncio, setAnuncio] = useState('');

  const painelRef = useRef<HTMLElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const confirmacaoRef = useRef<HTMLDivElement>(null);
  const nomeRef = useRef<HTMLInputElement>(null);
  const telRef = useRef<HTMLInputElement>(null);
  const entradaRef = useRef<HTMLSelectElement>(null);
  const autorizacaoRef = useRef<HTMLInputElement>(null);
  const siteRef = useRef<HTMLInputElement>(null);
  const enviarRef = useRef<HTMLButtonElement>(null);
  const acaoRef = useRef<HTMLAnchorElement>(null);

  const passoRef = useRef<Passo>(INICIO);
  const travadoAte = useRef(0);
  const iniciou = useRef(false);
  const focarAoMudar = useRef(false);
  const focarConfirmacao = useRef(false);
  const tentou = useRef(false);

  // a referência acompanha sempre o passo que está na tela
  useEffect(() => {
    passoRef.current = passo;
  }, [passo]);

  const rolarAtePainel = useCallback((sempre: boolean) => {
    const el = painelRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (sempre || r.top < 0 || r.bottom > window.innerHeight) {
      window.scrollTo({ top: Math.max(0, window.scrollY + r.top - 12), behavior: semMovimento() ? 'auto' : 'smooth' });
    }
  }, []);

  // Painel no topo da tela; se o botão principal ficar abaixo, rola até ele aparecer inteiro
  const garantirVisivel = useCallback((alvo: HTMLElement | null) => {
    const painel = painelRef.current;
    if (!painel) return;
    const r = painel.getBoundingClientRect();
    let destino = window.scrollY;
    if (r.top < 0 || r.bottom > window.innerHeight) destino = window.scrollY + r.top - 12;
    if (alvo) {
      const base = alvo.getBoundingClientRect().bottom + window.scrollY;
      if (base - destino > window.innerHeight - 12) destino = base - window.innerHeight + 12;
    }
    if (Math.abs(destino - window.scrollY) > 2) {
      window.scrollTo({ top: Math.max(0, destino), behavior: semMovimento() ? 'auto' : 'smooth' });
    }
  }, []);

  const anunciar = useCallback((texto: string) => {
    setAnuncio('');
    window.setTimeout(() => setAnuncio(texto), 60);
  }, []);

  const irPara = useCallback((novo: Passo, dir: Direcao, focar = true) => {
    passoRef.current = novo;
    focarAoMudar.current = focar;
    travadoAte.current = performance.now() + TRAVA_MS;
    setDirecao(dir === 'nenhuma' || semMovimento() ? 'nenhuma' : dir);
    setVersao((v) => v + 1);
    setPasso(novo);
  }, []);

  const responder = useCallback(
    (etapa: Etapa, valor: string) => {
      if (performance.now() < travadoAte.current) return;
      const atual = passoRef.current;
      if (etapa !== atual.etapa || !ehPergunta(etapa)) return;
      const numero = NUMERO[etapa];

      if (numero === 1 && !iniciou.current) {
        iniciou.current = true;
        evento('quiz_inicio');
      }
      setRespostas((r) => ({ ...r, [String(numero)]: valor }));
      evento('quiz_resposta', { pergunta: numero, resposta: valor });

      const proxima = PROXIMA[etapa](valor);
      const novo: Passo = { etapa: proxima, historico: [...atual.historico, etapa] };
      const prof = Number(window.history.state?.cosmann?.prof ?? 0) + 1;
      window.history.pushState({ cosmann: { ...novo, prof } }, '');
      irPara(novo, 'frente');
      const resultado = RESULTADO[proxima];
      if (resultado) evento('quiz_resultado', { resultado });
    },
    [irPara]
  );

  const voltar = useCallback(() => {
    if (performance.now() < travadoAte.current) return;
    const atual = passoRef.current;
    if (!atual.historico.length) return;
    // Se o histórico do navegador espelha o quiz, usa ele (o "voltar" do celular fica igual)
    const noHistorico = window.history.state?.cosmann;
    if (noHistorico?.etapa === atual.etapa && Number(noHistorico.prof ?? 0) > 0) {
      travadoAte.current = performance.now() + TRAVA_MS; // dois toques seguidos não saem da página
      window.history.back();
      return;
    }
    const novo: Passo = { etapa: atual.historico[atual.historico.length - 1], historico: atual.historico.slice(0, -1) };
    window.history.replaceState({ ...(window.history.state ?? {}), cosmann: { ...novo, prof: 0 } }, '');
    irPara(novo, 'tras');
  }, [irPara]);

  // ===== Ao abrir: restaura o passo, guarda UTMs, liga "voltar" do navegador e o convite final =====
  useEffect(() => {
    let inicial = INICIO;
    try {
      const salvo = JSON.parse(sessionStorage.getItem(CHAVE_ESTADO) ?? 'null');
      if (salvo && ETAPAS.includes(salvo.etapa) && Array.isArray(salvo.historico)) {
        const r: Record<string, string> = salvo.respostas ?? {};
        // telas finais só voltam se as respostas que levam até elas existirem
        if (salvo.etapa !== 'telaC' || (r['2'] && r['3'] && r['4'])) {
          inicial = { etapa: salvo.etapa, historico: salvo.historico };
          setRespostas(r);
          setLeadEnviado(Boolean(salvo.leadEnviado));
          iniciou.current = Object.keys(r).length > 0;
          if (inicial.etapa !== 'q1') irPara(inicial, 'nenhuma', false);
        }
      }
    } catch {
      /* sem sessionStorage (modo privado): começa do zero */
    }
    passoRef.current = inicial;
    espelharNoPixel = pixelDireto;
    const noHistorico = window.history.state?.cosmann;
    const prof = noHistorico?.etapa === inicial.etapa ? Number(noHistorico.prof ?? 0) : 0;
    window.history.replaceState({ ...(window.history.state ?? {}), cosmann: { ...inicial, prof } }, '');

    try {
      const parametros = new URLSearchParams(window.location.search);
      const utm: Record<string, string> = {};
      for (const campo of CAMPOS_UTM) {
        const valor = parametros.get(campo);
        if (valor) utm[campo] = valor.slice(0, 150);
      }
      if (Object.keys(utm).length) sessionStorage.setItem(CHAVE_UTM, JSON.stringify(utm));
    } catch {
      /* sem sessionStorage */
    }

    setMeses(opcoesEntrada());
    if (!whatsapp) console.warn('[cosmann] NEXT_PUBLIC_WHATSAPP_NUMERO vazio: o botão da Tela C fica sem número de destino.');

    // Toque feito antes do React assumir a página (fila do Hero)
    window.__quizPronto = true;
    const primeiro = (window.__filaQuiz ?? [])[0];
    window.__filaQuiz = [];
    if (primeiro?.dataset.valor && inicial.etapa === 'q1') responder('q1', primeiro.dataset.valor);

    // Botão "voltar" do celular/navegador anda para trás no quiz, sem sair da página
    const aoNavegar = (e: PopStateEvent) => {
      const alvo: Passo = e.state?.cosmann ?? INICIO;
      if (!ETAPAS.includes(alvo.etapa)) return;
      const tras = alvo.historico.length < passoRef.current.historico.length;
      travadoAte.current = 0;
      irPara({ etapa: alvo.etapa, historico: [...alvo.historico] }, tras ? 'tras' : 'frente');
    };
    // Convite final: volta ao quiz sem reiniciar
    const aoConvidar = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest?.('[data-ir-quiz]')) return;
      e.preventDefault();
      evento('clique_convite_final');
      rolarAtePainel(true);
      tituloRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener('popstate', aoNavegar);
    document.addEventListener('click', aoConvidar);
    return () => {
      window.removeEventListener('popstate', aoNavegar);
      document.removeEventListener('click', aoConvidar);
    };
  }, [irPara, responder, rolarAtePainel, whatsapp, pixelDireto]);

  // ===== Depois de cada troca de etapa: rola até o painel, foca o título e anuncia =====
  useEffect(() => {
    if (!focarAoMudar.current) return;
    focarAoMudar.current = false;
    const etapa = passo.etapa;
    garantirVisivel(etapa === 'telaA' || etapa === 'telaC' ? acaoRef.current : null);
    tituloRef.current?.focus({ preventScroll: true });
    anunciar(ehPergunta(etapa) ? `Pergunta ${NUMERO[etapa]} de 4` : tituloRef.current?.textContent ?? '');
  }, [passo, versao, garantirVisivel, anunciar]);

  // Envio falhou: o foco volta ao botão quando ele já está habilitado de novo
  useEffect(() => {
    if (erroEnvio && !enviando && passoRef.current.etapa === 'telaB') enviarRef.current?.focus();
  }, [erroEnvio, enviando]);

  // ===== Persistência leve (só passo e respostas; nunca nome ou telefone) =====
  useEffect(() => {
    try {
      sessionStorage.setItem(CHAVE_ESTADO, JSON.stringify({ ...passo, respostas, leadEnviado }));
    } catch {
      /* modo privado */
    }
  }, [passo, respostas, leadEnviado]);

  useEffect(() => {
    if (!leadEnviado || !focarConfirmacao.current) return;
    focarConfirmacao.current = false;
    rolarAtePainel(false);
    confirmacaoRef.current?.focus({ preventScroll: true });
    anunciar(telaB.confirmacao);
  }, [leadEnviado, rolarAtePainel, anunciar]);

  // ===== Máscara do WhatsApp: (DD) DDDDD-DDDD com o cursor no lugar certo =====
  const validar = useCallback((campo: Campo): boolean => {
    const ok =
      campo === 'nome'
        ? (nomeRef.current?.value.trim().length ?? 0) >= 2
        : campo === 'whatsapp'
          ? telefoneValido(normalizarTelefone(telRef.current?.value))
          : campo === 'entrada'
            ? Boolean(entradaRef.current?.value)
            : Boolean(autorizacaoRef.current?.checked);
    setErros((atual) => ({ ...atual, [campo]: ok ? '' : telaB.erros[campo] }));
    return ok;
  }, []);

  useEffect(() => {
    const tel = telRef.current;
    if (!tel) return;
    const aplicar = (digitos: string, antesDoCursor: number) => {
      const formatado = formatarTelefone(digitos);
      tel.value = formatado;
      if (document.activeElement === tel) {
        const pos = posicaoAposDigitos(formatado, antesDoCursor);
        tel.setSelectionRange(pos, pos);
      }
      if (tentou.current) validar('whatsapp');
    };
    const antesDeMudar = (e: InputEvent) => {
      if (e.inputType !== 'deleteContentBackward' && e.inputType !== 'deleteContentForward') return;
      const inicio = tel.selectionStart ?? 0;
      if (inicio !== (tel.selectionEnd ?? 0)) return; // trecho selecionado: o navegador apaga e o input reformata
      const digitos = tel.value.replace(/\D/g, '');
      const antes = tel.value.slice(0, inicio).replace(/\D/g, '').length;
      if (e.inputType === 'deleteContentBackward') {
        if (antes === 0) return;
        e.preventDefault(); // apaga o dígito antes do cursor, mesmo logo depois de ")" ou "-"
        aplicar(digitos.slice(0, antes - 1) + digitos.slice(antes), antes - 1);
      } else {
        if (antes >= digitos.length) return;
        e.preventDefault();
        aplicar(digitos.slice(0, antes) + digitos.slice(antes + 1), antes);
      }
    };
    const aoMudar = () => {
      const posicao = tel.selectionStart ?? tel.value.length;
      const antes = tel.value.slice(0, posicao).replace(/\D/g, '').length;
      let bruto = tel.value.replace(/\D/g, '');
      let removidosInicio = 0;
      if (bruto.length > 11 && bruto.startsWith('55')) {
        bruto = bruto.slice(2);
        removidosInicio += 2;
      }
      const semZeros = bruto.replace(/^0+/, '');
      removidosInicio += bruto.length - semZeros.length;
      const digitos = semZeros.slice(0, 11);
      aplicar(digitos, Math.min(Math.max(antes - removidosInicio, 0), digitos.length));
    };
    tel.addEventListener('beforeinput', antesDeMudar);
    tel.addEventListener('input', aoMudar);
    return () => {
      tel.removeEventListener('beforeinput', antesDeMudar);
      tel.removeEventListener('input', aoMudar);
    };
  }, [passo.etapa, leadEnviado, validar]);

  // Enter / "próximo" do teclado do celular vai para o campo seguinte
  const proximoCampo = (destino: { current: HTMLElement | null }) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      destino.current?.focus();
    }
  };

  // ===== Envio da Tela B =====
  async function enviarUmaVez(corpo: Record<string, string>): Promise<{ ok: boolean; rede: boolean }> {
    const controle = new AbortController();
    const limite = window.setTimeout(() => controle.abort(), LIMITE_ENVIO_MS);
    try {
      const resposta = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
        signal: controle.signal,
      });
      const json = await resposta.json().catch(() => null);
      return { ok: resposta.ok && json?.ok === true, rede: false };
    } catch (erro) {
      // estourou o tempo: não repete (o servidor pode ainda estar gravando)
      return { ok: false, rede: (erro as Error).name !== 'AbortError' };
    } finally {
      window.clearTimeout(limite);
    }
  }

  // Internet do celular caiu no meio? Tenta mais uma vez sozinho (a planilha não duplica).
  async function enviarComNovaTentativa(corpo: Record<string, string>): Promise<boolean> {
    const primeira = await enviarUmaVez(corpo);
    if (primeira.ok || !primeira.rede) return primeira.ok;
    await new Promise((r) => window.setTimeout(r, 1200));
    return (await enviarUmaVez(corpo)).ok;
  }

  function confirmar(salvo: boolean) {
    focarConfirmacao.current = passoRef.current.etapa === 'telaB';
    setLeadEnviado(true);
    if (salvo) evento('lead_reaquecimento', { event_id: novoId() });
  }

  async function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando) return;
    tentou.current = true;
    setErroEnvio('');
    const campos: Campo[] = ['nome', 'whatsapp', 'entrada', 'autorizacao'];
    const invalidos = campos.filter((c) => !validar(c));
    if (invalidos.length) {
      ({ nome: nomeRef, whatsapp: telRef, entrada: entradaRef, autorizacao: autorizacaoRef })[invalidos[0]].current?.focus();
      return;
    }
    if (siteRef.current?.value) return confirmar(false); // robô: não envia

    setEnviando(true);
    const ok = await enviarComNovaTentativa({
      nome: nomeRef.current?.value.trim() ?? '',
      whatsapp: normalizarTelefone(telRef.current?.value),
      entrada: entradaRef.current?.value ?? '',
      autorizacao: 'sim',
      website: siteRef.current?.value ?? '',
      ...lerUtm(),
    });
    setEnviando(false);
    if (ok) confirmar(true);
    else setErroEnvio(telaB.erros.envio);
  }

  // ===== Renderização =====
  const etapa = passo.etapa;
  const numero = ehPergunta(etapa) ? NUMERO[etapa] : 0;
  const animacao = direcao === 'frente' ? styles.entraFrente : direcao === 'tras' ? styles.entraTras : '';
  const travado = (e: { preventDefault(): void }) => {
    if (performance.now() < travadoAte.current) {
      e.preventDefault();
      return true;
    }
    return false;
  };
  const respostasApto = {
    tempoEmpresa: respostas['2'] ?? '',
    emprestimoFolha: respostas['3'] ?? '',
    valorDesejado: respostas['4'] ?? '',
  };

  return (
    <section id="quiz" ref={painelRef} className={styles.quiz} aria-label="Perguntas">
      <div className={styles.topo}>
        {passo.historico.length > 0 && (
          <button type="button" className={styles.voltar} onClick={voltar} data-voltar="">
            <Icone nome="voltar" />
            Voltar
          </button>
        )}
        {numero > 0 && <p className={styles.contador}>{numero} de 4</p>}
      </div>
      {numero > 0 && (
        <div
          className={styles.progresso}
          role="progressbar"
          aria-label="Progresso"
          aria-valuemin={1}
          aria-valuemax={4}
          aria-valuenow={numero}
          aria-valuetext={`Pergunta ${numero} de 4`}
        >
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className={i <= numero ? styles.ativo : undefined} />
          ))}
        </div>
      )}

      <noscript>
        <p className={styles.aviso}>Ative o JavaScript do seu navegador para responder às perguntas.</p>
      </noscript>

      <div key={`${etapa}-${versao}`} className={`${styles.etapa} ${animacao}`} data-etapa={etapa}>
        {ehPergunta(etapa) &&
          (() => {
            const pergunta = perguntas.find((p) => p.id === etapa)!;
            return (
              <>
                <h2 ref={tituloRef} id={`t-${etapa}`} className={styles.titulo} tabIndex={-1}>
                  {pergunta.texto}
                </h2>
                <div className={styles.opcoes} role="group" aria-labelledby={`t-${etapa}`}>
                  {pergunta.opcoes.map((opcao, i) => {
                    const marcada = respostas[String(numero)] === opcao;
                    return (
                      <button
                        key={opcao}
                        type="button"
                        className={styles.opcao}
                        data-opcao=""
                        data-valor={opcao}
                        aria-pressed={marcada}
                        style={{ '--i': i } as CSSProperties}
                        onClick={() => responder(etapa, opcao)}
                      >
                        <span>{opcao}</span>
                        <span className={styles.marca}>
                          <Icone nome={marcada ? 'check' : 'seta'} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            );
          })()}

        {etapa === 'telaA' && (
          <>
            <span className={styles.resultadoIcone}>
              <Icone nome="info" />
            </span>
            <h2 ref={tituloRef} className={styles.titulo} tabIndex={-1}>
              {telaA.titulo}
            </h2>
            <p className={styles.texto}>{telaA.texto}</p>
            <a
              ref={acaoRef}
              className={`botao ${styles.acao}`}
              href={instagram}
              data-instagram=""
              target="_blank"
              rel="noopener"
              onClick={(e) => !travado(e) && evento('clique_instagram')}
            >
              <Icone nome="instagram" />
              {telaA.botao}
            </a>
          </>
        )}

        {etapa === 'telaB' && (
          <>
            <span className={styles.resultadoIcone}>
              <Icone nome="calendario" />
            </span>
            <h2 ref={tituloRef} className={styles.titulo} tabIndex={-1}>
              {telaB.titulo}
            </h2>
            <p className={styles.texto}>{telaB.texto}</p>

            {leadEnviado ? (
              <div ref={confirmacaoRef} className={styles.confirmacao} tabIndex={-1} data-confirmacao="">
                <span className={styles.confirmacaoIcone}>
                  <Icone nome="check" />
                </span>
                <p>{telaB.confirmacao}</p>
              </div>
            ) : (
              <form className={styles.form} action="/api/lead" method="post" noValidate onSubmit={aoEnviar}>
                <div className={styles.campo}>
                  <label htmlFor="b-nome">{telaB.campos.nome}</label>
                  <input
                    ref={nomeRef}
                    id="b-nome"
                    name="nome"
                    type="text"
                    autoComplete="name"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    maxLength={120}
                    required
                    aria-invalid={erros.nome ? true : undefined}
                    aria-describedby="erro-nome"
                    onInput={() => tentou.current && validar('nome')}
                    onKeyDown={proximoCampo(telRef)}
                  />
                  <p className={erros.nome ? styles.erro : undefined} id="erro-nome">
                    {erros.nome}
                  </p>
                </div>
                <div className={styles.campo}>
                  <label htmlFor="b-whatsapp">{telaB.campos.whatsapp}</label>
                  <input
                    ref={telRef}
                    id="b-whatsapp"
                    name="whatsapp"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    enterKeyHint="next"
                    required
                    aria-invalid={erros.whatsapp ? true : undefined}
                    aria-describedby="erro-whatsapp"
                    onKeyDown={proximoCampo(entradaRef)}
                  />
                  <p className={erros.whatsapp ? styles.erro : undefined} id="erro-whatsapp">
                    {erros.whatsapp}
                  </p>
                </div>
                <div className={styles.campo}>
                  <label htmlFor="b-entrada">{telaB.campos.entrada}</label>
                  <div className={styles.selecao}>
                    <select
                      ref={entradaRef}
                      id="b-entrada"
                      name="entrada"
                      required
                      defaultValue=""
                      aria-invalid={erros.entrada ? true : undefined}
                      aria-describedby="erro-entrada"
                      onChange={() => tentou.current && validar('entrada')}
                    >
                      <option value="">{telaB.campos.selecione}</option>
                      {meses.map((m) => (
                        <option key={m.valor} value={m.valor}>
                          {m.rotulo}
                        </option>
                      ))}
                    </select>
                    <Icone nome="seta" className={styles.selecaoSeta} />
                  </div>
                  <p className={erros.entrada ? styles.erro : undefined} id="erro-entrada">
                    {erros.entrada}
                  </p>
                </div>

                <div className={styles.hp} aria-hidden="true">
                  <label htmlFor="b-site">Não preencha este campo</label>
                  <input ref={siteRef} id="b-site" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className={styles.autoriza}>
                  <label className={styles.caixa} htmlFor="b-autorizacao">
                    <input
                      ref={autorizacaoRef}
                      id="b-autorizacao"
                      name="autorizacao"
                      type="checkbox"
                      value="sim"
                      required
                      aria-invalid={erros.autorizacao ? true : undefined}
                      aria-describedby="erro-autorizacao"
                      onChange={() => tentou.current && validar('autorizacao')}
                    />
                    <span>{telaB.autorizacao}</span>
                  </label>
                  <a className={styles.politica} href="/politica-de-privacidade" target="_blank" rel="noopener">
                    {telaB.politica}
                  </a>
                  <p className={erros.autorizacao ? styles.erro : undefined} id="erro-autorizacao">
                    {erros.autorizacao}
                  </p>
                </div>

                <button ref={enviarRef} type="submit" className="botao" disabled={enviando} data-enviar="">
                  {enviando ? telaB.enviando : telaB.botao}
                </button>
                <p className={erroEnvio ? styles.erro : undefined} role="alert">
                  {erroEnvio}
                </p>
              </form>
            )}
          </>
        )}

        {etapa === 'telaC' && (
          <>
            <span className={styles.sucesso} aria-hidden="true">
              <svg viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="30" />
                <path d="m20 33 8.5 8.5L45 24" />
              </svg>
            </span>
            <h2 ref={tituloRef} className={styles.titulo} tabIndex={-1}>
              {telaC.titulo}
            </h2>
            <p className={styles.texto}>{telaC.texto}</p>
            <a
              ref={acaoRef}
              className={`botao ${styles.acao}`}
              href={linkWhatsApp(whatsapp, mensagemWhatsApp(respostasApto))}
              data-whatsapp-link=""
              onClick={(e) => {
                if (travado(e)) return;
                evento('clique_whatsapp', {
                  event_id: novoId(),
                  tempo_empresa: respostasApto.tempoEmpresa,
                  emprestimo_folha: respostasApto.emprestimoFolha,
                  valor_desejado: respostasApto.valorDesejado,
                });
              }}
            >
              <Icone nome="whatsapp" />
              {telaC.botao}
            </a>
            <p className={styles.letraMiuda}>{telaC.letraMiuda}</p>
          </>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {anuncio}
      </p>
    </section>
  );
}
