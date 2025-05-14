
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { FileSpreadsheet, FileText, Database, Wand, FileExport, Settings } from 'lucide-react';
import { CompanyData } from '@/services/types';
import { getCompanies } from '@/services/companyService';
import { useQuery } from '@tanstack/react-query';

const DataIntegrationPanel = () => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'csv' | 'txt'>('csv');
  const [promptTemplate, setPromptTemplate] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  
  // Fetch companies data
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
  });
  
  // Available fields for export
  const availableFields = [
    { id: 'razaoSocial', label: 'Razão Social' },
    { id: 'cnpj', label: 'CNPJ' },
    { id: 'setor', label: 'Setor' },
    { id: 'subsetor', label: 'Subsetor' },
    { id: 'arrFy24', label: 'ARR FY24' },
    { id: 'margemEbitda', label: 'Margem EBITDA' },
    { id: 'crescimentoReceita', label: 'Crescimento Receita' },
    { id: 'nota', label: 'Nota' },
    { id: 'statusAprovacao', label: 'Status Aprovação' },
    { id: 'riscoOperacional', label: 'Risco Operacional' }
  ];
  
  // Toggle field selection
  const toggleFieldSelection = (field: string) => {
    setSelectedFields(prevSelected => 
      prevSelected.includes(field) 
        ? prevSelected.filter(f => f !== field)
        : [...prevSelected, field]
    );
  };
  
  // Generate CSV/TXT export
  const generateExport = () => {
    if (selectedFields.length === 0) {
      toast({
        title: "Nenhum campo selecionado",
        description: "Selecione pelo menos um campo para exportar.",
        variant: "destructive"
      });
      return;
    }
    
    let content = '';
    const delimiter = exportFormat === 'csv' ? ',' : '\t';
    
    // Header row
    content += selectedFields.map(field => {
      const fieldInfo = availableFields.find(f => f.id === field);
      return fieldInfo?.label || field;
    }).join(delimiter) + '\n';
    
    // Data rows
    companies.forEach(company => {
      content += selectedFields.map(field => 
        typeof company[field as keyof CompanyData] === 'undefined' ? '' : String(company[field as keyof CompanyData])
      ).join(delimiter) + '\n';
    });
    
    // Create and download the file
    const blob = new Blob([content], { type: `text/${exportFormat}` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `empresas_export.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exportação concluída",
      description: `Arquivo ${exportFormat.toUpperCase()} gerado com sucesso!`
    });
  };
  
  // Generate prompt based on data
  const generatePrompt = () => {
    if (!promptTemplate) {
      toast({
        title: "Template vazio",
        description: "Preencha o template do prompt para gerar.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Find the company with highest score as an example
      const topCompany = [...companies].sort((a, b) => (b.nota || 0) - (a.nota || 0))[0];
      
      if (!topCompany) {
        toast({
          title: "Sem dados",
          description: "Não há empresas para gerar o prompt.",
          variant: "destructive"
        });
        return;
      }
      
      // Replace placeholders with actual data
      let result = promptTemplate;
      
      // Replace common placeholders
      result = result.replace(/\{empresa\}/g, topCompany.razaoSocial || 'Empresa');
      result = result.replace(/\{setor\}/g, topCompany.setor || 'Setor não especificado');
      result = result.replace(/\{receita\}/g, (topCompany.arrFy24 || 0).toLocaleString('pt-BR'));
      result = result.replace(/\{margem\}/g, `${(topCompany.margemEbitda || 0).toFixed(2)}%`);
      result = result.replace(/\{crescimento\}/g, `${(topCompany.crescimentoReceita || 0).toFixed(2)}%`);
      result = result.replace(/\{avaliacao\}/g, (topCompany.nota || 0).toFixed(1));
      
      setGeneratedPrompt(result);
      
      toast({
        title: "Prompt gerado com sucesso",
        description: "Prompt gerado com base no template fornecido."
      });
      
    } catch (error) {
      console.error("Erro ao gerar prompt:", error);
      toast({
        title: "Erro ao gerar prompt",
        description: "Ocorreu um erro ao processar o template.",
        variant: "destructive"
      });
    }
  };
  
  // Copy prompt to clipboard
  const copyPromptToClipboard = () => {
    if (!generatedPrompt) return;
    
    navigator.clipboard.writeText(generatedPrompt)
      .then(() => {
        toast({
          title: "Copiado!",
          description: "O prompt foi copiado para a área de transferência."
        });
      })
      .catch(err => {
        console.error("Erro ao copiar:", err);
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o texto.",
          variant: "destructive"
        });
      });
  };
  
  // Format for dashboard data
  const formatDataPointValue = (value: any, type: string) => {
    if (value === undefined || value === null) return '-';
    
    switch (type) {
      case 'currency':
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'number':
        return value.toLocaleString('pt-BR');
      default:
        return String(value);
    }
  };
  
  // Calculate summary data
  const summaryData = {
    totalCompanies: companies.length,
    avgScore: companies.length ? companies.reduce((sum, c) => sum + (c.nota || 0), 0) / companies.length : 0,
    avgGrowth: companies.length ? companies.reduce((sum, c) => sum + (c.crescimentoReceita || 0), 0) / companies.length : 0,
    avgMargin: companies.length ? companies.reduce((sum, c) => sum + (c.margemEbitda || 0), 0) / companies.length : 0,
    totalApproved: companies.filter(c => c.statusAprovacao === 'Aprovado').length
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-g6-blue">
          <Database className="h-5 w-5" />
          Painel de Dados Integrados
        </CardTitle>
        <CardDescription>
          Visualize, exporte e gere prompts com base nos dados das empresas cadastradas
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="dashboard">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <FileExport className="h-4 w-4" />
              <span>Exportação</span>
            </TabsTrigger>
            <TabsTrigger value="prompts" className="flex items-center gap-2">
              <Wand className="h-4 w-4" />
              <span>Prompts</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Empresas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-2xl font-bold text-g6-blue">{summaryData.totalCompanies}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Nota Média
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-2xl font-bold text-amber-600">
                    {summaryData.avgScore.toFixed(1)}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Crescimento Médio
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-2xl font-bold text-emerald-600">
                    {summaryData.avgGrowth.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Margem Média
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-2xl font-bold text-purple-600">
                    {summaryData.avgMargin.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Empresas Aprovadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-2xl font-bold text-green-600">{summaryData.totalApproved}</div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-base">Resumo das Empresas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Setor</TableHead>
                      <TableHead className="text-right">ARR (FY24)</TableHead>
                      <TableHead className="text-right">Margem</TableHead>
                      <TableHead className="text-right">Nota</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">Carregando dados...</TableCell>
                      </TableRow>
                    ) : companies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">Nenhuma empresa cadastrada</TableCell>
                      </TableRow>
                    ) : (
                      companies.slice(0, 5).map((company) => (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">{company.razaoSocial}</TableCell>
                          <TableCell>{company.setor || '-'}</TableCell>
                          <TableCell className="text-right">
                            {formatDataPointValue(company.arrFy24, 'currency')}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatDataPointValue(company.margemEbitda, 'percentage')}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {company.nota ? company.nota.toFixed(1) : '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={
                              company.statusAprovacao === 'Aprovado' ? 'bg-green-100 text-green-800' :
                              company.statusAprovacao === 'Não Aprovado' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {company.statusAprovacao || 'Em Avaliação'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              {companies.length > 5 && (
                <CardFooter className="p-3">
                  <div className="text-sm text-muted-foreground">
                    Mostrando 5 de {companies.length} empresas
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          {/* Export Tab */}
          <TabsContent value="export" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Exportação Personalizada</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Selecione os campos e o formato para exportar os dados das empresas.
              </p>
              
              <div className="flex flex-col space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Formato de Exportação</h4>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio"
                        id="format-csv"
                        checked={exportFormat === 'csv'}
                        onChange={() => setExportFormat('csv')}
                        className="h-4 w-4 text-g6-blue"
                      />
                      <div className="flex items-center space-x-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        <label htmlFor="format-csv" className="text-sm">CSV</label>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio"
                        id="format-txt"
                        checked={exportFormat === 'txt'}
                        onChange={() => setExportFormat('txt')}
                        className="h-4 w-4 text-g6-blue"
                      />
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <label htmlFor="format-txt" className="text-sm">TXT</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Campos para Exportação</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {availableFields.map(field => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`field-${field.id}`}
                          checked={selectedFields.includes(field.id)}
                          onCheckedChange={() => toggleFieldSelection(field.id)}
                        />
                        <label 
                          htmlFor={`field-${field.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {field.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={generateExport}
              className="w-full md:w-auto"
              disabled={selectedFields.length === 0}
            >
              <FileExport className="mr-2 h-4 w-4" />
              Exportar Dados
            </Button>
          </TabsContent>
          
          {/* Prompts Tab */}
          <TabsContent value="prompts" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Geração de Prompts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Crie prompts automatizados para relatórios, IA ou decisões usando os dados disponíveis.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Template de Prompt</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Use as variáveis: {"{empresa}"}, {"{setor}"}, {"{receita}"}, {"{margem}"}, {"{crescimento}"}, {"{avaliacao}"}
                  </p>
                  <Textarea 
                    value={promptTemplate}
                    onChange={(e) => setPromptTemplate(e.target.value)}
                    placeholder="Exemplo: Analise a empresa {empresa} do setor {setor} com receita de {receita} e margem de {margem}."
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button 
                  onClick={generatePrompt}
                  className="w-full md:w-auto"
                  disabled={!promptTemplate}
                >
                  <Wand className="mr-2 h-4 w-4" />
                  Gerar Prompt
                </Button>
                
                {generatedPrompt && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Prompt Gerado</h4>
                    <div className="bg-muted p-3 rounded-md relative">
                      <p className="pr-8">{generatedPrompt}</p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={copyPromptToClipboard}
                      >
                        <span className="sr-only">Copiar</span>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.25C11 2.66421 10.6642 3 10.25 3H4.75C4.33579 3 4 2.66421 4 2.25V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Templates Rápidos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => setPromptTemplate("Faça uma análise detalhada da empresa {empresa} que atua no setor {setor}. A empresa possui receita anual de {receita}, margem EBITDA de {margem} e crescimento de {crescimento}. Baseado nesses dados, quais são as principais oportunidades e riscos?")}
                >
                  <Wand className="mr-2 h-4 w-4" />
                  Análise de Oportunidades
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => setPromptTemplate("Com base nos dados da empresa {empresa}, com avaliação {avaliacao}/10, crescimento de {crescimento} e margem de {margem}, elabore um relatório executivo destacando os principais pontos fortes e fracos para potencial aquisição.")}
                >
                  <Wand className="mr-2 h-4 w-4" />
                  Relatório para Aquisição
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => setPromptTemplate("Considerando que a empresa {empresa} do setor {setor} possui margem EBITDA de {margem} e crescimento anual de {crescimento}, liste as 5 principais estratégias para aumentar seu valor de mercado nos próximos 3 anos.")}
                >
                  <Wand className="mr-2 h-4 w-4" />
                  Estratégias de Valorização
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => setPromptTemplate("Compare a performance da empresa {empresa} (receita: {receita}, margem: {margem}, crescimento: {crescimento}) com os benchmarks do setor {setor}. Destaque gaps de performance e oportunidades de melhoria.")}
                >
                  <Wand className="mr-2 h-4 w-4" />
                  Análise Comparativa Setorial
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataIntegrationPanel;
