
import React, { useState } from 'react';
import Header from '@/components/Header';
import { CompanyForm } from '@/components/company';
import SearchFundInfo from '@/components/SearchFundInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardIcon, InfoIcon } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("info");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-0">
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
