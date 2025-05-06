
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getDueDiligenceItems, 
  deleteDueDiligenceItem 
} from '@/services/dueDiligenceService';
import { DueDiligenceItem, DueDiligenceFilter } from '@/services/dueDiligenceTypes';
import { getCompanyById } from '@/services/companyService';
import { CompanyData } from '@/services/types';
import { DDCard, DDFilter } from '@/components/due-diligence';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const DueDiligencePage: React.FC = () => {
  const [itensDD, setItensDD] = useState<DueDiligenceItem[]>([]);
  const [empresasMap, setEmpresasMap] = useState<Record<string, CompanyData>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [filtros, setFiltros] = useState<DueDiligenceFilter>({});
  const [itemParaExcluir, setItemParaExcluir] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  // Carregar itens de DD
  useEffect(() => {
    const carregarItensDD = async () => {
      setLoading(true);
      try {
        const itens = await getDueDiligenceItems(filtros);
        setItensDD(itens);
        
        // Carregar informações das empresas
        const empresasIds = [...new Set(itens.map(item => item.empresa_id))];
        const empresas: Record<string, CompanyData> = {};
        
        for (const id of empresasIds) {
          const empresa = await getCompanyById(id);
          if (empresa) {
            empresas[id] = empresa;
          }
        }
        
        setEmpresasMap(empresas);
      } catch (error) {
        console.error("Erro ao carregar itens DD:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os itens de due diligence.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    carregarItensDD();
  }, [filtros]);
  
  // Atualizar filtros
  const handleFilterChange = (novosFiltros: DueDiligenceFilter) => {
    setFiltros(novosFiltros);
  };
  
  // Confirmar exclusão de item
  const confirmarExclusao = (id: string) => {
    setItemParaExcluir(id);
  };
  
  // Executar exclusão de item
  const excluirItem = async () => {
    if (itemParaExcluir) {
      try {
        const sucesso = await deleteDueDiligenceItem(itemParaExcluir);
        if (sucesso) {
          // Atualizar lista de itens sem recarregar da API
          setItensDD(itens => itens.filter(item => item.id !== itemParaExcluir));
          toast({
            title: "Sucesso",
            description: "Item de due diligence excluído com sucesso.",
          });
        }
      } catch (error) {
        console.error("Erro ao excluir item:", error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o item de due diligence.",
          variant: "destructive",
        });
      } finally {
        setItemParaExcluir(null);
      }
    }
  };
  
  const cancelarExclusao = () => {
    setItemParaExcluir(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4 md:px-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Due Diligence</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie e acompanhe o processo de due diligence das empresas
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/due-diligence/novo')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Item</span>
          </Button>
        </div>
        
        {/* Filtros */}
        <DDFilter onFilterChange={handleFilterChange} />
        
        <div className="mt-6 space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Carregando itens de due diligence...</p>
            </div>
          ) : itensDD.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itensDD.map((item) => (
                <DDCard 
                  key={item.id} 
                  item={item}
                  empresaNome={item.empresa_id && empresasMap[item.empresa_id]?.razaoSocial}
                  onDelete={confirmarExclusao}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Nenhum item encontrado</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Não foram encontrados itens de due diligence com os filtros selecionados.
              </p>
              <Button 
                onClick={() => navigate('/due-diligence/novo')}
                className="mt-6"
                variant="outline"
              >
                Adicionar Item de Due Diligence
              </Button>
            </div>
          )}
        </div>
      </main>
      
      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={itemParaExcluir !== null} onOpenChange={cancelarExclusao}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Item de Due Diligence</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este item de due diligence? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={excluirItem}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <footer className="bg-g6-gray-dark text-white text-center py-4">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Grupo6 Capital. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default DueDiligencePage;
