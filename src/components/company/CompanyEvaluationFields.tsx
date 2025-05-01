
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CompanyEvaluationFieldsProps {
  nota: string;
  statusAprovacao: string;
  insightsQualitativos: string;
  setNota: (value: string) => void;
  setStatusAprovacao: (value: string) => void;
  setInsightsQualitativos: (value: string) => void;
}

const CompanyEvaluationFields: React.FC<CompanyEvaluationFieldsProps> = ({
  nota,
  statusAprovacao,
  insightsQualitativos,
  setNota,
  setStatusAprovacao,
  setInsightsQualitativos
}) => {
  return (
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
  );
};

export default CompanyEvaluationFields;
