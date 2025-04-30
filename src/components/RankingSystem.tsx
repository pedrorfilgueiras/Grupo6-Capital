
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { CompanyData, getRankedCompanies } from '@/services/storageService';

interface RankingSystemProps {
  companies: CompanyData[];
}

const RankingSystem: React.FC<RankingSystemProps> = ({ companies }) => {
  // Weights for ranking criteria
  const [weights, setWeights] = useState({
    nota: 30,
    margemEbitda: 20,
    crescimentoReceita: 20,
    valuationMultiplo: 15,
    riscoOperacional: 15
  });

  // Ranked companies
  const [rankedCompanies, setRankedCompanies] = useState<CompanyData[]>(
    getRankedCompanies(companies, weights)
  );

  // Handle weight change for a specific criterion
  const handleWeightChange = (criterion: string, value: number) => {
    // Calculate remaining weight
    const totalOtherWeights = Object.entries(weights)
      .filter(([key]) => key !== criterion)
      .reduce((sum, [, value]) => sum + value, 0);

    // Ensure total weights remain at 100%
    if (value + totalOtherWeights !== 100) {
      const diff = 100 - (value + totalOtherWeights);
      
      // Distribute the difference proportionally among other criteria
      const updatedWeights = { ...weights, [criterion]: value };
      
      if (diff !== 0) {
        const otherCriteria = Object.keys(weights).filter(key => key !== criterion);
        const totalOriginalOtherWeights = totalOtherWeights;
        
        otherCriteria.forEach(key => {
          const proportion = totalOriginalOtherWeights === 0 
            ? 1 / otherCriteria.length 
            : weights[key as keyof typeof weights] / totalOriginalOtherWeights;
            
          updatedWeights[key as keyof typeof weights] = Math.round(
            weights[key as keyof typeof weights] + (diff * proportion)
          );
        });
      }
      
      setWeights(updatedWeights);
    } else {
      setWeights({ ...weights, [criterion]: value });
    }
  };

  // Apply ranking with current weights
  const applyRanking = () => {
    const ranked = getRankedCompanies(companies, weights);
    setRankedCompanies(ranked);
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  // Format percentage for display
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  // Get status color based on approval status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Não Aprovado':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-g6-blue">Sistema de Ranqueamento</CardTitle>
        <CardDescription>
          Ajuste os pesos dos critérios para priorizar empresas com base em suas necessidades
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Pesos dos Critérios (Total: 100%)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="weight-nota">Nota de Avaliação</Label>
                <span className="text-sm text-gray-500">{weights.nota}%</span>
              </div>
              <Slider
                id="weight-nota"
                min={0}
                max={100}
                step={5}
                value={[weights.nota]}
                onValueChange={(value) => handleWeightChange('nota', value[0])}
                className="py-3"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="weight-margemEbitda">Margem EBITDA</Label>
                <span className="text-sm text-gray-500">{weights.margemEbitda}%</span>
              </div>
              <Slider
                id="weight-margemEbitda"
                min={0}
                max={100}
                step={5}
                value={[weights.margemEbitda]}
                onValueChange={(value) => handleWeightChange('margemEbitda', value[0])}
                className="py-3"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="weight-crescimentoReceita">Crescimento da Receita</Label>
                <span className="text-sm text-gray-500">{weights.crescimentoReceita}%</span>
              </div>
              <Slider
                id="weight-crescimentoReceita"
                min={0}
                max={100}
                step={5}
                value={[weights.crescimentoReceita]}
                onValueChange={(value) => handleWeightChange('crescimentoReceita', value[0])}
                className="py-3"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="weight-valuationMultiplo">Múltiplo de Valuation</Label>
                <span className="text-sm text-gray-500">{weights.valuationMultiplo}%</span>
              </div>
              <Slider
                id="weight-valuationMultiplo"
                min={0}
                max={100}
                step={5}
                value={[weights.valuationMultiplo]}
                onValueChange={(value) => handleWeightChange('valuationMultiplo', value[0])}
                className="py-3"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="weight-riscoOperacional">Risco Operacional</Label>
                <span className="text-sm text-gray-500">{weights.riscoOperacional}%</span>
              </div>
              <Slider
                id="weight-riscoOperacional"
                min={0}
                max={100}
                step={5}
                value={[weights.riscoOperacional]}
                onValueChange={(value) => handleWeightChange('riscoOperacional', value[0])}
                className="py-3"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={applyRanking} className="bg-g6-blue hover:bg-g6-blue-light">
              Aplicar Critérios de Ranking
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border overflow-hidden mt-6">
          <Table>
            <TableHeader className="bg-g6-blue text-white">
              <TableRow>
                <TableHead className="w-16 text-center text-white">#</TableHead>
                <TableHead className="text-white">Empresa</TableHead>
                <TableHead className="text-white">Setor</TableHead>
                <TableHead className="text-white text-right">Nota</TableHead>
                <TableHead className="text-white text-right">Score Ponderado</TableHead>
                <TableHead className="text-white text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankedCompanies.length > 0 ? (
                rankedCompanies.map((company, index) => (
                  <TableRow key={company.id || index}>
                    <TableCell className="font-bold text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium">{company.razaoSocial}</TableCell>
                    <TableCell>{company.setor || "-"}</TableCell>
                    <TableCell className="text-right">{company.nota?.toFixed(1) || "-"}</TableCell>
                    <TableCell className="text-right font-medium">
                      {(company.weightedScore || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(company.statusAprovacao || 'Em Avaliação')}`}>
                        {company.statusAprovacao || 'Em Avaliação'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhuma empresa encontrada para ranqueamento.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingSystem;
