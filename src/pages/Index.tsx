
import React, { useState } from 'react';
import Header from '@/components/Header';
import { CompanyForm } from '@/components/company';
import SearchFundInfo from '@/components/SearchFundInfo';
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
            <TabsTrigger value="info" className="flex items-center gap-2 w-1/2">
              <InfoIcon className="h-4 w-4" />
              <span>Sobre nós</span>
            </TabsTrigger>
            <TabsTrigger value="form" className="flex items-center gap-2 w-1/2">
              <ClipboardIcon className="h-4 w-4" />
              <span>Formulário</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-0">
            <SearchFundInfo />
          </TabsContent>
          
          <TabsContent value="form" className="mt-0">
            <CompanyForm />
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
