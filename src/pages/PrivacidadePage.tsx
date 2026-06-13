import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function PrivacidadePage() {
  const navigate = useNavigate()

  return (
    <div className="px-4 py-4 max-w-lg mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded"
        aria-label="Voltar"
      >
        <ArrowLeft size={16} /> Voltar
      </button>

      <article className="flex flex-col gap-6 font-body text-gray-700 text-sm leading-relaxed">
        <header>
          <h1 className="font-title font-bold text-2xl text-gray-800">Política de Privacidade</h1>
          <p className="text-xs text-gray-400 mt-1">Vigência: junho de 2025</p>
        </header>

        <section aria-labelledby="intro-heading">
          <p>
            O <strong>Chefinho Fit</strong> é um aplicativo de nutrição infantil gamificada desenvolvido por
            Thaís Maltempi, nutróloga responsável pelo serviço. Esta Política descreve como coletamos,
            usamos e protegemos os dados dos usuários, em conformidade com a Lei Geral de Proteção de
            Dados (LGPD — Lei 13.709/2018).
          </p>
        </section>

        <section aria-labelledby="dados-heading">
          <h2 id="dados-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            1. Quais dados coletamos
          </h2>
          <ul className="list-disc list-inside flex flex-col gap-1">
            <li>Nome da criança, idade, sexo, peso e altura</li>
            <li>Informações de saúde: alergias alimentares, intolerâncias e funcionamento intestinal</li>
            <li>Preferências e restrições alimentares</li>
            <li>Ingredientes disponíveis na despensa (texto livre)</li>
            <li>Dados de localização GPS (somente quando o Modo Aventura está ativo e com permissão)</li>
            <li>Pontuação e progresso no jogo (armazenados localmente)</li>
          </ul>
        </section>

        <section aria-labelledby="finalidade-heading">
          <h2 id="finalidade-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            2. Finalidade do tratamento
          </h2>
          <ul className="list-disc list-inside flex flex-col gap-1">
            <li>Geração de cardápio semanal personalizado com inteligência artificial</li>
            <li>Funcionamento do mapa interativo no Modo Aventura (GPS)</li>
            <li>Gamificação: pontos, ranking familiar e recompensas</li>
            <li>Melhoria contínua do serviço (dados não identificados)</li>
          </ul>
        </section>

        <section aria-labelledby="base-legal-heading">
          <h2 id="base-legal-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            3. Base legal
          </h2>
          <p>
            O tratamento é baseado no <strong>consentimento do responsável legal</strong> (Art. 7º, I e
            Art. 14, § 1º da LGPD), dado no momento do cadastro. Dados de saúde são tratados com base no
            Art. 11, II, "f" (tutela da saúde) exclusivamente para fins de personalização nutricional.
          </p>
        </section>

        <section aria-labelledby="armazenamento-heading">
          <h2 id="armazenamento-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            4. Onde os dados são armazenados
          </h2>
          <p>
            Os dados do perfil e do cardápio são armazenados <strong>localmente no dispositivo</strong>{' '}
            (localStorage do navegador). Ao gerar o cardápio, o perfil da criança é enviado de forma
            criptografada (HTTPS) para nosso servidor em nuvem (Vercel, EUA) e processado pela API
            Claude (Anthropic, EUA) apenas para gerar a resposta — nenhum dado é retido por esses
            provedores para fins próprios.
          </p>
        </section>

        <section aria-labelledby="compartilhamento-heading">
          <h2 id="compartilhamento-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            5. Compartilhamento de dados
          </h2>
          <p>
            <strong>Não vendemos nem compartilhamos</strong> dados pessoais com terceiros para fins
            publicitários. Os dados são enviados exclusivamente aos provedores de infraestrutura listados
            acima (Vercel e Anthropic) sob acordos de processamento de dados compatíveis com a LGPD.
          </p>
          <p className="mt-2">
            O aplicativo <strong>não utiliza</strong> Google Analytics, Meta Pixel, cookies de rastreamento
            ou qualquer outra ferramenta de análise comportamental de terceiros.
          </p>
        </section>

        <section aria-labelledby="menores-heading">
          <h2 id="menores-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            6. Proteção de dados de menores (Art. 14 da LGPD)
          </h2>
          <p>
            O Chefinho Fit é destinado a crianças, portanto o cadastro e o consentimento devem ser
            realizados obrigatoriamente pelo <strong>responsável legal</strong> (pai, mãe ou tutor). Não
            coletamos dados de crianças sem consentimento parental explícito.
          </p>
        </section>

        <section aria-labelledby="direitos-heading">
          <h2 id="direitos-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            7. Seus direitos (Art. 18 da LGPD)
          </h2>
          <ul className="list-disc list-inside flex flex-col gap-1">
            <li><strong>Acesso:</strong> solicitar quais dados estão armazenados</li>
            <li><strong>Correção:</strong> atualizar o perfil a qualquer momento no onboarding</li>
            <li><strong>Exclusão:</strong> apagar todos os dados locais em Configurações &gt; Excluir meus dados</li>
            <li><strong>Portabilidade:</strong> exportar os dados mediante solicitação</li>
            <li><strong>Revogação do consentimento:</strong> a qualquer momento, sem prejuízo</li>
          </ul>
          <p className="mt-2">
            Para exercer seus direitos, entre em contato:{' '}
            <a
              href="mailto:drathaispreconsulta@gmail.com"
              className="text-coral underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded"
            >
              drathaispreconsulta@gmail.com
            </a>
          </p>
        </section>

        <section aria-labelledby="retencao-heading">
          <h2 id="retencao-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            8. Retenção dos dados
          </h2>
          <p>
            Os dados ficam armazenados no dispositivo até que o responsável os exclua manualmente ou
            desinstale o aplicativo. Não mantemos cópias dos dados dos usuários em nossos servidores após
            o processamento de cada requisição.
          </p>
        </section>

        <section aria-labelledby="seguranca-heading">
          <h2 id="seguranca-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            9. Segurança
          </h2>
          <p>
            Todas as comunicações entre o aplicativo e nossos servidores utilizam criptografia TLS (HTTPS).
            As chaves de acesso às APIs são mantidas exclusivamente no servidor e nunca expostas ao
            navegador.
          </p>
        </section>

        <section aria-labelledby="contato-heading">
          <h2 id="contato-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            10. Contato e Encarregado (DPO)
          </h2>
          <address className="not-italic">
            <p><strong>Responsável:</strong> Thaís Maltempi</p>
            <p>
              <strong>E-mail:</strong>{' '}
              <a
                href="mailto:drathaispreconsulta@gmail.com"
                className="text-coral underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded"
              >
                drathaispreconsulta@gmail.com
              </a>
            </p>
          </address>
        </section>

        <footer className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-400">
            Esta política pode ser atualizada periodicamente. A data de vigência será sempre indicada no
            topo deste documento. O uso contínuo do aplicativo após alterações implica concordância com a
            versão mais recente.
          </p>
        </footer>
      </article>
    </div>
  )
}
