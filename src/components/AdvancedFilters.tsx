
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface AdvancedFiltersProps {
  sectors: string[];
  subsectors: string[];
  filters: {
    searchTerm: string;
    sector: string;
    subsector: string;
    minARR: number;
    minMarginEBITDA: number;
    minGrowth: number;
    minScore: number;
    approvalStatus: string;
    maxValuationMultiple: number;
    riskLevel: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  onReset: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  sectors,
  subsectors,
  filters,
  setFilters,
  onReset
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev: any) => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-g6-blue flex items-center gap-2">
          <Filter className="h-5 w-5" /> Filtros Avançados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Pesquisar por nome, CNPJ ou setor..."
              className="pl-8"
              value={filters.searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* First row - Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sector">Setor</Label>
              <Select
                value={filters.sector}
                onValueChange={(value) => handleFilterChange('sector', value)}
              >
                <SelectTrigger id="sector">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subsector">Subsetor</Label>
              <Select
                value={filters.subsector}
                onValueChange={(value) => handleFilterChange('subsector', value)}
              >
                <SelectTrigger id="subsector">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {subsectors.map((subsector) => (
                    <SelectItem key={subsector} value={subsector}>
                      {subsector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="approvalStatus">Status de Aprovação</Label>
              <Select
                value={filters.approvalStatus}
                onValueChange={(value) => handleFilterChange('approvalStatus', value)}
              >
                <SelectTrigger id="approvalStatus">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                  <SelectItem value="Em Avaliação">Em Avaliação</SelectItem>
                  <SelectItem value="Não Aprovado">Não Aprovado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second row - Numeric filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="minARR">ARR Mínimo (US$)</Label>
                <span className="text-sm text-gray-500">
                  {filters.minARR.toLocaleString('en-US', { 
                    style: 'currency', 
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </span>
              </div>
              <Slider
                id="minARR"
                min={0}
                max={10000000}
                step={100000}
                value={[filters.minARR]}
                onValueChange={(value) => handleFilterChange('minARR', value[0])}
                className="py-4"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="minMarginEBITDA">Margem EBITDA Mínima (%)</Label>
                <span className="text-sm text-gray-500">{filters.minMarginEBITDA}%</span>
              </div>
              <Slider
                id="minMarginEBITDA"
                min={0}
                max={100}
                step={1}
                value={[filters.minMarginEBITDA]}
                onValueChange={(value) => handleFilterChange('minMarginEBITDA', value[0])}
                className="py-4"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="minGrowth">Crescimento de Receita Mínimo (%)</Label>
                <span className="text-sm text-gray-500">{filters.minGrowth}%</span>
              </div>
              <Slider
                id="minGrowth"
                min={0}
                max={200}
                step={5}
                value={[filters.minGrowth]}
                onValueChange={(value) => handleFilterChange('minGrowth', value[0])}
                className="py-4"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="minScore">Nota Mínima (0-10)</Label>
                <span className="text-sm text-gray-500">{filters.minScore}</span>
              </div>
              <Slider
                id="minScore"
                min={0}
                max={10}
                step={0.5}
                value={[filters.minScore]}
                onValueChange={(value) => handleFilterChange('minScore', value[0])}
                className="py-4"
              />
            </div>
          </div>

          {/* Third row - Additional filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="maxValuationMultiple">Múltiplo EV/Receita Máximo</Label>
                <span className="text-sm text-gray-500">{filters.maxValuationMultiple}x</span>
              </div>
              <Slider
                id="maxValuationMultiple"
                min={1}
                max={30}
                step={0.5}
                value={[filters.maxValuationMultiple]}
                onValueChange={(value) => handleFilterChange('maxValuationMultiple', value[0])}
                className="py-4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskLevel">Nível de Risco</Label>
              <Select
                value={filters.riskLevel}
                onValueChange={(value) => handleFilterChange('riskLevel', value)}
              >
                <SelectTrigger id="riskLevel">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Baixo">Baixo</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Alto">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reset button */}
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={onReset}
            >
              <X className="h-4 w-4" /> Limpar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
