
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CompanyData, getCompanies } from '@/services/storageService';
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
import { Search, Filter } from 'lucide-react';

const Dashboard = () => {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  
  // Colors for charts
  const COLORS = ['#1a3a5f', '#2d5f8e', '#4682b4', '#6495ed', '#87ceeb'];
  
  useEffect(() => {
    // Load companies when component mounts
    const loadedCompanies = getCompanies();
    setCompanies(loadedCompanies);
    setFilteredCompanies(loadedCompanies);
  }, []);
  
  useEffect(() => {
    // Apply filters whenever filter conditions change
    let results = companies;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(company => 
        company.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.cnpj.includes(searchTerm)
      );
    }
    
    // Apply additional filters
    if (filterBy !== 'all' && filterValue) {
      const value = parseFloat(filterValue);
      
      if (!isNaN(value)) {
        switch(filterBy) {
          case 'faturamentoAnual':
            results = results.filter(company => company.faturamentoAnual >= value);
            break;
          case 'margem':
            results = results.filter(company => company.margem >= value);
            break;
          case 'ebitda':
            results = results.filter(company => company.ebitda >= value);
            break;
          default:
            break;
        }
      }
    }
    
    setFilteredCompanies(results);
  }, [searchTerm, filterBy, filterValue, companies]);
  
  // Prepare data for charts
  const prepareRevenueChartData = () => {
    return filteredCompanies
      .sort((a, b) => b.faturamentoAnual - a.faturamentoAnual)
      .slice(0, 5)
      .map(company => ({
        name: company.razaoSocial.length > 20 
          ? company.razaoSocial.substring(0, 20) + '...' 
          : company.razaoSocial,
        value: company.faturamentoAnual
      }));
  };
  
  const prepareMarginChartData = () => {
    return filteredCompanies
      .map(company => ({
        name: company.razaoSocial.length > 15 
          ? company.razaoSocial.substring(0, 15) + '...' 
          : company.razaoSocial,
        value: company.margem
      }));
  };
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Refine os dados exibidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Pesquisar</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="CNPJ ou Razão Social"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filterBy">Filtrar por</Label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger id="filterBy">
                  <SelectValue placeholder="Selecione um critério" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="faturamentoAnual">Faturamento Anual</SelectItem>
                  <SelectItem value="margem">Margem</SelectItem>
                  <SelectItem value="ebitda">EBITDA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filterValue">Valor Mínimo</Label>
              <Input
                id="filterValue"
                placeholder="Valor mínimo"
                type="number"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                disabled={filterBy === 'all'}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Maiores Faturamentos</CardTitle>
            <CardDescription>Top 5 empresas por faturamento anual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareRevenueChartData()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Faturamento Anual']}
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
            <CardTitle>Distribuição de Margens</CardTitle>
            <CardDescription>Comparativo de margens por empresa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareMarginChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {prepareMarginChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatPercentage(value), 'Margem']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
          <CardDescription>
            Mostrando {filteredCompanies.length} de {companies.length} empresas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-g6-blue text-white">
                <TableRow>
                  <TableHead className="text-white">Razão Social</TableHead>
                  <TableHead className="text-white">CNPJ</TableHead>
                  <TableHead className="text-white text-right">Faturamento</TableHead>
                  <TableHead className="text-white text-right">Margem</TableHead>
                  <TableHead className="text-white text-right">EBITDA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.razaoSocial}</TableCell>
                      <TableCell>{company.cnpj}</TableCell>
                      <TableCell className="text-right">{formatCurrency(company.faturamentoAnual)}</TableCell>
                      <TableCell className="text-right">{formatPercentage(company.margem)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(company.ebitda)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Nenhuma empresa encontrada com os filtros atuais.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
