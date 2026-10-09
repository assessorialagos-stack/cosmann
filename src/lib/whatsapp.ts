export interface RespostasApto {
  tempoEmpresa: string; // pergunta 2
  emprestimoFolha: string; // pergunta 3
  valorDesejado: string; // pergunta 4
}

/** Mensagem pronta do briefing; a pessoa só aperta enviar. */
export function mensagemWhatsApp(r: RespostasApto): string {
  return [
    'Olá! Vim pela página da Cosmann e quero fazer minha simulação.',
    `Tempo na empresa: ${r.tempoEmpresa}`,
    `Empréstimo em folha: ${r.emprestimoFolha}`,
    `Valor desejado: ${r.valorDesejado}`,
  ].join('\n');
}

export function linkWhatsApp(numero: string, mensagem: string): string {
  return `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
}
