
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileSpreadsheet, FileText, FileDown, Database, Bot, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const SmartDataTab = () => {
  const [activeTab, setActiveTab] = useState<string>("analysis");
  const [exportFormat, setExportFormat] = useState<'csv' | 'txt'>('csv');
  
  // Financial analysis data
  const financialData = {
    analysisPrompt: `Act as a financial analyst working with search funds and perform a complete comparative financial and operational analysis of the following publicly traded U.S. companies: LFMD (LifeMD), IRMD (iRadimed Corporation), and TALK (Talkspace Inc.).

Use reliable and up-to-date data from 10-K/10-Q filings, investor presentations, Yahoo Finance, Finviz, or Bloomberg to collect and interpret the following metrics for each company:

- ARR FY2024 (in USD)
- Gross Revenue FY2024 (USD)
- Total Annual Revenue (USD)
- EBITDA (USD)
- EBITDA Margin (%)
- Revenue Growth YoY (%)
- Operating Margin (%)
- EV/Revenue multiple
- Operational Risk (qualitative, based on market perception, analyst commentary, or volatility)

Then, perform a qualitative and quantitative ranking of the three companies based on the following criteria:

1. Higher revenue growth and EBITDA margin are preferred.
2. Lower EV/Revenue multiples are prioritized.
3. Lower operational risk enhances attractiveness.
4. Higher ARR and gross revenue serve as secondary factors for tie-breaking.

Deliver the response in **Portuguese**, using **a formal tone**, following **Brazilian academic and business writing conventions (ABNT style)**. The result should be **a comprehensive written analysis (not a table)**, containing:

- A brief contextualization of each company.
- A deep explanation of the financial indicators and performance.
- A final ranking of the companies from 1st to 3rd place, including a detailed justification based on the criteria mentioned.

Avoid bullet points or tables. Write the response as if it were a professional investment memorandum.`,
    
    analysisResponse: `Análise Financeira Comparativa: LifeMD (LFMD), IRadimed Corporation (IRMD) e Talkspace Inc. (TALK)

Contextualização das Empresas
A LifeMD (LFMD) destaca-se como provedora líder de serviços de telemedicina, com foco em cuidados primários virtuais, gestão de peso e saúde masculina. Em 2024, consolidou seu crescimento por meio da expansão de assinaturas e parcerias estratégicas, como a integração com a LillyDirect para acesso a medicamentos GLP-1. A IRadimed Corporation (IRMD), especializada em dispositivos médicos compatíveis com ressonância magnética, mantém operações estáveis com margens brutas elevadas, porém com crescimento moderado. Já a Talkspace Inc. (TALK), plataforma de terapia virtual, expandiu sua atuação em contratos corporativos, embora enfrente pressões competitivas no segmento consumer.

Indicadores Financeiros e Performance
A LifeMD reportou receita total anual de aproximadamente US$213,4 milhões em 2024, com crescimento de 43% no quarto trimestre (baseado em dados trimestrais somados e projeções). Seu EBITDA ajustado atingiu US$9,0 milhões no Q4, refletindo uma margem de 4,24% (considerando anualização parcial). A receita de telemedicina, responsável por 60% do total, impulsionou a eficiência operacional, com margem bruta recorde de 90,6% no Q3 2. A empresa gerou fluxo de caixa operacional positivo de US$17,5 milhões no acumulado do ano, reforçando sua liquidez (US$35 milhões em caixa ao final de 2024).

A IRadimed registrou receita anual de US$73,2 milhões em 2024, com crescimento de 12% em relação a 2023 4. A margem bruta manteve-se estável em 76,9%, sustentada pela demanda por bombas de infusão intravenosa. Contudo, a empresa não divulgou EBITDA explicitamente, e o lucro líquido por ação (EPS) ajustado foi de US$1,66 45. Seu perfil conservador, com 85% das vendas concentradas no mercado doméstico, reduz riscos operacionais, mas limita a escalabilidade.

Para a Talkspace, dados precisos de 2024 não estão disponíveis nas fontes públicas analisadas. Relatórios anteriores indicam receita projetada de US$187,6 milhões e EBITDA de US$7,0 milhões, com crescimento anual de 25%. A margem EBITDA seria de 3,73%, inferior à da LifeMD, e a margem operacional aproximada de 0,61% sugere custos elevados com expansão.

Avaliação de Risco e Múltiplos
O risco operacional da LifeMD é classificado como moderado (B+), devido ao endividamento histórico, mitigado pela geração de caixa recente. A IRadimed apresenta baixo risco, dada sua estabilidade em nichos médicos regulamentados, embora com dependência de poucos produtos. A Talkspace enfrenta risco médio, associado à concorrência em saúde mental digital e volatilidade no segmento consumer. Múltiplos EV/Revenue não foram calculados devido à indisponibilidade de valor de mercado atualizado nas fontes.

Ranking e Justificativa
LifeMD (LFMD): Priorizada devido ao crescimento superior (média de 40% YoY), margens expanding (EBITDA de 4,24%) e trajetória de lucratividade consolidada. A diversificação em programas de saúde e parcerias com fabricantes de medicamentos reforçam sua resiliência.

Talkspace Inc. (TALK): Posicionada em segundo lugar pelo crescimento sólido (25% YoY) e penetração em contratos corporativos, embora com margens operacionais apertadas e exposição a riscos competitivos.

IRadimed Corporation (IRMD): Última colocação devido ao crescimento moderado (12% YoY), ausência de EBITDA reportado e escala reduzida, limitando atratividade para search funds.

Conclusão
A LifeMD destaca-se como a opção mais alinhada aos critérios de search funds, combinando crescimento acelerado, melhoria de rentabilidade e redução de riscos financeiros. A Talkspace, embora em estágio anterior de maturidade, oferece exposição a um mercado em expansão, enquanto a IRadimed serve como contraponto conservador, adequado para perfis de menor apetite a risco. Dados limitados sobre a Talkspace e ausência de métricas precisas de valuation exigem cautela na análise comparativa final.`
  };

  // Strategy simulation data
  const strategySimulation = {
    prompt: `Simule três cenários estratégicos de expansão para uma empresa SaaS B2B no setor de saúde, com ARR atual de R$ 26,4 milhões e margem EBITDA de 18%. Considere:
1. Um cenário orgânico baseado em crescimento por marketing digital e canais de vendas próprios;
2. Um cenário inorgânico via aquisição de concorrente regional com sinergias operacionais;
3. Um cenário híbrido combinando crescimento interno e fusão parcial.

Para cada cenário, apresente:
- Estratégia central
- Premissas de crescimento
- Principais riscos
- Projeção de ARR e margem EBITDA em dois anos
- Recomendação final da IA com base nos dados fornecidos`,

    response: `**Análise de Expansão – IA GPT-4o**

**🟦 Cenário Orgânico:** Crescimento por canais próprios, SEO, CRM e inside sales. Premissas: +20% em marketing, churn 5%, crescimento linear de 30% a.a. Resultado: ARR R$ 34M em 2 anos, margem EBITDA 22%.

**🟥 Cenário Inorgânico:** Aquisição com múltiplo EV/Receita de 1,4x, sinergia de 12%, integração em 9 meses. ARR salta para R$ 50M no ano 1, mas margem EBITDA cai para 12% no início.

**🟨 Cenário Híbrido:** Expansão orgânica no ano 1 + aquisição de carteira no ano 2. NRR 135%, ARR R$ 42M, margem EBITDA estável em 21%.

**✅ Recomendação da IA:** Priorizar cenário híbrido por balancear escalabilidade e eficiência operacional com menor risco de integração.`
  };
  
  // Companies data in CSV format
  const companiesDataCSV = `Company,Revenue (MM USD),Growth (%),EBITDA Margin (%),Risk Level
LifeMD (LFMD),213.4,43,4.24,Moderado
IRadimed (IRMD),73.2,12,N/A,Baixo
Talkspace (TALK),187.6,25,3.73,Médio`;
  
  // Function to export data
  const handleExport = (type: 'prompt' | 'analysis' | 'data' | 'strategy-prompt' | 'strategy-response') => {
    let content = '';
    let filename = '';
    
    if (type === 'prompt') {
      content = financialData.analysisPrompt;
      filename = `prompt-analise-financeira.${exportFormat}`;
    } else if (type === 'analysis') {
      content = financialData.analysisResponse;
      filename = `analise-financeira-comparativa.${exportFormat}`;
    } else if (type === 'data') {
      content = companiesDataCSV;
      filename = `dados-empresas.${exportFormat}`;
    } else if (type === 'strategy-prompt') {
      content = strategySimulation.prompt;
      filename = `prompt-simulacao-estrategia.${exportFormat}`;
    } else if (type === 'strategy-response') {
      content = strategySimulation.response;
      filename = `simulacao-estrategia-response.${exportFormat}`;
    }
    
    const blob = new Blob([content], { type: `text/${exportFormat}` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download concluído",
      description: `Arquivo ${filename} gerado com sucesso!`
    });
  };

  const handleRegenerateStrategy = () => {
    toast({
      title: "Regenerando análise...",
      description: "Simulando nova análise estratégica com IA (funcionalidade em desenvolvimento)"
    });
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-g6-blue">
          <Database className="h-5 w-5" />
          Dados Inteligentes para Análise
        </CardTitle>
        <CardDescription>
          Análise financeira comparativa e simulação estratégica com IA
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid w-full grid-cols-4">
            <TabsTrigger value="analysis">
              Análise Financeira
            </TabsTrigger>
            <TabsTrigger value="prompt">
              Prompt Utilizado
            </TabsTrigger>
            <TabsTrigger value="data">
              Dados Resumidos
            </TabsTrigger>
            <TabsTrigger value="strategy">
              <Bot className="h-4 w-4 mr-1" />
              Simulação com IA
            </TabsTrigger>
          </TabsList>
          
          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Análise Financeira Comparativa</h3>
              
              <div className="prose max-w-none">
                {financialData.analysisResponse.split('\n\n').map((paragraph, index) => (
                  <p key={index} className={index === 0 ? "text-xl font-semibold" : ""}>{paragraph}</p>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Formato de Exportação:</span>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio"
                      id="format-csv-analysis"
                      checked={exportFormat === 'csv'}
                      onChange={() => setExportFormat('csv')}
                      className="h-4 w-4 text-g6-blue"
                    />
                    <div className="flex items-center space-x-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <label htmlFor="format-csv-analysis" className="text-sm">CSV</label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio"
                      id="format-txt-analysis"
                      checked={exportFormat === 'txt'}
                      onChange={() => setExportFormat('txt')}
                      className="h-4 w-4 text-g6-blue"
                    />
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <label htmlFor="format-txt-analysis" className="text-sm">TXT</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => handleExport('analysis')}
                className="ml-auto"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Baixar Análise
              </Button>
            </div>
          </TabsContent>
          
          {/* Prompt Tab */}
          <TabsContent value="prompt" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Prompt Utilizado para IA (Perplexity)</h3>
              
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap bg-slate-100 p-4 rounded-md text-sm">
                  {financialData.analysisPrompt}
                </pre>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Formato de Exportação:</span>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio"
                      id="format-csv-prompt"
                      checked={exportFormat === 'csv'}
                      onChange={() => setExportFormat('csv')}
                      className="h-4 w-4 text-g6-blue"
                    />
                    <div className="flex items-center space-x-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <label htmlFor="format-csv-prompt" className="text-sm">CSV</label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio"
                      id="format-txt-prompt"
                      checked={exportFormat === 'txt'}
                      onChange={() => setExportFormat('txt')}
                      className="h-4 w-4 text-g6-blue"
                    />
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <label htmlFor="format-txt-prompt" className="text-sm">TXT</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => handleExport('prompt')}
                className="ml-auto"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Baixar Prompt
              </Button>
            </div>
          </TabsContent>
          
          {/* Data Tab */}
          <TabsContent value="data" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Dados Financeiros Resumidos</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border">
                  <thead className="bg-g6-blue text-white">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Empresa
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Receita (MM USD)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Crescimento (%)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Margem EBITDA (%)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Nível de Risco
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        LifeMD (LFMD)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        213,4
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        43
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        4,24
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Moderado
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        IRadimed (IRMD)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        73,2
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        12
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        N/A
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Baixo
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        Talkspace (TALK)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        187,6
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        25
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        3,73
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Médio
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Formato de Exportação:</span>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio"
                      id="format-csv-data"
                      checked={exportFormat === 'csv'}
                      onChange={() => setExportFormat('csv')}
                      className="h-4 w-4 text-g6-blue"
                    />
                    <div className="flex items-center space-x-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <label htmlFor="format-csv-data" className="text-sm">CSV</label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio"
                      id="format-txt-data"
                      checked={exportFormat === 'txt'}
                      onChange={() => setExportFormat('txt')}
                      className="h-4 w-4 text-g6-blue"
                    />
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <label htmlFor="format-txt-data" className="text-sm">TXT</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => handleExport('data')}
                className="ml-auto"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Baixar Dados
              </Button>
            </div>
          </TabsContent>

          {/* Strategy Simulation Tab */}
          <TabsContent value="strategy" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Simulação de Estratégia com IA
              </h3>
              
              <div className="space-y-4">
                {/* Prompt Section */}
                <div className="bg-slate-100 p-4 rounded-md">
                  <h4 className="font-medium mb-2">🧠 Prompt simulado para o app:</h4>
                  <pre className="whitespace-pre-wrap text-sm">
                    {strategySimulation.prompt}
                  </pre>
                </div>

                {/* AI Response Section */}
                <div className="bg-gray-50 border-l-4 border-g6-blue p-4 rounded-md">
                  <h4 className="font-medium mb-3">✅ Resposta simulada (exibida no app, como se viesse do ChatGPT):</h4>
                  <div className="prose max-w-none">
                    {strategySimulation.response.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-2 text-sm leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Regenerate Button */}
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={handleRegenerateStrategy}
                    variant="outline"
                    className="border-g6-blue text-g6-blue hover:bg-g6-blue hover:text-white"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regerar Análise com IA
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Formato de Exportação:</span>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio"
                      id="format-csv-strategy"
                      checked={exportFormat === 'csv'}
                      onChange={() => setExportFormat('csv')}
                      className="h-4 w-4 text-g6-blue"
                    />
                    <div className="flex items-center space-x-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <label htmlFor="format-csv-strategy" className="text-sm">CSV</label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio"
                      id="format-txt-strategy"
                      checked={exportFormat === 'txt'}
                      onChange={() => setExportFormat('txt')}
                      className="h-4 w-4 text-g6-blue"
                    />
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <label htmlFor="format-txt-strategy" className="text-sm">TXT</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-auto">
                <Button 
                  onClick={() => handleExport('strategy-prompt')}
                  variant="outline"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Baixar Prompt
                </Button>
                <Button 
                  onClick={() => handleExport('strategy-response')}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Baixar Resposta
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SmartDataTab;
