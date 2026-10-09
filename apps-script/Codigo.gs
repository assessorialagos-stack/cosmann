/**
 * ============================================================================
 *  COSMANN FINANCEIRA · Landing "Consignado CLT" · Google Apps Script
 *  Recebe os contatos da Tela B (reaquecimento) e grava na planilha do Google,
 *  uma linha por contato. A coluna E ("Completa 6 meses em") é calculada e diz
 *  quando a pessoa completa 6 meses na empresa atual. A coluna F ("Situação")
 *  muda sozinha para "Já pode chamar" (em verde) quando chega esse mês.
 * ============================================================================
 *
 *  COMO PUBLICAR (uma vez só)
 *
 *  1. Crie uma planilha nova no Google Planilhas NA CONTA GOOGLE DA COSMANN
 *     (ou compartilhe com ela): os dados precisam ficar acessíveis ao cliente.
 *     Sugestão de nome: "Contatos da landing - Cosmann".
 *  2. Na planilha, abra Extensões > Apps Script (Extensions > Apps Script).
 *  3. Apague o que estiver no arquivo Código.gs, cole ESTE arquivo inteiro e
 *     salve (Ctrl+S). Assim o script fica vinculado à planilha.
 *     Opcional: em Configurações do projeto (engrenagem), marque "Mostrar o
 *     arquivo de manifesto appsscript.json no editor" e cole nele o conteúdo
 *     do arquivo appsscript.json desta pasta (fuso America/Sao_Paulo, V8).
 *  4. Na barra do editor, escolha a função "configurar" e clique em Executar.
 *     Autorize: Revisar permissões > escolha a conta > se aparecer "O Google
 *     não verificou este app", clique em Avançado > Acessar (nome do projeto)
 *     > Permitir. No registro de execução deve aparecer "Pronto".
 *     Isso cria a aba "Contatos" com títulos, formatos e a regra verde, e
 *     guarda o ID da planilha para o App da Web.
 *  5. Clique em Implantar > Nova implantação (Deploy > New deployment). Ao
 *     lado de "Selecionar tipo", clique na engrenagem e escolha "App da Web":
 *        Executar como: Eu
 *        Quem pode acessar: Qualquer pessoa
 *     (Não use "Qualquer pessoa com Conta do Google": quem chega pelo anúncio
 *     não está logado e o envio falharia.)
 *     Clique em Implantar e copie a URL do app da Web (termina em /exec).
 *  6. Na Vercel (Settings > Environment Variables), cadastre essa URL como
 *     SHEETS_WEBHOOK_URL e faça um novo deploy do site.
 *  7. Teste: abra a URL /exec no navegador; deve aparecer "planilha conectada".
 *     Depois faça um cadastro de teste na Tela B da página e confira a linha
 *     nova na aba Contatos. Apague a linha de teste.
 *
 *  ATUALIZAR ESTE CÓDIGO MANTENDO A MESMA URL
 *     Só salvar não muda o que roda na URL /exec. Depois de salvar:
 *     Implantar > Gerenciar implantações > selecione a implantação ativa >
 *     Editar (lápis) > Versão: Nova versão > Implantar.
 *     Não crie outra "Nova implantação": ela gera OUTRA URL.
 *
 *  SCRIPT AUTÔNOMO (criado em script.google.com, fora da planilha)
 *     Preencha SPREADSHEET_ID abaixo com o ID da planilha (o trecho entre /d/
 *     e /edit no endereço dela) e siga a partir do passo 4.
 *
 *  COMO A EQUIPE USA A PLANILHA
 *     Ordene ou filtre pela coluna E ou pela F. "Já pode chamar" quer dizer
 *     que chegou o mês em que a pessoa completa 6 meses na empresa atual.
 *     A planilha guarda dados pessoais (LGPD): não compartilhe publicamente.
 *
 *  NOTA TÉCNICA (para quem mexer no site)
 *     O site não chama esta URL pelo navegador: o formulário envia para a
 *     função /api/lead (servidor da Vercel), que valida os dados e repassa
 *     para cá um POST urlencoded (nome, whatsapp, entrada, autorizacao e, se
 *     houver, utm_source/utm_medium/utm_campaign/utm_content/utm_term, gravados
 *     nas colunas H a L). O Google responde com um redirecionamento para
 *     script.googleusercontent.com; a função segue e lê o JSON {"ok":true} ou
 *     {"ok":false,"erro":"..."}. Por isso o doPost devolve sempre JSON.
 */

