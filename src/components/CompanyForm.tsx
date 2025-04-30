import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, X, Save } from 'lucide-react';
import { validateCNPJ, formatCNPJ, formatCurrency, formatPercentage, parseCurrency, parsePercentage } from '@/utils/validation';
import { CompanyData, QuadroSocietario, saveCompany } from '@/services/storageService';

const CompanyForm = () => {
  const { toast } = useToast();
  
  // Campos existentes
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [faturamentoAnual, setFaturamentoAnual] = useState('');
  const [margem, setMargem] = useState('');
  const [ebitda, setEbitda] = useState('');
  const [qsa, setQsa] = useState<QuadroSocietario[]>([
    { id: 'socio_1', nome: '', documento: '', participacao: 0 }
  ]);
  
  // Novos campos
  const [setor, setSetor] = useState('');
  const [subsetor, setSubsetor] = useState('');
  const [arrFy24, setArrFy24] = useState('');
  const [receitaBrutaFy24, setReceitaBrutaFy24] = useState('');
  const [margemEbitda, setMargemEbitda] = useState('');
  const [crescimentoReceita, setCrescimentoReceita] = useState('');
  const [valuationMultiplo, setValuationMultiplo] = useState('');
  const [riscoOperacional, setRiscoOperacional] = useState('Médio');
  const [insightsQualitativos, setInsightsQualitativos] = useState('');
  const [nota, setNota] = useState('');
  const [statusAprovacao, setStatusAprovacao] = useState('Em Avaliação');
  
  const [cnpjError, setCnpjError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCnpj = formatCNPJ(e.target.value);
    setCnpj(formattedCnpj);
    
    if (cnpjError) setCnpjError('');
  };
  
  const handleCnpjBlur = () => {
    if (cnpj && !validateCNPJ(cnpj)) {
      setCnpjError('CNPJ inválido');
    } else {
      setCnpjError('');
    }
  };
  
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const formattedValue = formatCurrency(e.target.value);
    setter(formattedValue);
  };
  
  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const formattedValue = formatPercentage(e.target.value);
    setter(formattedValue);
  };
  
  const handleAddSocio = () => {
    const newSocio = {
      id: `socio_${Date.now()}`,
      nome: '',
      documento: '',
      participacao: 0
    };
    setQsa([...qsa, newSocio]);
  };
  
  const handleRemoveSocio = (id: string) => {
    if (qsa.length === 1) {
      toast({
        title: "Aviso",
        description: "É necessário ter pelo menos um sócio.",
        variant: "destructive"
      });
      return;
    }
    setQsa(qsa.filter(socio => socio.id !== id));
  };
  
  const handleSocioChange = (id: string, field: keyof QuadroSocietario, value: string | number) => {
    setQsa(prevQsa => 
      prevQsa.map(socio => 
        socio.id === id ? { ...socio, [field]: value } : socio
      )
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCNPJ(cnpj)) {
      setCnpjError('CNPJ inválido');
      toast({
        title: "Erro",
        description: "Por favor, verifique o CNPJ informado.",
        variant: "destructive"
      });
      return;
    }
    
    if (!razaoSocial) {
      toast({
        title: "Erro",
        description: "Razão Social é obrigatória.",
        variant: "destructive"
      });
      return;
    }
    
    const isQsaValid = qsa.every(socio => 
      socio.nome && socio.documento && socio.participacao > 0
    );
    
    if (!isQsaValid) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos do Quadro Societário corretamente.",
        variant: "destructive"
      });
      return;
    }
    
    const companyData: CompanyData = {
      cnpj,
      razaoSocial,
      setor,
      subsetor,
      faturamentoAnual: parseCurrency(faturamentoAnual),
      arrFy24: parseCurrency(arrFy24) || 0,
      receitaBrutaFy24: parseCurrency(receitaBrutaFy24) || 0,
      margem: parsePercentage(margem),
      margemEbitda: parsePercentage(margemEbitda) || parsePercentage(margem) || 0,
      crescimentoReceita: parsePercentage(crescimentoReceita) || 0,
      ebitda: parseCurrency(ebitda),
      valuationMultiplo: parseFloat(valuationMultiplo) || 0,
      riscoOperacional: riscoOperacional || 'Médio',
      insightsQualitativos: insightsQualitativos || '',
      nota: parseFloat(nota || '0'),
      statusAprovacao: statusAprovacao || 'Em Avaliação',
      qsa: qsa.map(socio => ({
        ...socio,
        participacao: typeof socio.participacao === 'string' 
          ? parsePercentage(socio.participacao as string) 
          : socio.participacao
      }))
    };
    
    setIsSubmitting(true);
    
    try {
      await saveCompany(companyData);
      toast({
        title: "Sucesso",
        description: "Dados da empresa salvos com sucesso!",
      });
      
      // Limpar formulário
      setCnpj('');
      setRazaoSocial('');
      setSetor('');
      setSubsetor('');
      setFaturamentoAnual('');
      setArrFy24('');
      setReceitaBrutaFy24('');
      setMargem('');
      setMargemEbitda('');
      setCrescimentoReceita('');
      setEbitda('');
      setValuationMultiplo('');
      setRiscoOperacional('Médio');
      setInsightsQualitativos('');
      setNota('');
      setStatusAprovacao('Em Avaliação');
      setQsa([{ id: 'socio_1', nome: '', documento: '', participacao: 0 }]);
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os dados.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader className="bg-g6-blue text-white rounded-t-lg">
          <CardTitle>Cadastro de Empresa</CardTitle>
          <CardDescription className="text-gray-200">
            Preencha as informações financeiras e cadastrais da empresa
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          {/* Dados Cadastrais */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-g6-blue">Dados Cadastrais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={cnpj}
                  onChange={handleCnpjChange}
                  onBlur={handleCnpjBlur}
                  placeholder="00.000.000/0000-00"
                  className={cnpjError ? "border-red-500" : ""}
                />
                {cnpjError && <p className="text-red-500 text-sm">{cnpjError}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="razaoSocial">Razão Social</Label>
                <Input
                  id="razaoSocial"
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  placeholder="Nome da empresa"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="setor">Setor</Label>
                <Input
                  id="setor"
                  value={setor}
                  onChange={(e) => setSetor(e.target.value)}
                  placeholder="Ex: Tecnologia, Financeiro, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subsetor">Subsetor</Label>
                <Input
                  id="subsetor"
                  value={subsetor}
                  onChange={(e) => setSubsetor(e.target.value)}
                  placeholder="Ex: SaaS, Fintech, etc."
                />
              </div>
            </div>
          </div>
          
          {/* Dados Financeiros */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-g6-blue">Dados Financeiros</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="arrFy24">ARR FY24 (US$)</Label>
                <div className="currency-input">
                  <Input
                    id="arrFy24"
                    value={arrFy24}
                    onChange={(e) => handleCurrencyChange(e, setArrFy24)}
                    placeholder="0,00"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="receitaBrutaFy24">Receita Bruta FY24 (US$)</Label>
                <div className="currency-input">
                  <Input
                    id="receitaBrutaFy24"
                    value={receitaBrutaFy24}
                    onChange={(e) => handleCurrencyChange(e, setReceitaBrutaFy24)}
                    placeholder="0,00"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="faturamentoAnual">Faturamento Anual (R$)</Label>
                <div className="currency-input">
                  <Input
                    id="faturamentoAnual"
                    value={faturamentoAnual}
                    onChange={(e) => handleCurrencyChange(e, setFaturamentoAnual)}
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="margemEbitda">Margem EBITDA (%)</Label>
                <div className="percentage-input">
                  <Input
                    id="margemEbitda"
                    value={margemEbitda}
                    onChange={(e) => handlePercentageChange(e, setMargemEbitda)}
                    placeholder="0,00"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="crescimentoReceita">Crescimento Receita (%)</Label>
                <div className="percentage-input">
                  <Input
                    id="crescimentoReceita"
                    value={crescimentoReceita}
                    onChange={(e) => handlePercentageChange(e, setCrescimentoReceita)}
                    placeholder="0,00"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ebitda">EBITDA (R$)</Label>
                <div className="currency-input">
                  <Input
                    id="ebitda"
                    value={ebitda}
                    onChange={(e) => handleCurrencyChange(e, setEbitda)}
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valuationMultiplo">Valuation (múltiplo EV/Receita)</Label>
                <Input
                  id="valuationMultiplo"
                  type="number"
                  step="0.1"
                  min="0"
                  value={valuationMultiplo}
                  onChange={(e) => setValuationMultiplo(e.target.value)}
                  placeholder="Ex: 5.0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="riscoOperacional">Risco Operacional</Label>
                <Select value={riscoOperacional} onValueChange={setRiscoOperacional}>
                  <SelectTrigger id="riscoOperacional">
                    <SelectValue placeholder="Selecione o nível de risco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baixo">Baixo</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Alto">Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="margem">Margem (%)</Label>
                <div className="percentage-input">
                  <Input
                    id="margem"
                    value={margem}
                    onChange={(e) => handlePercentageChange(e, setMargem)}
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Avaliação */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-g6-blue">Avaliação</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nota">Nota (0-10)</Label>
                <Input
                  id="nota"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  placeholder="Ex: 7.5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="statusAprovacao">Status de Aprovação</Label>
                <Select value={statusAprovacao} onValueChange={setStatusAprovacao}>
                  <SelectTrigger id="statusAprovacao">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aprovado">Aprovado</SelectItem>
                    <SelectItem value="Em Avaliação">Em Avaliação</SelectItem>
                    <SelectItem value="Não Aprovado">Não Aprovado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="insightsQualitativos">Insights Qualitativos</Label>
              <Textarea
                id="insightsQualitativos"
                value={insightsQualitativos}
                onChange={(e) => setInsightsQualitativos(e.target.value)}
                placeholder="Insira observações qualitativas sobre a empresa..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          {/* Quadro Societário */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-g6-blue">Quadro Societário</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAddSocio}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" /> Adicionar Sócio
              </Button>
            </div>
            
            {qsa.map((socio) => (
              <div key={socio.id} className="border p-4 rounded-md relative">
                {qsa.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveSocio(socio.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`nome-${socio.id}`}>Nome</Label>
                    <Input
                      id={`nome-${socio.id}`}
                      value={socio.nome}
                      onChange={(e) => handleSocioChange(socio.id, 'nome', e.target.value)}
                      placeholder="Nome do sócio"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`documento-${socio.id}`}>CPF/CNPJ</Label>
                    <Input
                      id={`documento-${socio.id}`}
                      value={socio.documento}
                      onChange={(e) => handleSocioChange(socio.id, 'documento', e.target.value)}
                      placeholder="Documento do sócio"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`participacao-${socio.id}`}>Participação (%)</Label>
                    <div className="percentage-input">
                      <Input
                        id={`participacao-${socio.id}`}
                        value={typeof socio.participacao === 'number' ? socio.participacao : ''}
                        onChange={(e) => handleSocioChange(
                          socio.id, 
                          'participacao', 
                          parseFloat(e.target.value.replace(',', '.')) || 0
                        )}
                        placeholder="0,00"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-6 flex justify-end">
          <Button 
            type="submit" 
            className="bg-g6-blue hover:bg-g6-blue-light flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Salvar Empresa
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default CompanyForm;
