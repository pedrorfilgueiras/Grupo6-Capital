
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import { DDForm } from '@/components/due-diligence';
import { DueDiligenceItem } from '@/services/dueDiligenceTypes';
import { getDueDiligenceItems } from '@/services/dueDiligenceService';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const DueDiligenceFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [itemDD, setItemDD] = useState<DueDiligenceItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Carregar dados do item existente para edição
  useEffect(() => {
    const carregarItemDD = async () => {
      if (id) {
        setLoading(true);
        try {
          // Buscar o item específico por ID
          const itens = await getDueDiligenceItems();
          const item = itens.find(item => item.id === id);
          if (item) {
            setItemDD(item);
          }
        } catch (error) {
          console.error("Erro ao carregar item DD:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    carregarItemDD();
  }, [id]);
  
  // Determinar o título da página
  const titulo = id ? 'Editar Item de Due Diligence' : 'Novo Item de Due Diligence';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4 md:px-0">
        <div className="mb-6">
          <Link 
            to="/due-diligence" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Due Diligence</span>
          </Link>
          
          <h1 className="text-3xl font-bold mt-4">{titulo}</h1>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando dados do item...</p>
          </div>
        ) : (
          <DDForm 
            ddId={id} 
            empresaId={itemDD?.empresa_id} 
          />
        )}
      </main>
      
      <footer className="bg-g6-gray-dark text-white text-center py-4">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Grupo6 Capital. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default DueDiligenceFormPage;
