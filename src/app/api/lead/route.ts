import { validarLead } from '@/lib/lead';

// Função Node na Vercel: recebe o contato da Tela B e grava na planilha do Google
// (via Google Apps Script). O endereço da planilha fica escondido no servidor.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TEMPO_LIMITE_MS = 8000; // 2 tentativas cabem nos 25 s que a página espera

const responder = (corpo: Record<string, unknown>, status = 200) =>
  Response.json(corpo, { status, headers: { 'Cache-Control': 'no-store' } });

/** O navegador sempre manda Origin num POST; aceita só o que vem do próprio site */
function mesmaOrigem(request: Request): boolean {
  const origem = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!origem || !host) return false;
  try {
    return new URL(origem).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!mesmaOrigem(request)) return responder({ ok: false, erro: 'origem_invalida' }, 403);

  let dados: Record<string, unknown>;
  try {
    const tipo = request.headers.get('content-type') ?? '';
    dados = tipo.includes('application/json')
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
  } catch {
    return responder({ ok: false, erro: 'corpo_invalido' }, 400);
  }
  if (!dados || typeof dados !== 'object') return responder({ ok: false, erro: 'corpo_invalido' }, 400);
  if (['nome', 'whatsapp', 'entrada'].some((campo) => typeof dados[campo] !== 'string')) {
    return responder({ ok: false, erro: 'campo_invalido' }, 422);
  }

  // campo escondido preenchido = robô: finge que deu certo e não grava
  if (String(dados.website ?? '').trim()) return responder({ ok: true });

  const resultado = validarLead(dados);
  if (!resultado.ok) return responder({ ok: false, erro: resultado.erro }, 422);

  const destino = (process.env.SHEETS_WEBHOOK_URL ?? '').trim();
  if (!destino) {
    console.error('[lead] SHEETS_WEBHOOK_URL não configurada na Vercel');
    return responder({ ok: false, erro: 'nao_configurado' }, 500);
  }

  const { lead } = resultado;
  const corpo = new URLSearchParams({
    nome: lead.nome,
    whatsapp: lead.whatsapp,
    entrada: lead.entrada,
    autorizacao: 'sim',
    ...lead.utm,
  });

  // uma nova tentativa se a rede falhar (o Apps Script não duplica reenvios)
  for (let tentativa = 1; tentativa <= 2; tentativa++) {
    try {
      const resposta = await fetch(destino, {
        method: 'POST',
        body: corpo,
        redirect: 'follow',
        cache: 'no-store',
        signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
      });
      const json = (await resposta.json().catch(() => null)) as { ok?: boolean; erro?: string } | null;
      if (json?.ok === true) return responder({ ok: true });
      console.error('[lead] planilha recusou:', resposta.status, json?.erro ?? 'sem_json'); // nunca registrar nome/telefone
      return responder({ ok: false, erro: 'planilha_recusou' }, 502);
    } catch (erro) {
      if (tentativa === 2) {
        console.error('[lead] falha de rede com a planilha:', (erro as Error).name);
        return responder({ ok: false, erro: 'planilha_indisponivel' }, 504);
      }
    }
  }
  return responder({ ok: false, erro: 'erro_interno' }, 500);
}

export function GET() {
  return responder({ ok: false, erro: 'metodo_nao_permitido' }, 405);
}
