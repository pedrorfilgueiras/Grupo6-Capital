
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from 'lucide-react';
import { QuadroSocietario } from '@/services/types';
import { useToast } from "@/components/ui/use-toast";

interface CompanyShareholderFieldsProps {
  qsa: QuadroSocietario[];
  setQsa: React.Dispatch<React.SetStateAction<QuadroSocietario[]>>;
}

const CompanyShareholderFields: React.FC<CompanyShareholderFieldsProps> = ({
  qsa,
  setQsa
}) => {
  const { toast } = useToast();
  
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
  
  return (
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
  );
};

export default CompanyShareholderFields;
