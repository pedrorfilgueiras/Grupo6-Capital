
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileTextIcon, BriefcaseIcon, TargetIcon, HandshakeIcon, UsersIcon, SearchIcon, RocketIcon, TrendingUpIcon } from 'lucide-react';

const SearchFundInfo = () => {
  return (
    <div className="w-full space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-g6-blue-dark mb-3">Conheça a Grupo6 Capital</h1>
        <div className="w-24 h-1 bg-g6-accent mx-auto"></div>
      </div>
      
      <Tabs defaultValue="sumario" className="w-full">
        <TabsList className="grid grid-cols-2 mb-10 mx-auto max-w-md bg-g6-gray-light/20">
          <TabsTrigger value="sumario" className="flex items-center gap-2 data-[state=active]:bg-g6-blue data-[state=active]:text-white">
            <FileTextIcon className="h-4 w-4" />
            <span>Sumário Executivo</span>
          </TabsTrigger>
          <TabsTrigger value="estrategia" className="flex items-center gap-2 data-[state=active]:bg-g6-blue data-[state=active]:text-white">
            <SearchIcon className="h-4 w-4" />
            <span>Estratégia</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sumario" className="space-y-6 animate-fade-in">
          <Card className="border border-g6-gray-light/30 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="bg-gradient-to-r from-g6-blue/5 to-transparent border-b border-g6-gray-light/20">
              <CardTitle className="flex items-center gap-2 text-g6-blue">
                <BriefcaseIcon className="h-5 w-5 text-g6-accent" />
                Objetivo do Search Fund
              </CardTitle>
            </CardHeader>
            <CardContent className="text-g6-gray-dark pt-6">
              <p className="mb-4">
                Nosso objetivo é conduzir uma busca estruturada e criteriosa por uma empresa do setor B2B que apresente alto potencial de valorização, 
                buscando maximizar o retorno do investimento com gestão ativa e mitigação de riscos operacionais e estratégicos.
              </p>
              <p className="mb-4">
                O processo será orientado para empresas do setor de Saúde e Bem-Estar, que operem com modelo de receita previsível e apresentem 
                fundamentos consistentes.
              </p>
              <p>
                A busca seguirá critérios consolidados no modelo de Search Fund, com foco em empresas que possuam receita recorrente, alta retenção 
                de clientes, churn reduzido, escalabilidade previsível, simplicidade operacional e baixo risco de disrupção tecnológica.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TargetIcon className="h-5 w-5 text-g6-blue" />
                Tese de Investimento e Setor-Alvo
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <p className="mb-4">
                Nossa tese de investimento parte do entendimento de que empresas B2B oferecem o ambiente ideal para a atuação de um Search Fund: 
                combinam previsibilidade de receita, base de clientes sólida e retenção elevada, com a presença frequente de ineficiências 
                operacionais e estratégicas que representam terreno fértil para geração de valor.
              </p>
              <p className="mb-4">
                Durante a Search Phase, o fundo será direcionado à análise aprofundada do setor de Saúde e Bem-Estar que oferece serviços 
                voltados a empresas, como saúde ocupacional, clínicas corporativas ou bem-estar organizacional.
              </p>
              <p>
                Nossa estratégia é identificar esses gargalos e, por meio da expertise dos empreendedores do fundo, implementar melhorias estruturantes 
                de gestão, otimização de processos, expansão geográfica e fortalecimento comercial — com o objetivo de gerar crescimento sustentável 
                e aumento de valor no longo prazo.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HandshakeIcon className="h-5 w-5 text-g6-blue" />
                Proposta de Valor
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <p className="mb-4">
                A proposta de valor do nosso fundo está na capacidade de identificar empresas com fundamentos sólidos que estejam operando aquém 
                do seu potencial e liderar uma transformação estratégica que destrave valor de forma consistente e sustentável.
              </p>
              <p className="mb-4">
                Ao contrário de veículos passivos ou orientados apenas por alavancagem financeira, nosso fundo se baseia em execução real. 
                Atuamos com um modelo de gestão empreendedora, em que os próprios fundadores assumem a operação da empresa adquirida, 
                com dedicação integral e visão de longo prazo.
              </p>
              <p>
                Acreditamos que é justamente nesse tipo de operação — sólida, mas subvalorizada — que reside a oportunidade mais concreta 
                de geração de valor assimétrico para o investidor.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-g6-blue" />
                Perfil dos Investidores Desejados
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <p className="mb-4">
                Buscamos investidores que, além de capital, estejam alinhados com a filosofia de longo prazo, disciplina estratégica e abordagem 
                prática que norteiam o nosso Search Fund.
              </p>
              <p className="mb-4">
                Valorizamos investidores que tenham histórico em Private Equity, Venture Capital, M&A ou gestão operacional — especialmente 
                aqueles com experiência em setores B2B e em empresas com modelo de receita recorrente.
              </p>
              <p>
                Acreditamos que o alinhamento de valores, o entendimento dos riscos envolvidos e o compromisso com a geração de valor sustentável 
                são os principais pilares para a construção de uma relação de confiança, transparente e duradoura com nossos investidores.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="estrategia" className="space-y-6 animate-fade-in">
          <Card className="border border-g6-gray-light/30 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="bg-gradient-to-r from-g6-blue/5 to-transparent border-b border-g6-gray-light/20">
              <CardTitle className="flex items-center gap-2 text-g6-blue">
                <SearchIcon className="h-5 w-5 text-g6-accent" />
                Conceito do Search Fund
              </CardTitle>
            </CardHeader>
            <CardContent className="text-g6-gray-dark pt-6">
              <p className="mb-4">
                Nosso Search Fund é um veículo de investimento estruturado com o objetivo de identificar, adquirir e operar uma empresa B2B 
                no setor de Saúde e Bem-Estar. O fundo será conduzido por empreendedores dedicados integralmente à busca e gestão da empresa-alvo, 
                com apoio de investidores experientes.
              </p>
              <p>
                A criação do fundo se justifica pela existência de uma ampla base de empresas com fundamentos operacionais sólidos — como modelo 
                de receita recorrente, alta retenção de clientes e margens consistentes — mas que enfrentam limitações estruturais, como ausência de 
                sucessão, baixa profissionalização, pouco uso de tecnologia e dificuldade de escalar comercialmente.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RocketIcon className="h-5 w-5 text-g6-blue" />
                Modelo Adotado
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <p className="mb-4">
                Adotamos o modelo Tradicional de Search Fund, no qual é feita uma captação inicial junto a investidores qualificados para 
                financiar a fase de busca e estruturação da aquisição. Após a compra, os empreendedores assumem a gestão da empresa e lideram 
                sua transformação com autonomia e foco no longo prazo.
              </p>
              <p>
                Escolhemos o modelo Tradicional por oferecer o melhor equilíbrio entre autonomia, capital inteligente e suporte de longo prazo 
                — e por estar plenamente alinhado ao nosso perfil de empreendedores e ao tipo de empresa que buscamos adquirir.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5 text-g6-blue" />
                Posicionamento e Diferenciação
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <p className="mb-4">
                Nosso Search Fund se posiciona como um veículo de investimento com atuação estratégica, prática e orientada à transformação operacional. 
                Diferente de fundos tradicionais de Private Equity ou de investidores passivos, propomos uma abordagem em que os próprios 
                empreendedores assumem papéis executivos e lideram a criação de valor dentro da empresa adquirida.
              </p>
              <p className="mb-4">
                A proposta de valor do fundo é única ao combinar três pilares:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Atuação hands-on executiva real, com dedicação exclusiva dos empreendedores à operação;</li>
                <li>Capital paciente e inteligente, proveniente de uma base de investidores experientes;</li>
                <li>Foco setorial estratégico, voltado para empresas B2B do setor de Saúde e Bem-Estar.</li>
              </ul>
              <p>
                Acreditamos que é justamente nesse espaço — entre empresas subexploradas e uma liderança estratégica, focada e presente — 
                que surgem as melhores oportunidades de retorno assimétrico.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchFundInfo;
