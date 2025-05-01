
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatPercentage } from '@/utils/validation';

interface CompanyFinancialFieldsProps {
  arrFy24: string;
  receitaBrutaFy24: string;
  faturamentoAnual: string;
  margemEbitda: string;
  crescimentoReceita: string;
  ebitda: string;
  valuationMultiplo: string;
  riscoOperacional: string;
  margem: string;
  setArrFy24: (value: string) => void;
  setReceitaBrutaFy24: (value: string) => void;
  setFaturamentoAnual: (value: string) => void;
  setMargemEbitda: (value: string) => void;
  setCrescimentoReceita: (value: string) => void;
  setEbitda: (value: string) => void;
  setValuationMultiplo: (value: string) => void;
  setRiscoOperacional: (value: string) => void;
  setMargem: (value: string) => void;
}

const CompanyFinancialFields: React.FC<CompanyFinancialFieldsProps> = ({
  arrFy24,
  receitaBrutaFy24,
  faturamentoAnual,
  margemEbitda,
  crescimentoReceita,
  ebitda,
  valuationMultiplo,
  riscoOperacional,
  margem,
  setArrFy24,
  setReceitaBrutaFy24,
  setFaturamentoAnual,
  setMargemEbitda,
  setCrescimentoReceita,
  setEbitda,
  setValuationMultiplo,
  setRiscoOperacional,
  setMargem
}) => {
  
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const formattedValue = formatCurrency(e.target.value);
    setter(formattedValue);
  };
  
  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const formattedValue = formatPercentage(e.target.value);
    setter(formattedValue);
  };
  
  return (
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
  );
};

export default CompanyFinancialFields;
