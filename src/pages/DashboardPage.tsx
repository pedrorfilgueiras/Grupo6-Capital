
import React from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-g6-bg-light">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-g6-blue">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visualize e gerencie as empresas cadastradas
          </p>
        </div>
        <div className="bg-white rounded-lg shadow">
          <Dashboard />
        </div>
      </main>
      <footer className="bg-g6-blue-dark text-white py-6">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-center">© {new Date().getFullYear()} Grupo6 Capital. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