// ===== CONFIGURAÇÃO =====
// Script vinculado à planilha: deixe vazio. Script autônomo: cole o ID da planilha.
const SPREADSHEET_ID = '';

const NOME_ABA = 'Contatos';
const FUSO = 'America/Sao_Paulo';
const CABECALHOS = [
  'Data do cadastro',                // A
  'Nome',                            // B
  'WhatsApp',                        // C
  'Entrou na empresa em',            // D
  'Completa 6 meses até',            // E
  'Situação',                        // F
  'Autorizou contato pelo WhatsApp', // G
  'utm_source',                      // H (campanha de onde a pessoa veio)
  'utm_medium',                      // I
  'utm_campaign',                    // J
  'utm_content',                     // K
  'utm_term'                         // L
];
const CAMPOS_UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const LARGURAS = [140, 240, 150, 160, 170, 140, 230, 130, 110, 170, 150, 120];
// Formatos do Planilhas: "hh" sem AM/PM mostra a hora de 00 a 23; "MM" é sempre o mês.
const FORMATO_DATA_HORA = 'dd/MM/yyyy hh:mm';
const FORMATO_MES_ANO = 'MM/yyyy';
const FORMATO_DATA = 'dd/MM/yyyy';
const PODE_CHAMAR = 'Já pode chamar';
const AGUARDANDO = 'Aguardando';

const ESPERA_TRAVA_MS = 8000;              // a função do site desiste em 10 s
const JANELA_REPETIDO_MS = 10 * 60 * 1000; // mesmo cadastro reenviado em 10 min não duplica
const TOLERANCIA_FUTURO_MESES = 1;         // celular com relógio ou fuso adiantado
const LIMITE_PASSADO_MESES = 24;           // entrada mais antiga que isso é recusada

const PROP_PLANILHA = 'PLANILHA_ID';
const PROP_SEPARADOR = 'SEPARADOR_FORMULA';

// ===== APP DA WEB =====

/** Recebe o POST da Tela B (application/x-www-form-urlencoded) e grava uma linha. */
function doPost(e) {
  try {
    const p = (e && e.parameter) || {};

    // Honeypot preenchido = robô: responde sucesso e não grava nada.
    if (texto_(p.website) !== '') return responder_({ ok: true });

    const v = validar_(p);
    if (v.erro) return responder_({ ok: false, erro: v.erro });

    const ss = abrirPlanilha_();
    const trava = LockService.getScriptLock();
    if (!trava.tryLock(ESPERA_TRAVA_MS)) return responder_({ ok: false, erro: 'planilha_ocupada' });
    try {
      gravarContato_(ss, obterAba_(ss, false), v);
      SpreadsheetApp.flush(); // grava tudo antes de soltar a trava
    } finally {
      trava.releaseLock();
    }
    return responder_({ ok: true });
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    console.error('doPost: ' + msg); // nunca registrar nome ou telefone
    return responder_({ ok: false, erro: msg === 'planilha_nao_configurada' ? msg : 'erro_interno' });
  }
}

/** Verificação: abrir a URL /exec no navegador mostra se está tudo ligado. */
function doGet() {
  let estado;
  try {
    abrirPlanilha_();
    estado = 'pronto, planilha conectada';
  } catch (err) {
    estado = 'falta configurar: rode a função configurar() no editor do Apps Script';
  }
  return ContentService.createTextOutput('Cosmann Financeira · contatos da Tela B · ' + estado);
}

// ===== RODAR UMA VEZ PELO EDITOR =====

