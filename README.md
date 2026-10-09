# Cosmann Financeira · Landing do Consignado CLT

Next.js 16 (App Router) + React 19 + TypeScript, publicado na Vercel pelo GitHub com o **Application Preset: Next.js**.
A página e a política de privacidade são geradas no build (estáticas, servidas pela CDN). Só o quiz roda no navegador, e a rota `/api/lead` é uma função Node que grava os contatos da Tela B na planilha do Google.

## Rodar no computador

Node 20.9 ou mais novo (recomendado 24):

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção (inclui a checagem de tipos)
npm run start      # serve o build
npm run typecheck  # só a checagem de tipos
```

## Publicar na Vercel

1. Suba esta pasta para um repositório no GitHub.
2. Vercel → Add New → Project → importe o repositório. O preset **Next.js** é detectado sozinho; não precisa mudar build nem output.
3. Settings → Environment Variables: cadastre as variáveis abaixo e faça o deploy.
4. Subdomínio (ex.: `consignado.cosmann.com.br`): Settings → Domains → adicione o domínio e crie, no DNS do cosmann.com.br, o registro CNAME que a Vercel mostrar.

| Variável | O que é |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMERO` | WhatsApp do VendeAI: 55 + DDD + número — **a preencher**. Sem ele, o deploy de produção falha de propósito (o botão da Tela C ficaria sem destino). Se vier só DDD + número, o 55 é completado |
| `SHEETS_WEBHOOK_URL` | URL `/exec` do Apps Script (`apps-script/Codigo.gs`) — **a preencher** |
| `NEXT_PUBLIC_CNPJ` | CNPJ do rodapé e da política. **Sem a variável, a página já mostra 24.521.212/0001-82**, o do rodapé do site atual ("Cosmann Promota Ltda"): confirmar CNPJ e razão social com o cliente |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram da Tela A (padrão: @cosmannfinanceira) |
| `NEXT_PUBLIC_SITE_URL` | Endereço final do site (tags de compartilhamento) |
| `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | Opcionais: preenchidos, instalam o GTM / pixel sozinhos (ver "Eventos") |

Depois de cadastrar ou mudar qualquer variável, faça um **Redeploy** na Vercel: as `NEXT_PUBLIC_*` entram no build e a `SHEETS_WEBHOOK_URL` só vale para deploys novos.

## Onde mexer

- **Textos:** `src/content/copy.ts`. As regras do briefing estão no topo do arquivo; nenhum número fora da tabela de informações fixas.
- **Pixel e scripts no cabeçalho:** `src/components/ScriptsCabecalho.tsx` (ou as variáveis acima).
- **Quiz:** `src/components/Quiz.tsx` (lógica e telas) e `Quiz.module.css` (visual).
- **Seções:** `src/components/` (Hero, Beneficios, ComoFunciona, Sobre, Convite, Rodape).
- **Fotos:** `src/assets/`. O Next gera AVIF/WebP no tamanho de cada tela.
- **Contatos da Tela B:** `src/app/api/lead/route.ts`. Valida com as mesmas regras da página e repassa para a planilha.

## Eventos no `window.dataLayer`

`quiz_inicio` · `quiz_resposta` {pergunta, resposta} · `quiz_resultado` {resultado: nao_clt · reaquecimento · apto} · `lead_reaquecimento` {event_id} · `clique_whatsapp` {event_id, tempo_empresa, emprestimo_folha, valor_desejado} · `clique_instagram` · `clique_convite_final`

- **Pixel pela variável** (`NEXT_PUBLIC_META_PIXEL_ID`, sem GTM): a página já manda PageView, **Lead** (Tela B salva) e **Contact** (clique no WhatsApp), com `eventID` para deduplicar; os outros eventos vão como personalizados.
- **GTM** (`NEXT_PUBLIC_GTM_ID`): deixe a variável do pixel vazia e mapeie no GTM: Lead = `lead_reaquecimento`, Contact = `clique_whatsapp`.

Nome e telefone nunca vão para o dataLayer nem para o pixel.
O quiz usa `history.pushState` sem mudar a URL, para o botão voltar do celular voltar uma pergunta. Se usar o gatilho "Alteração no histórico" no GTM, desconsidere esses eventos.

## Planilha (Tela B)

Passo a passo no topo de `apps-script/Codigo.gs`. A coluna E ("Completa 6 meses até") é a data calculada: o último dia do 6º mês depois da entrada, quando a pessoa com certeza já completou o tempo (o formulário pergunta só mês e ano). A coluna F fica verde em "Já pode chamar". As colunas H a L guardam a campanha (UTMs) de onde o contato veio.

## Briefing × site atual (cosmann.com.br)

| Item | Site atual | Landing (segue o briefing) |
|---|---|---|
| Logo e cores | Logo com fundo azul; CSS usa `#015285`/`#035485`, `#fd5e1a` e `#ffe300` | Mesmo logo, vetorizado; `#005081`, `#FF5E1A` e `#F7ED00` do briefing (os mesmos tons) |
| Tempo de mercado | "mais de 15 anos de experiência" | "12 anos no mesmo endereço" (o briefing diz que o correto é 12) |
| "100% online", "menores taxas do mercado", "sem consulta ao SPC/Serasa", "dinheiro na conta em até 24 horas" | Aparecem no site e na fachada ("liberado na hora") | Não aparecem (proibidos pelo briefing) |
| Endereço | Rua Doutor Maruri 576, Sala 02, Centro, CEP… | Rua Doutor Maruri, 576, Centro, Concórdia SC (como o briefing manda) |
| CNPJ | Cosmann Promota Ltda, 24.521.212/0001-82 | Usado como padrão no rodapé; confirmar com o cliente |
| WhatsApp | 49 99942-0089 (topo e formulários do site), 49 99923-6284 (rodapé), 49 98858-4105 (placa da loja), 49 99925-0305 (faixa na vitrine), fixo 49 3444-0400 | A preencher: o número do VendeAI |
| Instagram | @cosmannfinanceira | Mesmo perfil na Tela A |
| Filial Xanxerê, outros produtos (FGTS, INSS, servidor, veículo) | Aparecem | Fora da landing (o produto é só o consignado CLT) |
| Rastreamento | GTM-WD5B5LJ, Google Ads AW-392175680 e pixel da Meta 3277431465838424 instalados | A Lagos decide: reaproveitar esses IDs (públicos contínuos) pelas variáveis ou instalar os dela |
| E-mail | cosmann.adriana@gmail.com aparece no site | Não usado; se o cliente quiser, dá para pôr como canal da LGPD na política |

Vale avisar o cliente: o site atual contradiz os anúncios em pontos que o briefing proíbe (15 anos, 100% online, SPC).

## Fotos

- **Topo:** Pexels, foto de Murat IŞIK (licença Pexels: uso comercial e edição permitidos). O logotipo estampado no colete foi removido.
- **Fachada:** foto da própria loja, do site atual, recortada para tirar os telefones e a faixa "liberado na hora". Uma foto nova em alta resolução deixaria o bloco melhor.
