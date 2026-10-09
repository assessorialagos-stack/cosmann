import type { Metadata } from 'next';
import Icone from '@/components/Icone';
import Logo from '@/components/Logo';
import Rodape from '@/components/Rodape';
import Seta from '@/components/Seta';
import { config } from '@/config';
import styles from './page.module.css';

const ENDERECO = 'Rua Doutor Maruri, 576, Centro, Concórdia, SC';

export const metadata: Metadata = {
  title: 'Política de privacidade | Cosmann Financeira',
  description:
    'Como a Cosmann Financeira, correspondente bancário em Concórdia SC, cuida dos seus dados pessoais, de acordo com a Lei Geral de Proteção de Dados Pessoais (LGPD).',
  alternates: { canonical: '/politica-de-privacidade' },
  openGraph: {
    title: 'Política de privacidade | Cosmann Financeira',
    description: 'Como a Cosmann Financeira cuida dos seus dados pessoais, de acordo com a LGPD.',
    url: '/politica-de-privacidade',
  },
};

export default function PoliticaDePrivacidade() {
  return (
    <>
      <header className={`${styles.topo} granulado`}>
        <Seta className={styles.forma} variante="suave" />
        <div className={styles.conteudo}>
          <Logo className={styles.logo} />
          <h1 className={styles.titulo}>Política de privacidade</h1>
          <p className={styles.intro}>
            Aqui explicamos, em palavras simples, como a Cosmann Financeira cuida dos seus dados pessoais na página do
            consignado CLT e no atendimento pelo WhatsApp. Esta política segue a Lei Geral de Proteção de Dados Pessoais
            (LGPD).
          </p>
        </div>
      </header>

      <main className={styles.politica}>
        <div className={styles.papel}>
          <a className={styles.voltar} href="/">
            <Icone nome="voltar" />
            Voltar para a página
          </a>

          <section className={styles.resumo}>
                  <h2>Em poucas palavras</h2>
                  <ul>
                    <li>As perguntas não pedem seu nome nem seu telefone, e suas respostas só chegam à Cosmann se você enviar a mensagem no WhatsApp.</li>
                    <li>O formulário de contato só é enviado se você marcar a autorização para a Cosmann falar com você pelo WhatsApp.</li>
                    <li>A página usa cookies e pixels para medir os anúncios. Você pode bloquear isso no seu navegador.</li>
                    <li>A Cosmann não vende seus dados.</li>
                    <li>Você pode pedir para ver, corrigir ou apagar seus dados quando quiser, pelo WhatsApp da Cosmann ou na loja.</li>
                  </ul>
                </section>

                <section>
                  <h2>Quem cuida dos seus dados</h2>
                  <p>
                    A responsável pelos seus dados é a Cosmann Financeira, correspondente bancário, CNPJ <span className={styles.semQuebra}>{config.cnpj}</span>,
                    com loja na {ENDERECO}.
                  </p>
                  <p>Na LGPD, a Cosmann é a controladora dos seus dados: é ela quem decide para que e como eles são usados.</p>
                </section>

                <section>
                  <h2>Quais dados coletamos</h2>
                  <h3>Quando você responde às perguntas</h3>
                  <p>
                    As perguntas não pedem seu nome nem seu telefone. A página só guarda, no seu próprio navegador e enquanto a aba estiver
                    aberta, em que pergunta você parou, para você não perder o caminho se a página recarregar.
                  </p>
                  <p>
                    Se, pelas suas respostas, você já puder simular, a página monta uma mensagem pronta para o WhatsApp com essas respostas.
                    Ela só chega até a Cosmann se você decidir enviar. Antes de enviar, você pode ler e mudar o texto.
                  </p>
                  <p>As ferramentas de medição de anúncios podem registrar em quais respostas você tocou, mas sem o seu nome e sem o seu telefone.</p>

                  <h3>Quando você deixa seu contato</h3>
                  <p>Se você ainda não tem o tempo mínimo na empresa atual, a página oferece um formulário para a Cosmann chamar você depois. Nele, coletamos:</p>
                  <ul>
                    <li>Nome</li>
                    <li>WhatsApp com DDD</li>
                    <li>Mês e ano em que entrou na empresa atual</li>
                    <li>Data e hora do cadastro, registradas automaticamente</li>
                    <li>Sua autorização para a Cosmann falar com você pelo WhatsApp sobre crédito consignado</li>
                    <li>De qual campanha de anúncio você veio, quando o endereço da página trouxer essa informação</li>
                  </ul>
                  <p>
                    Esses dados passam pelo servidor da página e ficam guardados numa planilha do Google, usada pela equipe da Cosmann. Com o
                    mês e o ano de entrada, a planilha calcula quando você completa o tempo mínimo, para a equipe saber quando chamar você.
                  </p>

                  <h3>Quando você fala com a gente no WhatsApp</h3>
                  <p>
                    Recebemos o seu número, as informações do seu perfil no WhatsApp que estiverem visíveis e tudo o que você mandar na conversa,
                    como a mensagem com as suas respostas e os dados que você passar para fazer a simulação ou a contratação.
                  </p>
                  <p>
                    O atendimento começa com um assistente virtual, que é uma inteligência artificial, e depois continua com a equipe da Cosmann.
                    O assistente usa o que você escreve para entender o seu pedido e fazer a simulação.
                  </p>
                  <p>A conversa também segue as regras de privacidade do próprio WhatsApp.</p>

                  <h3>Quando você navega na página</h3>
                  <p>
                    Ferramentas de medição de anúncios coletam informações de navegação, como o tipo de aparelho e de navegador, o endereço IP e
                    de qual anúncio você veio. Explicamos isso melhor na parte <a href="#cookies">Cookies e pixels de anúncios</a>.
                  </p>
                </section>

                <section>
                  <h2>Para que usamos seus dados</h2>
                  <ul>
                    <li>Para chamar você pelo WhatsApp quando você completar o tempo mínimo na empresa atual e conversar sobre crédito consignado, se você autorizou.</li>
                    <li>Para atender você no WhatsApp, fazer a simulação nos bancos parceiros e, se você quiser, seguir com a contratação.</li>
                    <li>Para medir os resultados dos anúncios e melhorar a página e os anúncios da Cosmann.</li>
                    <li>Para cumprir o que a lei e as normas para correspondentes bancários pedem e, se precisar, para a Cosmann se defender na Justiça.</li>
                  </ul>
                  <p>Não usamos seus dados para outras finalidades.</p>
                </section>

                <section>
                  <h2>Por que podemos usar seus dados</h2>
                  <p>A LGPD só permite usar dados pessoais quando existe um motivo previsto na lei, que ela chama de base legal. Estes são os nossos:</p>
                  <ul>
                    <li>
                      <strong>Sua autorização (consentimento).</strong> Para guardar os dados do formulário e para a Cosmann falar com você pelo
                      WhatsApp sobre crédito consignado. A opção de autorização vem desmarcada: você só autoriza se marcar. Se não marcar, o
                      formulário não é enviado e a Cosmann não recebe esses dados, mas você pode falar com a gente pelo WhatsApp ou na loja quando
                      quiser. Você pode retirar a autorização a qualquer momento, de graça.
                    </li>
                    <li>
                      <strong>O seu pedido de simulação ou de contratação.</strong> Quando você chama a Cosmann no WhatsApp para simular ou contratar,
                      usamos seus dados para fazer o que você pediu.
                    </li>
                    <li>
                      <strong>O interesse legítimo da Cosmann.</strong> Para medir os anúncios com cookies e pixels, sempre respeitando seus direitos.
                      Você pode se opor a esse uso e bloquear os cookies, como explicamos mais abaixo.
                    </li>
                    <li>
                      <strong>Obrigações da lei e defesa de direitos.</strong> Para cumprir a lei e as normas para correspondentes bancários e para a
                      Cosmann poder se defender, se precisar. Por isso, guardamos o registro da sua autorização e a data do cadastro, para mostrar
                      que você autorizou o contato.
                    </li>
                  </ul>
                </section>

                <section>
                  <h2>Com quem compartilhamos seus dados</h2>
                  <p>Compartilhamos seus dados só com quem ajuda a Cosmann a atender você, e só o necessário:</p>
                  <ul>
                    <li><strong>Google:</strong> os dados do formulário ficam guardados numa planilha do Google.</li>
                    <li>
                      <strong>Plataformas de anúncio e medição</strong>, como a Meta (Instagram e Facebook) e o Google: recebem as informações de
                      navegação dos cookies e pixels.
                    </li>
                    <li>
                      <strong>Empresas que prestam serviço para a Cosmann</strong>, como quem hospeda a página, quem cuida dos anúncios e quem fornece
                      o assistente virtual do WhatsApp.
                    </li>
                    <li>
                      <strong>Bancos parceiros:</strong> só quando você pede uma simulação ou decide contratar, e só os dados necessários para isso.
                      Cada banco também é responsável pelos dados que recebe e tem a sua própria política de privacidade.
                    </li>
                    <li><strong>Autoridades:</strong> quando a lei obrigar ou a Justiça mandar.</li>
                  </ul>
                  <p>
                    Quem presta serviço para a Cosmann só pode usar seus dados para esse serviço. As plataformas de anúncio também seguem as suas
                    próprias políticas de privacidade.
                  </p>
                  <p className={styles.destaque}>A Cosmann não vende seus dados.</p>
                </section>

                <section>
                  <h2>Dados guardados fora do Brasil</h2>
                  <p>
                    Algumas dessas empresas, como o Google, a Meta e quem hospeda a página, podem guardar ou processar dados fora do Brasil. Quando
                    isso acontece, a transferência segue as regras da LGPD para o envio de dados a outros países.
                  </p>
                </section>

                <section id="cookies">
                  <h2>Cookies e pixels de anúncios</h2>
                  <p>Cookies são pequenos arquivos que o navegador guarda no seu aparelho. Pixels são pequenos códigos das plataformas de anúncio, colocados na página.</p>
                  <p>
                    A Cosmann usa essas ferramentas, como as da Meta e do Google, para saber quantas pessoas chegam pelos anúncios, quantas começam
                    e terminam as perguntas, e para melhorar os anúncios. Elas também podem ser usadas para mostrar anúncios da Cosmann para quem já
                    visitou a página.
                  </p>
                  <p>
                    Essas ferramentas podem registrar o tipo de aparelho e de navegador, o endereço IP, a região aproximada, de qual anúncio você
                    veio e em quais botões tocou, inclusive as respostas que escolheu nas perguntas. A página não envia seu nome nem seu WhatsApp
                    para essas plataformas. Mas, se você usa o Instagram ou o Facebook no mesmo aparelho, a Meta pode ligar essas informações à sua
                    conta, conforme as regras de privacidade dela.
                  </p>
                  <h3>Como bloquear</h3>
                  <ul>
                    <li>
                      Nas configurações do seu navegador, procure por “Privacidade” ou “Cookies”. Lá você pode bloquear ou apagar os cookies e, em
                      muitos navegadores, ligar a proteção contra rastreadores.
                    </li>
                    <li>Numa janela anônima ou privada, os cookies são apagados quando você fecha a janela.</li>
                    <li>No Instagram, no Facebook e na sua conta Google, você também pode ajustar as suas preferências de anúncios nas configurações de cada um.</li>
                  </ul>
                  <p>Bloquear os cookies não impede você de usar a página nem de responder às perguntas.</p>
                </section>

                <section>
                  <h2>Por quanto tempo guardamos seus dados</h2>
                  <p>
                    Guardamos seus dados só pelo tempo necessário para cada finalidade. Os dados do formulário, por exemplo, ficam guardados até a
                    Cosmann chamar você e terminar esse atendimento, ou até você retirar a autorização, o que acontecer primeiro.
                  </p>
                  <p>
                    Depois disso, apagamos os dados ou tiramos deles tudo o que identifica você. Alguns dados podem ficar guardados por mais tempo
                    quando a lei obrigar ou para a Cosmann se defender, se precisar.
                  </p>
                  <p>Os cookies ficam no seu navegador pelo tempo que cada plataforma define, ou até você apagar.</p>
                </section>

                <section>
                  <h2>Seus direitos</h2>
                  <p>Pela LGPD, você tem direito a:</p>
                  <ul>
                    <li>Saber se a Cosmann tem dados seus.</li>
                    <li>Ver quais dados a Cosmann tem sobre você.</li>
                    <li>Corrigir dados errados, incompletos ou desatualizados.</li>
                    <li>Pedir que dados desnecessários, em excesso ou usados fora da lei sejam apagados, bloqueados ou anonimizados (sem nada que identifique você).</li>
                    <li>Levar seus dados para outra empresa (portabilidade), conforme as regras da Autoridade Nacional de Proteção de Dados (ANPD).</li>
                    <li>Apagar os dados usados com a sua autorização, menos os que a lei permite guardar.</li>
                    <li>Saber com quem a Cosmann compartilhou seus dados.</li>
                    <li>Saber que você pode não dar a autorização e o que acontece se não der.</li>
                    <li>Retirar a sua autorização a qualquer momento.</li>
                    <li>Se opor a um uso dos seus dados feito sem a sua autorização, quando ele não seguir a LGPD.</li>
                    <li>Pedir a revisão de uma decisão tomada só de forma automática, por um sistema, quando ela afetar os seus interesses.</li>
                  </ul>
                  <p>Você também pode reclamar na ANPD e nos órgãos de defesa do consumidor.</p>
                </section>

                <section>
                  <h2>Como falar com a Cosmann sobre seus dados</h2>
                  <p>Para usar qualquer um desses direitos, retirar a sua autorização ou tirar dúvidas sobre esta política, fale com a Cosmann:</p>
                  <ul>
                    <li>pelo WhatsApp da Cosmann, o mesmo usado no atendimento da página; ou</li>
                    <li>na loja: {ENDERECO}.</li>
                  </ul>
                  <p>
                    Esses pedidos são gratuitos, e respondemos dentro dos prazos da LGPD. Para proteger você, podemos pedir alguma informação para
                    confirmar que é você mesmo antes de atender o pedido.
                  </p>
                </section>

                <section>
                  <h2>Segurança dos seus dados</h2>
                  <p>
                    Usamos medidas de segurança para proteger seus dados contra acesso sem permissão, perda, alteração ou vazamento. Uma delas é
                    permitir o acesso aos dados só para as pessoas que precisam deles para atender você.
                  </p>
                  <p>
                    Nenhum sistema é livre de riscos. Se acontecer um problema de segurança que possa trazer risco ou dano importante para você, a
                    Cosmann vai avisar você e a ANPD, como a lei manda.
                  </p>
                </section>

                <section>
                  <h2>Mudanças nesta política</h2>
                  <p>Esta política pode mudar para acompanhar a lei ou mudanças no atendimento. A versão que vale é sempre a que está nesta página.</p>
                  <p>Se a mudança afetar algo que você autorizou, a Cosmann vai avisar você antes e, quando a lei pedir, pedir uma nova autorização.</p>
                </section>

          <a className={`${styles.voltar} ${styles.voltarFim}`} href="/">
            <Icone nome="voltar" />
            Voltar para a página
          </a>
        </div>
      </main>

      <Rodape comLinkPolitica={false} />
    </>
  );
}
