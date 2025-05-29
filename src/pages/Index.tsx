
import React, { useState } from 'react';
import Header from '@/components/Header';
import { CompanyForm } from '@/components/company';
import SearchFundInfo from '@/components/SearchFundInfo';
import SmartDataTab from '@/components/SmartDataTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardIcon, InfoIcon, SearchIcon, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("info");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-0">
        {/* Banner do Novo Módulo de Due Diligence */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-4 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-primary">Novo Módulo de Due Diligence</h2>
            <p className="text-muted-foreground mt-1">
              Gerencie todo o processo de due diligence das empresas com nosso novo módulo.
            </p>
          </div>
          <Link to="/due-diligence">
            <Button className="w-full md:w-auto">
              Acessar Módulo DD
            </Button>
          </Link>
        </div>
        
        {/* Banner do Log de Ineficiências */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-4 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-amber-800">Novo: Log de Ineficiências (Semana 7)</h2>
            <p className="text-amber-700 mt-1">
              Identifique, categorize e gerencie ineficiências com IA. Inclui histórico de versões e edição manual.
            </p>
          </div>
          <Link to="/inefficiency-logs">
            <Button variant="outline" className="w-full md:w-auto border-amber-600 text-amber-800 hover:bg-amber-100">
              <Edit2 className="h-4 w-4 mr-2" />
              Gerenciar Logs
            </Button>
          </Link>
        </div>
        
        {/* Banner do Novo Painel de Dados */}
        <div className="bg-g6-blue/10 border border-g6-blue/20 rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-g6-blue">Novo: Painel de Dados Integrados</h2>
            <p className="text-muted-foreground mt-1">
              Visualize dados integrados, crie prompts automatizados e exporte dados em vários formatos.
            </p>
          </div>
          <Link to="/data-integration">
            <Button variant="outline" className="w-full md:w-auto border-g6-blue text-g6-blue hover:bg-g6-blue hover:text-white">
              <Database className="h-4 w-4 mr-2" />
              Explorar Dados
            </Button>
          </Link>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <InfoIcon className="h-4 w-4" />
              <span>Sobre nós</span>
            </TabsTrigger>
            <TabsTrigger value="form" className="flex items-center gap-2">
              <ClipboardIcon className="h-4 w-4" />
              <span>Formulário</span>
            </TabsTrigger>
            <TabsTrigger value="smart-data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Dados Inteligentes</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-0">
            <SearchFundInfo />
          </TabsContent>
          
          <TabsContent value="form" className="mt-0">
            <CompanyForm />
          </TabsContent>
          
          <TabsContent value="smart-data" className="mt-0">
            <SmartDataTab />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="bg-g6-gray-dark text-white text-center py-4">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Grupo6 Capital. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
