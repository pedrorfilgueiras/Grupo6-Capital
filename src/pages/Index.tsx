
import React, { useState } from 'react';
import Header from '@/components/Header';
import { CompanyForm } from '@/components/company';
import SearchFundInfo from '@/components/SearchFundInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardIcon, InfoIcon, SearchIcon, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("info");
  
  return (
    <div className="min-h-screen flex flex-col bg-g6-bg-light">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-g6-blue to-g6-blue-light text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Grupo6 Capital
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-g6-gray-light">
                Transformando negócios através de investimentos estratégicos
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-g6-accent hover:bg-g6-accent-light text-g6-blue-dark">
                    Dashboard
                  </Button>
                </Link>
                <Link to="/due-diligence">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Due Diligence
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Logo variant="light" size="lg" />
            </div>
          </div>
        </div>
      </section>
      
      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        {/* Banner do Novo Módulo de Due Diligence */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-12 flex flex-col md:flex-row items-center justify-between border-l-4 border-g6-accent">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-g6-blue">Novo Módulo de Due Diligence</h2>
            <p className="text-muted-foreground mt-1">
              Gerencie todo o processo de due diligence das empresas com nosso novo módulo.
            </p>
          </div>
          <Link to="/due-diligence">
            <Button className="w-full md:w-auto flex items-center gap-2">
              <span>Acessar Módulo DD</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        {/* Key Features Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-g6-blue-dark mb-8 text-center">Nossas Ferramentas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-g6-gray-light hover:shadow-lg transition-shadow">
              <div className="bg-g6-blue/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <SearchIcon className="h-6 w-6 text-g6-blue" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-g6-blue-dark">Busca de Informações</h3>
              <p className="text-g6-gray">Acesse dados detalhados sobre empresas e analise oportunidades de investimento.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-g6-gray-light hover:shadow-lg transition-shadow">
              <div className="bg-g6-blue/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <ClipboardIcon className="h-6 w-6 text-g6-blue" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-g6-blue-dark">Cadastro de Empresas</h3>
              <p className="text-g6-gray">Cadastre e gerencie informações detalhadas sobre empresas-alvo.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-g6-gray-light hover:shadow-lg transition-shadow">
              <div className="bg-g6-accent/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <InfoIcon className="h-6 w-6 text-g6-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-g6-blue-dark">Due Diligence</h3>
              <p className="text-g6-gray">Gerencie todo o processo de due diligence de forma eficiente e organizada.</p>
            </div>
          </div>
        </section>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full bg-white rounded-lg shadow-md p-6"
        >
          <TabsList className="w-full max-w-md mx-auto mb-8 grid grid-cols-2">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <InfoIcon className="h-4 w-4" />
              <span>Sobre nós</span>
            </TabsTrigger>
            <TabsTrigger value="form" className="flex items-center gap-2">
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
      
      <footer className="bg-g6-blue-dark text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <Logo variant="light" size="md" className="mb-4" />
              <p className="text-g6-gray-light">
                Conectando investidores a oportunidades de negócios promissoras.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-g6-gray-light hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/dashboard" className="text-g6-gray-light hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/due-diligence" className="text-g6-gray-light hover:text-white transition-colors">Due Diligence</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <p className="text-g6-gray-light mb-2">contato@grupo6capital.com</p>
              <p className="text-g6-gray-light">São Paulo, SP - Brasil</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-g6-gray">
            <p>© {new Date().getFullYear()} Grupo6 Capital. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