/** Prepara a planilha. Pode rodar de novo sem problema (não duplica nada). */
function configurar() {
  const ss = SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActive();
  if (!ss) {
    throw new Error('Planilha não encontrada. Abra o editor pela planilha (Extensões > Apps Script) ou preencha SPREADSHEET_ID.');
  }
  const trava = LockService.getScriptLock();
  trava.waitLock(30000);
  try {
    const props = PropertiesService.getScriptProperties();
    props.setProperty(PROP_PLANILHA, ss.getId()); // o App da Web abre a planilha por este ID
    ss.setSpreadsheetTimeZone(FUSO);              // cadastro e TODAY() no horário de Brasília
    obterAba_(ss, true);
    const sep = detectarSeparador_(ss);
    props.setProperty(PROP_SEPARADOR, sep || ',');
    SpreadsheetApp.flush();
    if (!sep) console.warn('Não consegui testar as fórmulas nesta planilha; vou usar vírgula como separador.');
    console.log('Pronto: aba "' + NOME_ABA + '" configurada na planilha "' + ss.getName() +
      '" (fuso ' + FUSO + ', separador das fórmulas: ' + (sep === ';' ? 'ponto e vírgula' : 'vírgula') +
      '). Agora faça o passo 5 do topo do arquivo: Implantar > Nova implantação.');
  } finally {
    trava.releaseLock();
  }
}

// ===== FUNÇÕES INTERNAS =====

/** Valida os campos. Devolve { erro } ou { nome, whatsapp, entrada }. */
function validar_(p) {
  const nome = limparNome_(p.nome);
  if (nome.length < 1 || nome.length > 120) return { erro: 'nome_invalido' };

  const whatsapp = texto_(p.whatsapp).replace(/\D/g, '');
  if (!/^[1-9]{2}\d{8,9}$/.test(whatsapp)) return { erro: 'whatsapp_invalido' }; // DDD + 8 ou 9 dígitos

  const entrada = texto_(p.entrada);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(entrada)) return { erro: 'entrada_invalida' };
  const distancia = indiceMes_(entrada) - indiceMes_(Utilities.formatDate(new Date(), FUSO, 'yyyy-MM'));
  if (distancia > TOLERANCIA_FUTURO_MESES || distancia < -LIMITE_PASSADO_MESES) return { erro: 'entrada_invalida' };

  if (texto_(p.autorizacao).toLowerCase() !== 'sim') return { erro: 'autorizacao_ausente' };

  const utm = CAMPOS_UTM.map(function (campo) { return texto_(p[campo]).slice(0, 150); });
  return { nome: nome, whatsapp: whatsapp, entrada: entrada, utm: utm };
}

