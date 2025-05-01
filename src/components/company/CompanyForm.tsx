
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from 'lucide-react';
import { CompanyData, QuadroSocietario } from '@/services/types';
import { saveCompany } from '@/services/companyService';
import { validateCNPJ } from '@/utils/validation';
import CompanyCadastralFields from './CompanyCadastralFields';
import CompanyFinancialFields from './CompanyFinancialFields';
import CompanyEvaluationFields from './CompanyEvaluationFields';
import CompanyShareholderFields from './CompanyShareholderFields';

const CompanyForm = () => {
  const { toast } = useToast();
  
  // Cadastral data
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [setor, setSetor] = useState('');
  const [subsetor, setSubsetor] = useState('');
  const [cnpjError, setCnpjError] = useState('');
  
  // Financial data
  const [faturamentoAnual, setFaturamentoAnual] = useState('');
  const [arrFy24, setArrFy24] = useState('');
  const [receitaBrutaFy24, setReceitaBrutaFy24] = useState('');
  const [margem, setMargem] = useState('');
  const [margemEbitda, setMargemEbitda] = useState('');
  const [crescimentoReceita, setCrescimentoReceita] = useState('');
  const [ebitda, setEbitda] = useState('');
  const [valuationMultiplo, setValuationMultiplo] = useState('');
  const [riscoOperacional, setRiscoOperacional] = useState('Médio');
  
  // Evaluation data
  const [insightsQualitativos, setInsightsQualitativos] = useState('');
  const [nota, setNota] = useState('');
  const [statusAprovacao, setStatusAprovacao] = useState('Em Avaliação');
  
  // Shareholders data
  const [qsa, setQsa] = useState<QuadroSocietario[]>([
    { id: 'socio_1', nome: '', documento: '', participacao: 0 }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCnpjBlur = (value: string, error: string) => {
    setCnpj(value);
    setCnpjError(error);
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
      faturamentoAnual: parseFloat(faturamentoAnual.replace(/\./g, '').replace(',', '.')) || 0,
      arrFy24: parseFloat(arrFy24.replace(/\./g, '').replace(',', '.')) || 0,
      receitaBrutaFy24: parseFloat(receitaBrutaFy24.replace(/\./g, '').replace(',', '.')) || 0,
      margem: parseFloat(margem.replace(',', '.')) || 0,
      margemEbitda: parseFloat(margemEbitda.replace(',', '.')) || parseFloat(margem.replace(',', '.')) || 0,
      crescimentoReceita: parseFloat(crescimentoReceita.replace(',', '.')) || 0,
      ebitda: parseFloat(ebitda.replace(/\./g, '').replace(',', '.')) || 0,
      valuationMultiplo: parseFloat(valuationMultiplo) || 0,
      riscoOperacional: riscoOperacional || 'Médio',
      insightsQualitativos: insightsQualitativos || '',
      nota: parseFloat(nota || '0'),
      statusAprovacao: statusAprovacao || 'Em Avaliação',
      qsa
    };
    
    setIsSubmitting(true);
    
    try {
      await saveCompany(companyData);
      toast({
        title: "Sucesso",
        description: "Dados da empresa salvos com sucesso!",
      });
      
      // Reset form
      resetForm();
      
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

  const resetForm = () => {
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
          {/* Cadastral data section */}
          <CompanyCadastralFields 
            cnpj={cnpj} 
            razaoSocial={razaoSocial}
            setor={setor}
            subsetor={subsetor}
            cnpjError={cnpjError}
            setCnpj={setCnpj}
            setRazaoSocial={setRazaoSocial}
            setSetor={setSetor}
            setSubsetor={setSubsetor}
            onCnpjBlur={handleCnpjBlur}
          />
          
          {/* Financial data section */}
          <CompanyFinancialFields
            arrFy24={arrFy24}
            receitaBrutaFy24={receitaBrutaFy24}
            faturamentoAnual={faturamentoAnual}
            margemEbitda={margemEbitda}
            crescimentoReceita={crescimentoReceita}
            ebitda={ebitda}
            valuationMultiplo={valuationMultiplo}
            riscoOperacional={riscoOperacional}
            margem={margem}
            setArrFy24={setArrFy24}
            setReceitaBrutaFy24={setReceitaBrutaFy24}
            setFaturamentoAnual={setFaturamentoAnual}
            setMargemEbitda={setMargemEbitda}
            setCrescimentoReceita={setCrescimentoReceita}
            setEbitda={setEbitda}
            setValuationMultiplo={setValuationMultiplo}
            setRiscoOperacional={setRiscoOperacional}
            setMargem={setMargem}
          />
          
          {/* Evaluation data section */}
          <CompanyEvaluationFields
            nota={nota}
            statusAprovacao={statusAprovacao}
            insightsQualitativos={insightsQualitativos}
            setNota={setNota}
            setStatusAprovacao={setStatusAprovacao}
            setInsightsQualitativos={setInsightsQualitativos}
          />
          
          {/* Shareholders data section */}
          <CompanyShareholderFields
            qsa={qsa}
            setQsa={setQsa}
          />
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
