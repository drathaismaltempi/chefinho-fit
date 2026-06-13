import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function TermosPage() {
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
          <h1 className="font-title font-bold text-2xl text-gray-800">Termos de Uso</h1>
          <p className="text-xs text-gray-400 mt-1">Vigência: junho de 2025</p>
        </header>

        <section>
          <p>
            Ao utilizar o <strong>Chefinho Fit</strong>, você concorda com os presentes Termos de Uso.
            Leia com atenção antes de prosseguir.
          </p>
        </section>

        <section aria-labelledby="servico-heading">
          <h2 id="servico-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            1. Descrição do serviço
          </h2>
          <p>
            O Chefinho Fit é um aplicativo web de nutrição infantil gamificada que gera cardápios
            semanais personalizados com inteligência artificial e oferece um modo de aventura com
            elementos educativos sobre alimentação saudável. O serviço é destinado a famílias brasileiras
            com crianças de 1 a 12 anos.
          </p>
        </section>

        <section aria-labelledby="responsavel-heading">
          <h2 id="responsavel-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            2. Uso por responsável legal
          </h2>
          <p>
            O cadastro e o uso do aplicativo devem ser realizados exclusivamente pelo <strong>pai, mãe
            ou responsável legal</strong> da criança. Ao aceitar estes Termos, o responsável declara ter
            capacidade civil plena e autoridade legal para fornecer os dados da criança.
          </p>
        </section>

        <section aria-labelledby="saude-heading">
          <h2 id="saude-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            3. Isenção de responsabilidade médica
          </h2>
          <p>
            As sugestões de cardápio geradas pelo Chefinho Fit têm caráter <strong>exclusivamente
            informativo e educativo</strong>. Elas não constituem prescrição dietética, diagnóstico
            nutricional ou substituição à avaliação de profissional de saúde habilitado (nutricionista,
            pediatra ou nutrólogo).
          </p>
          <p className="mt-2">
            Em caso de condições de saúde específicas, alergias graves ou dúvidas sobre a alimentação da
            criança, consulte sempre um profissional de saúde antes de implementar qualquer mudança na
            dieta.
          </p>
        </section>

        <section aria-labelledby="uso-aceitavel-heading">
          <h2 id="uso-aceitavel-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            4. Uso aceitável
          </h2>
          <p>É proibido utilizar o Chefinho Fit para:</p>
          <ul className="list-disc list-inside flex flex-col gap-1 mt-1">
            <li>Inserir informações falsas, difamatórias ou que violem direitos de terceiros</li>
            <li>Realizar ataques automatizados (bots, scrapers) contra o serviço</li>
            <li>Tentar burlar os mecanismos de segurança ou limites de uso</li>
            <li>Copiar, revender ou redistribuir o conteúdo gerado para fins comerciais</li>
          </ul>
        </section>

        <section aria-labelledby="propriedade-heading">
          <h2 id="propriedade-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            5. Propriedade intelectual
          </h2>
          <p>
            O código-fonte, design, logotipos e demais elementos visuais do Chefinho Fit são propriedade
            de Thaís Maltempi. O conteúdo gerado pela IA (cardápios, receitas, dicas) é fornecido para
            uso pessoal e familiar, não podendo ser reproduzido comercialmente sem autorização.
          </p>
        </section>

        <section aria-labelledby="disponibilidade-heading">
          <h2 id="disponibilidade-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            6. Disponibilidade do serviço
          </h2>
          <p>
            O serviço é fornecido "como está". Não garantimos disponibilidade ininterrupta. Podemos
            suspender, alterar ou encerrar funcionalidades com aviso prévio sempre que possível.
          </p>
        </section>

        <section aria-labelledby="limitacao-heading">
          <h2 id="limitacao-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            7. Limitação de responsabilidade
          </h2>
          <p>
            Na extensão máxima permitida pela lei, o Chefinho Fit não se responsabiliza por danos
            indiretos, incidentais ou consequentes decorrentes do uso ou da incapacidade de uso do
            serviço. Nossa responsabilidade total, em qualquer caso, não excederá o valor pago pelo
            usuário nos últimos 12 meses.
          </p>
        </section>

        <section aria-labelledby="lei-heading">
          <h2 id="lei-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            8. Lei aplicável e foro
          </h2>
          <p>
            Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de
            domicílio do responsável legal para dirimir quaisquer controvérsias, com renúncia a qualquer
            outro, por mais privilegiado que seja.
          </p>
        </section>

        <section aria-labelledby="alteracoes-heading">
          <h2 id="alteracoes-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            9. Alterações nos Termos
          </h2>
          <p>
            Podemos atualizar estes Termos periodicamente. Alterações relevantes serão comunicadas no
            próprio aplicativo. O uso contínuo após a notificação implica concordância com os novos
            termos.
          </p>
        </section>

        <section aria-labelledby="contato-t-heading">
          <h2 id="contato-t-heading" className="font-title font-bold text-base text-gray-800 mb-2">
            10. Contato
          </h2>
          <address className="not-italic">
            <p><strong>Thaís Maltempi</strong></p>
            <p>
              <a
                href="mailto:drathaispreconsulta@gmail.com"
                className="text-coral underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded"
              >
                drathaispreconsulta@gmail.com
              </a>
            </p>
          </address>
        </section>
      </article>
    </div>
  )
}
