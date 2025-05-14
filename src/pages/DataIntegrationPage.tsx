
import React from 'react';
import Header from '@/components/Header';
import DataIntegrationPanel from '@/components/DataIntegrationPanel';

const DataIntegrationPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-0">
        <h1 className="text-3xl font-bold text-g6-blue mb-6">Painel de Dados Integrados</h1>
        <DataIntegrationPanel />
      </main>
      <footer className="bg-g6-gray-dark text-white text-center py-4">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Grupo6 Capital. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default DataIntegrationPage;
