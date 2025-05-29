
import React from 'react';
import Header from '@/components/Header';
import { InefficientyLogManager } from '@/components/inefficiency';

const InefficientyLogsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-0">
        <InefficientyLogManager />
      </main>
    </div>
  );
};

export default InefficientyLogsPage;
