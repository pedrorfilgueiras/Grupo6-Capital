import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Index from '@/pages/Index';
import DashboardPage from '@/pages/DashboardPage';
import DueDiligencePage from '@/pages/DueDiligencePage';
import DueDiligenceFormPage from '@/pages/DueDiligenceFormPage';
import DataIntegrationPage from '@/pages/DataIntegrationPage';
import NotFound from '@/pages/NotFound';
import { Toaster } from "@/components/ui/toaster"
import { QueryClient } from '@tanstack/react-query';
import InefficientyLogsPage from '@/pages/InefficientyLogsPage';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/due-diligence" element={<DueDiligencePage />} />
            <Route path="/due-diligence/form" element={<DueDiligenceFormPage />} />
            <Route path="/data-integration" element={<DataIntegrationPage />} />
            <Route path="/inefficiency-logs" element={<InefficientyLogsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
