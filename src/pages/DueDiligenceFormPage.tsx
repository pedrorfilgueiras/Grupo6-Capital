
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import { DDForm } from '@/components/due-diligence';
import { DueDiligenceItem } from '@/services/dueDiligenceTypes';
import { getDueDiligenceItems } from '@/services/dueDiligenceService';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const DueDiligenceFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const empresaId = searchParams.get('empresa_id') || undefined;
  
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
            console.log("Item DD carregado:", item);
          } else {
            console.error("Item DD não encontrado com o ID:", id);
            toast({
              title: "Erro",
              description: "Item de Due Diligence não encontrado",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Erro ao carregar item DD:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados do item",
            variant: "destructive",
          });
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
            empresaId={itemDD?.empresa_id || empresaId}
            onSuccess={() => {
              console.log("Operação concluída com sucesso");
            }}
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