/** Escreve a linha do contato (colunas A a G) logo abaixo da última. */
function gravarContato_(ss, aba, v) {
  const tz = ss.getSpreadsheetTimeZone() || FUSO;
  const rotulo = formatarWhatsApp_(v.whatsapp);
  if (cadastroRepetido_(aba, v, rotulo, tz)) return; // mesmo cadastro reenviado: não duplica

  const linha = Math.max(2, aba.getLastRow() + 1);
  if (linha > aba.getMaxRows()) aba.insertRowsAfter(aba.getMaxRows(), 100);

  // Fórmulas em inglês. Se a planilha pedir ";" (ver configurar), troca as vírgulas:
  // nenhum texto dentro destas fórmulas tem vírgula.
  // Planilha em português usa ";". Se o configurar() não rodou, descobre agora (uma vez só) e guarda.
  const props = PropertiesService.getScriptProperties();
  let sep = props.getProperty(PROP_SEPARADOR);
  if (!sep) {
    sep = detectarSeparador_(ss) || ';';
    props.setProperty(PROP_SEPARADOR, sep);
  }
  const formula = function (f) { return sep === ',' ? f : f.replace(/,/g, sep); };

  // Valores primeiro (C, E e F ficam vazios) ...
  aba.getRange(linha, 1, 1, CABECALHOS.length).setValues([[
    new Date(),                                                         // A Data do cadastro
    protegerFormula_(v.nome),                                           // B Nome
    '',                                                                 // C (fórmula abaixo)
    Utilities.parseDate(v.entrada + '-01', tz, 'yyyy-MM-dd'),           // D dia 1 do mês de entrada
    '',                                                                 // E (fórmula abaixo)
    '',                                                                 // F (fórmula abaixo)
    'Sim'                                                               // G Autorizou contato
  ].concat(v.utm.map(protegerFormula_))]);                              // H a L campanha
  // ... depois as fórmulas com setFormula, o mesmo método que o configurar() testou.
  // (setValues lê a fórmula no idioma da planilha e quebra em planilha pt-BR.)
  aba.getRange(linha, 3).setFormula(formula(`=HYPERLINK("https://wa.me/55${v.whatsapp}","${rotulo}")`)); // C WhatsApp clicável
  aba.getRange(linha, 5, 1, 2).setFormulas([[
    formula(`=EOMONTH(D${linha},6)`),                                   // E fim do 6º mês: todos já completaram
    formula(`=IF(E${linha}="","",IF(E${linha}<=TODAY(),"${PODE_CHAMAR}","${AGUARDANDO}"))`) // F Situação
  ]]);
  aba.getRange(linha, 1).setNumberFormat(FORMATO_DATA_HORA);
  aba.getRange(linha, 4).setNumberFormat(FORMATO_MES_ANO);
  aba.getRange(linha, 5).setNumberFormat(FORMATO_DATA);
}

/** True se o mesmo WhatsApp e mês de entrada chegaram há poucos minutos (ex.: reenvio após queda de internet). */
function cadastroRepetido_(aba, v, rotulo, tz) {
  const ultima = aba.getLastRow();
  if (ultima < 2) return false;
  const inicio = Math.max(2, ultima - 19);
  const linhas = aba.getRange(inicio, 1, ultima - inicio + 1, 4).getValues(); // A a D
  const agora = Date.now();
  return linhas.some(function (l) {
    return l[2] === rotulo &&
      ehData_(l[0]) && agora - l[0].getTime() < JANELA_REPETIDO_MS &&
      ehData_(l[3]) && Utilities.formatDate(l[3], tz, 'yyyy-MM') === v.entrada;
  });
}

/** Abre a planilha: ID fixo (script autônomo) > ID salvo pelo configurar() > planilha vinculada. */
function abrirPlanilha_() {
  if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID);
  const props = PropertiesService.getScriptProperties();
  const salvo = props.getProperty(PROP_PLANILHA);
  if (salvo) return SpreadsheetApp.openById(salvo);
  // Pela documentação, getActive() não fica disponível no App da Web; só tenta como último recurso.
  let ativa = null;
  try {
    ativa = SpreadsheetApp.getActive();
  } catch (err) {
    ativa = null;
  }
  if (ativa) {
    props.setProperty(PROP_PLANILHA, ativa.getId());
    return ativa;
  }
  throw new Error('planilha_nao_configurada');
}

/** Pega a aba "Contatos"; cria e formata se faltar. */
function obterAba_(ss, forcarFormato) {
  let aba = ss.getSheetByName(NOME_ABA);
  let formatar = Boolean(forcarFormato);
  if (!aba) {
    const abas = ss.getSheets();
    const unicaVazia = abas.length === 1 && abas[0].getLastRow() === 0 && abas[0].getLastColumn() === 0;
    aba = unicaVazia ? abas[0].setName(NOME_ABA) : ss.insertSheet(NOME_ABA); // aproveita a aba vazia padrão
    formatar = true;
  } else if (texto_(aba.getRange(1, 1).getValue()) === '') {
    formatar = true; // aba existe, mas sem os títulos
  }
  if (formatar) formatarAba_(aba);
  return aba;
}

