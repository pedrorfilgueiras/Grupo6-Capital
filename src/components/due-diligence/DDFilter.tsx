
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  DueDiligenceFilter, 
  StatusDD, 
  NivelRisco,
  categoriasDueDiligence 
} from '@/services/dueDiligenceTypes';
import { CompanyData } from '@/services/types';
import { getCompanies } from '@/services/companyService';
import { Search, X } from 'lucide-react';

interface DDFilterProps {
  onFilterChange: (filters: DueDiligenceFilter) => void;
}

const DDFilter: React.FC<DDFilterProps> = ({ onFilterChange }) => {
  const [filtros, setFiltros] = useState<DueDiligenceFilter>({});
  const [empresas, setEmpresas] = useState<CompanyData[]>([]);
  const [busca, setBusca] = useState<string>('');
  
  // Carregar lista de empresas
  React.useEffect(() => {
    const carregarEmpresas = async () => {
      const listaEmpresas = await getCompanies();
      setEmpresas(listaEmpresas);
    };
    
    carregarEmpresas();
  }, []);
  
  // Atualizar filtro e propagar mudanças
  const atualizarFiltro = (campo: keyof DueDiligenceFilter, valor: string | undefined) => {
    const novosFiltros = {
      ...filtros,
      [campo]: valor
    };
    
    // Remover campos undefined ou "all" (que significa todos)
    if (valor === undefined || valor === "all") {
      delete novosFiltros[campo];
    }
    
    setFiltros(novosFiltros);
    onFilterChange(novosFiltros);
  };
  
  // Limpar todos os filtros
  const limparFiltros = () => {
    setFiltros({});
    setBusca('');
    onFilterChange({});
  };
  
  // Verificar se há filtros ativos
  const temFiltrosAtivos = Object.keys(filtros).length > 0 || busca.length > 0;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filtros</h3>
        {temFiltrosAtivos && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={limparFiltros}
            className="flex items-center gap-1 text-muted-foreground"
          >
            <X className="h-3 w-3" />
            <span>Limpar filtros</span>
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filtro de busca por texto */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar item..."
            className="pl-8"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        
        {/* Filtro por empresa */}
        <Select
          value={filtros.empresa_id || "all"}
          onValueChange={(value) => atualizarFiltro('empresa_id', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Empresa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Empresas</SelectItem>
            {empresas.map((empresa) => (
              <SelectItem key={empresa.id} value={empresa.id || ''}>
                {empresa.razaoSocial}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Filtro por tipo de DD */}
        <Select
          value={filtros.tipo_dd || "all"}
          onValueChange={(value) => atualizarFiltro('tipo_dd', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tipo de DD" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            {categoriasDueDiligence.map((categoria) => (
              <SelectItem key={categoria} value={categoria}>
                {categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Filtro por status */}
        <Select
          value={filtros.status || "all"}
          onValueChange={(value) => atualizarFiltro('status', value as StatusDD)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Filtro por nível de risco */}
        <Select
          value={filtros.risco || "all"}
          onValueChange={(value) => atualizarFiltro('risco', value as NivelRisco)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Nível de Risco" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Níveis</SelectItem>
            <SelectItem value="baixo">Baixo</SelectItem>
            <SelectItem value="medio">Médio</SelectItem>
            <SelectItem value="alto">Alto</SelectItem>
            <SelectItem value="critico">Crítico</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DDFilter;
