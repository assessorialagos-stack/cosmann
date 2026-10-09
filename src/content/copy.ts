/**
 * TEXTOS APROVADOS — iguais aos anúncios (briefing da Lagos, 27/09).
 *
 * Pode ajustar para caber no layout, mas NUNCA entre com número fora da
 * tabela de informações fixas:
 *   taxa: "Taxa reduzida", sem número · valor: de R$ 1.000 a R$ 30 mil ·
 *   prazo: em até 48 parcelas · requisito: a partir de 6 meses de carteira ·
 *   12 anos, no mesmo endereço · Rua Doutor Maruri, 576, Centro, Concórdia, SC ·
 *   sem avalista · desconto direto em folha
 *
 * Nunca pode aparecer: taxa em número ou percentual; "sem consulta ao SPC" ou
 * "nome sujo"; "20 anos de mercado"; "100% digital" ou "sem sair de casa";
 * promessa de aprovação, prazo de liberação ou valor garantido; nome ou logo de banco.
 */

export const topo = {
  // O título é um texto só; está partido para o trecho do valor ganhar destaque em amarelo.
  titulo: {
    antes: 'Consignado CLT de ',
    destaque: 'R$ 1.000 a R$ 30 mil',
    depois: ', em até 48x e sem avalista',
  },
  subtitulo: 'Responda 4 perguntas rápidas e descubra se você já pode contratar',
  apoio: 'Leva menos de 1 minuto',
  fotoAlt: 'Trabalhador com colete refletivo laranja e capacete de segurança debaixo do braço',
  selos: ['Sem avalista', 'Desconto direto em folha'],
};

export const perguntas = [
  { id: 'q1', numero: 1, texto: 'Você trabalha com carteira assinada hoje?', opcoes: ['Sim', 'Não'] },
  { id: 'q2', numero: 2, texto: 'Há quanto tempo você está na empresa atual?', opcoes: ['Menos de 6 meses', 'De 6 a 12 meses', 'Mais de 12 meses'] },
  { id: 'q3', numero: 3, texto: 'Você já tem algum empréstimo descontado em folha?', opcoes: ['Sim', 'Não'] },
  {
    id: 'q4',
    numero: 4,
    texto: 'Quanto você pretende receber?',
    opcoes: ['Até R$ 3 mil', 'De R$ 3 mil a R$ 10 mil', 'De R$ 10 mil a R$ 20 mil', 'De R$ 20 mil a R$ 30 mil'],
  },
] as const;

export const telaA = {
  titulo: 'O consignado CLT é exclusivo para quem tem carteira assinada',
  texto: 'Obrigado por responder. Quando você estiver trabalhando com carteira assinada, volte aqui que a gente faz a sua simulação',
  botao: 'Seguir a Cosmann no Instagram',
};

export const telaB = {
  titulo: 'Falta pouco para você poder contratar',
  texto: 'O consignado CLT pede pelo menos 6 meses na empresa atual. Deixe seu contato e a gente te chama assim que você completar o tempo',
  campos: {
    nome: 'Nome',
    whatsapp: 'WhatsApp com DDD',
    entrada: 'Mês e ano em que entrou na empresa atual',
    selecione: 'Selecione',
  },
  autorizacao: 'Autorizo a Cosmann a falar comigo pelo WhatsApp sobre crédito consignado',
  politica: 'Política de privacidade',
  botao: 'Quero ser avisado',
  enviando: 'Enviando...',
  confirmacao: 'Pronto! A gente te chama quando você completar 6 meses de carteira',
  erros: {
    nome: 'Digite seu nome',
    whatsapp: 'Digite seu WhatsApp com DDD',
    entrada: 'Selecione o mês e o ano',
    autorizacao: 'Marque a autorização para a gente poder te chamar',
    envio: 'Não conseguimos enviar agora. Confira sua internet e tente de novo.',
  },
};

export const telaC = {
  titulo: 'Boa notícia: pelo que você respondeu, você já pode simular',
  texto: 'Toque no botão abaixo para falar com a gente no WhatsApp. Suas respostas já vão junto, você não precisa repetir nada',
  botao: 'Fazer minha simulação no WhatsApp',
  letraMiuda: 'Sujeito a análise de crédito e às condições de cada banco',
};

export const beneficios = {
  titulo: 'Por que o consignado CLT',
  cartoes: [
    { icone: 'folha', titulo: 'Desconto direto em folha', texto: 'A parcela sai do seu salário. Sem boleto e sem se preocupar com data de vencimento' },
    { icone: 'taxa', titulo: 'Taxa reduzida', texto: 'Por ser descontado em folha, o consignado tem taxa menor que o empréstimo pessoal comum' },
    { icone: 'avalista', titulo: 'Sem avalista', texto: 'Você não precisa de ninguém para garantir o empréstimo' },
  ],
} as const;

export const passos = {
  titulo: 'Como funciona',
  itens: [
    'Responda as 4 perguntas desta página',
    'Fale com a gente no WhatsApp, já com suas respostas',
    'A gente simula nos bancos parceiros e te mostra o número. Você decide',
  ],
};

export const sobre = {
  sobretitulo: 'Quem é a Cosmann',
  // "12 anos no mesmo endereço": o 12 ganha destaque visual, o texto é o mesmo.
  tituloNumero: '12',
  tituloResto: 'anos no mesmo endereço',
  texto:
    'A Cosmann Financeira é correspondente bancário e trabalha com mais de um banco para encontrar a condição certa para você. Atendimento pelo WhatsApp ou na nossa loja em Concórdia SC',
  fotoAlt: 'Fachada da loja da Cosmann Financeira em Concórdia',
};

export const convite = {
  titulo: 'Descubra em menos de 1 minuto se você já pode contratar',
  botao: 'Fazer minha simulação',
};

export const rodape = {
  texto: (cnpj: string) =>
    `Cosmann Financeira, correspondente bancário. CNPJ ${cnpj}. Rua Doutor Maruri, 576, Centro, Concórdia SC. Sujeito a análise de crédito e às condições de cada banco.`,
  politica: 'Política de privacidade',
};

export const meta = {
  titulo: 'Consignado CLT em Concórdia SC | Cosmann Financeira',
  descricao:
    'Consignado CLT de R$ 1.000 a R$ 30 mil, em até 48x e sem avalista. Responda 4 perguntas rápidas e descubra se você já pode contratar',
};
