
import React from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import { Building2 } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-g6-blue-dark">Dashboard</h1>
          <p className="text-g6-gray">Visualize e gerencie as informações das empresas cadastradas</p>
        </div>
        <Dashboard />
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

export default DashboardPage;
