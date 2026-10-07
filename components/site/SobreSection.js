'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SectionContainer, SectionHeading } from '@/components/site/Section';

export default function SobreSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="border-y border-border bg-card py-20" id="sobre">
      <SectionContainer>
        <SectionHeading eyebrow="Nossa História" title="Sobre a Diaconia" />

        <div
          className={cn(
            'relative overflow-hidden transition-[max-height] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
            expanded ? 'max-h-[3000px]' : 'max-h-[280px]'
          )}
        >
          <div className="text-justify text-[15.5px] leading-[1.8] text-soft [&_p]:mb-[18px] [&_p:last-child]:mb-0">
            <p>O município de Curralinhos, localizado a 80 km de Teresina, foi criado em 1995. O nome &quot;Curralinho&quot; tem origem na cultura popular dos vaqueiros, que conduziam o gado até currais situados onde hoje é o Centro da Cidade. A agricultura familiar e a criação de caprinos, bovinos e suínos constituíam as principais fontes de sustento das famílias nas regiões conhecidas como Forquilha, Caldeirão e Pedra da Onça.</p>

            <p>A partir da década de 1960, a população da área começou a crescer quando Raimundo Cícero Oliveira adquiriu uma grande quantidade de terras e fundou o primeiro comércio, ainda em território do município de Monsenhor Gil. Seu desejo era que ali se formasse a sede de uma cidade.</p>

            <p>Em 1994, iniciou-se o processo de emancipação política. No inventário de Cícero, parte das terras adquiridas foram doadas para a formação dos prédios públicos, como a Prefeitura Municipal e um posto de saúde. Além disso, no documento, estabeleceu que as famílias que moravam em suas terras continuassem e adquirissem a posse completa.</p>

            <p>Com a aprovação do desmembramento territorial de Monsenhor Gil, a cidade de Curralinhos foi oficialmente fundada em 14 de dezembro de 1995, com base na Lei nº 4.819/95. Sua primeira eleição ocorreu em 3 de outubro de 1996.</p>

            <p>Os primeiros moradores da cidade construíram a Capelinha de Nossa Senhora da Divina Providência que foi destruída por um incêndio em meados da década de 1960. As atividades eclesiais eram em grande maioria realizadas por Ministros Ordenados e Consagrados de Monsenhor Gil uma vez ao ano. Não há registros que confirmem a data exata de sua criação e também do incêndio que teria acontecido, segundo moradores mais antigos, por uma vela deixada dentro da capela.</p>

            <p>Somente em 10 de março de 2013, na presença do Arcebispo Dom Jacinto Furtado de Brito Sobrinho, na comunidade da cidade de Curralinhos foi implantada a Diaconia São Raimundo Nonato. Atualmente é coordenada pelo Diácono Raimundo Coelho, inserida na Forania Rural I da Arquidiocese de Teresina e possui 17 comunidades, com diversas pastorais e serviços funcionando em prol da evangelização.</p>

            <p>Em 2020, foram iniciadas obras de reforma e ampliação da Igreja Matriz, localizada no centro de Curralinhos. Durante a pandemia da Covid-19, as atividades religiosas foram suspensas temporariamente, mas a comunidade mobilizou-se e arrecadou recursos financeiros para a obra, que foi concluída após um ano de trabalho.</p>

            <p>Entretanto, em 22 de julho de 2023, o templo sofreu nova destruição. Durante a instalação de placas de forro de gesso, as paredes cederam e o teto desabou. Com a graça divina, o único pedreiro presente percebeu o perigo e conseguiu se abrigar sob a imagem de Cristo no altar, sem sofrer ferimentos. As paredes remanescentes foram posteriormente derrubadas após a avaliação de um engenheiro, que constatou o risco de novos desabamentos.</p>

            <p>Desde então, a comunidade da Diaconia de São Raimundo Nonato tem se dedicado a arrecadar fundos para a construção de um novo templo, que será dividido em quatro fases. A primeira fase, avaliada em R$133.454,08, inclui terraplanagem, contrapiso, calçadas e blocos. A segunda fase, estimada em R$183.469,95, contempla a construção de pilares, vigas, alvenaria e cobertura. A terceira fase, com custos de R$100.711,02, abrange chapisco, reboco, esquadrias, pisos e forro. A última fase, com instalação hidrossanitária e pintura, tem um valor estimado de R$98.169,32. O custo total da construção é de R$515.804,31 (quinhentos e quinze mil, oitocentos e quatro reais e trinta e um centavos).</p>

            <p>As ações pastorais e eclesiais continuam acontecendo utilizando o espaço da Casa Diaconal, localizada ao lado terreno onde será construída a nova igreja, em uma residência alugada e no Centro de Referência de Assistência Social (CRAS) de Curralinhos, onde é celebrada Missas e Celebrações da Palavra, e nos dezesseis templos das comunidades da Diaconia. A matriz se reúne para celebrar a páscoa dominical sempre às 17h da tarde, e às comunidades uma vez por mês de acordo com o calendário litúrgico.</p>

            <p>Durante o primeiro domingo de cada mês, a Pastoral do Batismo realiza formação de pais e padrinhos após a Santa Missa ou Celebração da Palavra. Além disso, turmas de catequese de preparação para a Primeira Eucaristia e o Crisma são formadas anualmente e incluem crianças e jovens da Matriz e comunidades.</p>

            <p>Outras pastorais atuantes são as pastorais do Dízimo e da Família, onde realizam a conscientização dos fiéis para a devolução do dízimo e também de ações de graças, que envolvem arrecadação de alimentos e outros mantimentos para famílias carentes da região.</p>
          </div>

          {!expanded && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-b from-card/0 to-card to-90%"></div>
          )}
        </div>

        <div className="relative z-[2] mt-6 flex justify-center">
          <Button
            variant="outline"
            className="h-auto rounded-full border-[1.5px] border-input bg-secondary px-6 py-2.5 text-sm font-bold text-primary shadow-none hover:border-accent hover:bg-border"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>Ler menos <ChevronUp size={16} /></>
            ) : (
              <>Ler mais <ChevronDown size={16} /></>
            )}
          </Button>
        </div>

      </SectionContainer>
    </section>
  );
}
