
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { LoaderCircle, BarChart as BarChartIcon, LineChart, Award } from 'lucide-react';
import AdvancedFilters from './AdvancedFilters';
import RankingSystem from './RankingSystem';
import { CompanyData, getCompanies, getSectorsAndSubsectors } from '@/services/storageService';

const Dashboard = () => {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sectors, setSectors] = useState<string[]>([]);
  const [subsectors, setSubsectors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Filters state
  const [filters, setFilters] = useState({
    searchTerm: '',
    sector: '',
    subsector: '',
    minARR: 0,
    minMarginEBITDA: 0,
    minGrowth: 0,
    minScore: 0,
    approvalStatus: '',
    maxValuationMultiple: 20,
    riskLevel: ''
  });
  
  // Colors for charts
  const COLORS = ['#1a3a5f', '#2d5f8e', '#4682b4', '#6495ed', '#87ceeb'];
  
  useEffect(() => {
    // Load companies when component mounts
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const loadedCompanies = await getCompanies();
        setCompanies(loadedCompanies);
        setFilteredCompanies(loadedCompanies);
        
        // Fetch sectors and subsectors
        const { sectors, subsectors } = await getSectorsAndSubsectors();
        setSectors(sectors);
        setSubsectors(subsectors);
      } catch (error) {
        console.error("Error loading companies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanies();
  }, []);
  
  useEffect(() => {
    // Apply filters whenever filter conditions change
    let results = companies;
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      results = results.filter(company => 
        company.razaoSocial.toLowerCase().includes(searchLower) ||
        company.cnpj.includes(filters.searchTerm) ||
        (company.setor && company.setor.toLowerCase().includes(searchLower)) ||
        (company.subsetor && company.subsetor.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sector filter
    if (filters.sector) {
      results = results.filter(company => 
        company.setor && company.setor === filters.sector
      );
    }
    
    // Apply subsector filter
    if (filters.subsector) {
      results = results.filter(company => 
        company.subsetor && company.subsetor === filters.subsector
      );
    }
    
    // Apply approval status filter
    if (filters.approvalStatus) {
      results = results.filter(company => 
        company.statusAprovacao === filters.approvalStatus
      );
    }
    
    // Apply risk level filter
    if (filters.riskLevel) {
      results = results.filter(company => 
        company.riscoOperacional === filters.riskLevel
      );
    }
    
    // Apply numeric filters
    results = results.filter(company => 
      (company.arrFy24 || 0) >= filters.minARR &&
      (company.margemEbitda || 0) >= filters.minMarginEBITDA &&
      (company.crescimentoReceita || 0) >= filters.minGrowth &&
      (company.nota || 0) >= filters.minScore &&
      (company.valuationMultiplo || 0) <= filters.maxValuationMultiple
    );
    
    setFilteredCompanies(results);
  }, [filters, companies]);
  
  // Reset filters to default values
  const handleResetFilters = () => {
    setFilters({
      searchTerm: '',
      sector: '',
      subsector: '',
      minARR: 0,
      minMarginEBITDA: 0,
      minGrowth: 0,
      minScore: 0,
      approvalStatus: '',
      maxValuationMultiple: 20,
      riskLevel: ''
    });
  };
  
  // Prepare data for charts
  const prepareRevenueChartData = () => {
    return filteredCompanies
      .sort((a, b) => (b.arrFy24 || 0) - (a.arrFy24 || 0))
      .slice(0, 5)
      .map(company => ({
        name: company.razaoSocial.length > 20 
          ? company.razaoSocial.substring(0, 20) + '...' 
          : company.razaoSocial,
        value: company.arrFy24 || 0
      }));
  };
  
  const prepareMarginChartData = () => {
    return filteredCompanies
      .sort((a, b) => (b.margemEbitda || 0) - (a.margemEbitda || 0))
      .slice(0, 5)
      .map(company => ({
        name: company.razaoSocial.length > 15 
          ? company.razaoSocial.substring(0, 15) + '...' 
          : company.razaoSocial,
        value: company.margemEbitda || 0
      }));
  };
  
  const prepareSectorDistributionData = () => {
    const sectorCounts: Record<string, number> = {};
    
    filteredCompanies.forEach(company => {
      const sector = company.setor || 'Não Especificado';
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    });
    
    return Object.entries(sectorCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };
  
  const prepareApprovalStatusData = () => {
    const statusCounts: Record<string, number> = {
      'Aprovado': 0,
      'Em Avaliação': 0,
      'Não Aprovado': 0
    };
    
    filteredCompanies.forEach(company => {
      const status = company.statusAprovacao || 'Em Avaliação';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    return Object.entries(statusCounts)
      .map(([name, value]) => ({ name, value }));
  };
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };
  
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="flex flex-col items-center space-y-4">
          <LoaderCircle className="h-10 w-10 animate-spin text-g6-blue" />
          <p className="text-g6-blue font-medium">Carregando dados...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Advanced Filters */}
      <AdvancedFilters 
        sectors={sectors}
        subsectors={subsectors}
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
      />
      
      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChartIcon className="h-4 w-4" /> Visão Geral
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" /> Empresas
          </TabsTrigger>
          <TabsTrigger value="ranking" className="flex items-center gap-2">
            <Award className="h-4 w-4" /> Ranking
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Empresas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-g6-blue">{filteredCompanies.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Empresas Aprovadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {filteredCompanies.filter(c => c.statusAprovacao === 'Aprovado').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Média de Nota
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {filteredCompanies.length > 0 
                    ? (filteredCompanies.reduce((sum, c) => sum + (c.nota || 0), 0) / filteredCompanies.length).toFixed(1)
                    : '-'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Margem EBITDA Média
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {filteredCompanies.length > 0 
                    ? `${(filteredCompanies.reduce((sum, c) => sum + (c.margemEbitda || 0), 0) / filteredCompanies.length).toFixed(2)}%`
                    : '-'}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Maiores ARRs</CardTitle>
                <CardDescription>Top 5 empresas por ARR (US$)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareRevenueChartData()} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), 'ARR FY24']}
                      />
                      <Bar dataKey="value" fill="#1a3a5f">
                        {prepareRevenueChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Margin Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Maiores Margens EBITDA</CardTitle>
                <CardDescription>Top 5 empresas por margem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareMarginChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, 'Margem EBITDA']} />
                      <Bar dataKey="value" fill="#4682b4">
                        {prepareMarginChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Sector Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Setor</CardTitle>
                <CardDescription>Número de empresas por setor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareSectorDistributionData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {prepareSectorDistributionData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Approval Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Status de Aprovação</CardTitle>
                <CardDescription>Distribuição por status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareApprovalStatusData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#4ade80" /> {/* Aprovado - Green */}
                        <Cell fill="#facc15" /> {/* Em Avaliação - Yellow */}
                        <Cell fill="#f87171" /> {/* Não Aprovado - Red */}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Companies Tab */}
        <TabsContent value="companies">
          {/* Companies Table */}
          <Card>
            <CardHeader>
              <CardTitle>Empresas Cadastradas</CardTitle>
              <CardDescription>
                Mostrando {filteredCompanies.length} de {companies.length} empresas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden overflow-x-auto">
                <Table>
                  <TableHeader className="bg-g6-blue text-white">
                    <TableRow>
                      <TableHead className="text-white">Empresa</TableHead>
                      <TableHead className="text-white">Setor</TableHead>
                      <TableHead className="text-white text-right">ARR FY24</TableHead>
                      <TableHead className="text-white text-right">Margem EBITDA</TableHead>
                      <TableHead className="text-white text-right">Crescimento</TableHead>
                      <TableHead className="text-white text-center">Risco</TableHead>
                      <TableHead className="text-white text-right">Nota</TableHead>
                      <TableHead className="text-white text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.length > 0 ? (
                      filteredCompanies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">{company.razaoSocial}</TableCell>
                          <TableCell>{company.setor || '-'}</TableCell>
                          <TableCell className="text-right">{formatCurrency(company.arrFy24 || 0)}</TableCell>
                          <TableCell className="text-right">{formatPercentage(company.margemEbitda || 0)}</TableCell>
                          <TableCell className="text-right">{formatPercentage(company.crescimentoReceita || 0)}</TableCell>
                          <TableCell className="text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              company.riscoOperacional === 'Alto' ? 'bg-red-100 text-red-800' :
                              company.riscoOperacional === 'Médio' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {company.riscoOperacional || 'Médio'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">{company.nota?.toFixed(1) || '-'}</TableCell>
                          <TableCell className="text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              company.statusAprovacao === 'Aprovado' ? 'bg-green-100 text-green-800' :
                              company.statusAprovacao === 'Não Aprovado' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {company.statusAprovacao || 'Em Avaliação'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          Nenhuma empresa encontrada com os filtros atuais.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Ranking Tab */}
        <TabsContent value="ranking">
          <RankingSystem companies={filteredCompanies} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
