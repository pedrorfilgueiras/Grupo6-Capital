
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatCNPJ, validateCNPJ } from '@/utils/validation';

interface CompanyCadastralFieldsProps {
  cnpj: string;
  razaoSocial: string;
  setor: string;
  subsetor: string;
  cnpjError: string;
  setCnpj: (value: string) => void;
  setRazaoSocial: (value: string) => void;
  setSetor: (value: string) => void;
  setSubsetor: (value: string) => void;
  onCnpjBlur: (value: string, error: string) => void;
}

const CompanyCadastralFields: React.FC<CompanyCadastralFieldsProps> = ({
  cnpj,
  razaoSocial,
  setor,
  subsetor,
  cnpjError,
  setCnpj,
  setRazaoSocial,
  setSetor,
  setSubsetor,
  onCnpjBlur
}) => {
  
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCnpj = formatCNPJ(e.target.value);
    setCnpj(formattedCnpj);
  };
  
  const handleCnpjBlur = () => {
    let error = '';
    if (cnpj && !validateCNPJ(cnpj)) {
      error = 'CNPJ inválido';
    }
    onCnpjBlur(cnpj, error);
  };
  
  return (
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
  );
};

export default CompanyCadastralFields;
