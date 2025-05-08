
import React, { useState } from 'react';
import Header from '@/components/Header';
import { CompanyForm } from '@/components/company';
import SearchFundInfo from '@/components/SearchFundInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardIcon, InfoIcon, SearchIcon, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("info");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-12 px-4 md:px-0">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-g6-blue-dark mb-4 leading-tight">
              Transformando empresas com potencial em líderes de mercado
            </h1>
            <p className="text-lg text-g6-gray-dark mb-8">
              Um search fund focado em adquirir e desenvolver empresas B2B com alto potencial de crescimento.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Button className="bg-g6-blue hover:bg-g6-blue-light text-white">
                  Ver Dashboard
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link to="/due-diligence">
                <Button variant="outline" className="border-g6-blue text-g6-blue hover:bg-g6-blue hover:text-white">
                  Módulo Due Diligence
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Banner do Novo Módulo de Due Diligence */}
        <div className="bg-gradient-to-r from-g6-blue/10 to-g6-blue/5 border border-g6-blue/20 rounded-lg p-6 mb-12 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-g6-blue">Novo Módulo de Due Diligence</h2>
            <p className="text-g6-gray-dark mt-1">
              Gerencie todo o processo de due diligence das empresas com nosso novo módulo.
            </p>
          </div>
          <Link to="/due-diligence">
            <Button className="bg-g6-blue hover:bg-g6-blue-light w-full md:w-auto">
              Acessar Módulo DD
            </Button>
          </Link>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full max-w-md mx-auto mb-8 bg-g6-gray-light/20">
            <TabsTrigger value="info" className="flex items-center gap-2 w-1/2 data-[state=active]:bg-g6-blue data-[state=active]:text-white">
              <InfoIcon className="h-4 w-4" />
              <span>Sobre nós</span>
            </TabsTrigger>
            <TabsTrigger value="form" className="flex items-center gap-2 w-1/2 data-[state=active]:bg-g6-blue data-[state=active]:text-white">
              <ClipboardIcon className="h-4 w-4" />
              <span>Formulário</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-0 animate-fade-in">
            <SearchFundInfo />
          </TabsContent>
          
          <TabsContent value="form" className="mt-0 animate-fade-in">
            <CompanyForm />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="bg-g6-blue-dark text-white text-center py-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-white rounded-full p-1 mr-2">
                <Building2 className="h-5 w-5 text-g6-blue" />
              </div>
              <span className="font-bold">Grupo6 Capital</span>
            </div>
            <p className="text-sm text-g6-gray-light">© {new Date().getFullYear()} Grupo6 Capital. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