/** Títulos em negrito, linha 1 congelada, larguras, formatos e regra verde na coluna F. */
function formatarAba_(aba) {
  if (aba.getMaxRows() < 2) aba.insertRowsAfter(aba.getMaxRows(), 100); // garante linhas para A2:A, D2:E e F2:F
  aba.getRange(1, 1, 1, CABECALHOS.length)
    .setValues([CABECALHOS])
    .setFontWeight('bold')
    .setBackground('#005081')
    .setFontColor('#FFFFFF')
    .setVerticalAlignment('middle');
  aba.setFrozenRows(1);
  LARGURAS.forEach(function (largura, i) { aba.setColumnWidth(i + 1, largura); });
  aba.getRange('A2:A').setNumberFormat(FORMATO_DATA_HORA);
  aba.getRange('D2:D').setNumberFormat(FORMATO_MES_ANO);
  aba.getRange('E2:E').setNumberFormat(FORMATO_DATA);
  aba.getRange('E1').setNote('Último dia do 6º mês depois da entrada (coluna D): nessa data a pessoa com certeza já completou 6 meses na empresa atual, seja qual for o dia em que entrou. Quem entrou no começo do mês pode já estar apto um pouco antes.');
  aba.getRange('F1').setNote('Muda sozinho para "' + PODE_CHAMAR + '" (verde) quando chega a data da coluna E.');

  // Troca a regra antiga da coluna F pela nova, sem duplicar.
  const regras = aba.getConditionalFormatRules().filter(function (regra) {
    return !regra.getRanges().some(function (r) { return r.getColumn() === 6 && r.getNumColumns() === 1; });
  });
  regras.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo(PODE_CHAMAR)
    .setBackground('#B7E1CD')
    .setFontColor('#0D652D')
    .setBold(true)
    .setRanges([aba.getRange('F2:F')])
    .build());
  aba.setConditionalFormatRules(regras);
}

/** Descobre se esta planilha aceita vírgula ou ponto e vírgula nas fórmulas gravadas pelo script. */
function detectarSeparador_(ss) {
  const teste = ss.insertSheet('teste-formulas-' + Date.now()); // aba temporária, apagada no fim
  try {
    const celula = teste.getRange(1, 1);
    const candidatos = [',', ';'];
    for (let i = 0; i < candidatos.length; i++) {
      try {
        celula.setFormula('=IF(EDATE(DATE(2026,4,1),6)=DATE(2026,10,1),"ok","x")'.replace(/,/g, candidatos[i]));
        SpreadsheetApp.flush();
        if (celula.getDisplayValue() === 'ok') return candidatos[i];
      } catch (err) {
        // tenta o próximo
      }
    }
    return null;
  } finally {
    ss.deleteSheet(teste);
  }
}

/** "(DD) DDDDD-DDDD" ou "(DD) DDDD-DDDD". */
function formatarWhatsApp_(d) {
  const corte = d.length === 11 ? 7 : 6;
  return '(' + d.slice(0, 2) + ') ' + d.slice(2, corte) + '-' + d.slice(corte);
}

/** Texto começando com = + - @ vira texto puro (apóstrofo na frente), nunca fórmula. */
function protegerFormula_(s) {
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

/** Tira controles e caracteres invisíveis, junta espaços repetidos. */
function limparNome_(v) {
  return texto_(v)
    .replace(/[\u00AD\u200B-\u200F\u202A-\u202E\u2060-\u2069\uFEFF]/g, '')  // invisíveis (ex.: espaço de largura zero)
    .replace(/[\u0000-\u001F\u007F-\u009F\u2028\u2029\s]+/g, ' ')  // controles, quebras e espaços viram um espaço
    .trim();
}

function texto_(v) {
  return v == null ? '' : String(v).trim();
}

/** "AAAA-MM" vira um número de mês corrido, para comparar datas. */
function indiceMes_(aaaaMm) {
  const partes = aaaaMm.split('-');
  return Number(partes[0]) * 12 + Number(partes[1]) - 1;
}

function ehData_(v) {
  return Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v.getTime());
}

function responder_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
