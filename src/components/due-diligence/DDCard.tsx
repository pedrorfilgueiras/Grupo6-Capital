
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DueDiligenceItem, riscoColors, statusColors } from '@/services/dueDiligenceTypes';
import { updateStatus, updateRisco, getDocumentoURL } from '@/services/dueDiligenceService';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { FileText, MoreHorizontal, Edit, Trash, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DDCardProps {
  item: DueDiligenceItem;
  empresaNome?: string;
  onDelete?: (id: string) => void;
}

const DDCard: React.FC<DDCardProps> = ({ item, empresaNome, onDelete }) => {
  const navigate = useNavigate();
  
  // Função para abrir o documento
  const handleOpenDocument = async () => {
    if (item.documento) {
      const url = await getDocumentoURL(item.documento);
      if (url) {
        // Se for uma URL simulada, apenas mostrar mensagem
        if (url.startsWith('simulado://')) {
          alert('Visualização de documentos requer conexão com Supabase Storage. Este é um documento simulado.');
          return;
        }
        
        // Abrir o documento em uma nova aba
        window.open(url, '_blank');
      }
    }
  };
  
  // Função para atualizar o status
  const handleStatusChange = async (novoStatus: string) => {
    if (item.id) {
      await updateStatus(
        item.id, 
        novoStatus as 'pendente' | 'em_andamento' | 'concluido' | 'cancelado'
      );
    }
  };
  
  // Função para atualizar o nível de risco
  const handleRiscoChange = async (novoRisco: string) => {
    if (item.id) {
      await updateRisco(
        item.id,
        novoRisco as 'baixo' | 'medio' | 'alto' | 'critico'
      );
    }
  };
  
  // Função para editar o item
  const handleEdit = () => {
    if (item.id) {
      navigate(`/due-diligence/editar/${item.id}`);
    }
  };
  
  // Função para deletar o item
  const handleDelete = () => {
    if (item.id && onDelete) {
      onDelete(item.id);
    }
  };
  
  // Formatar data de atualização
  const dataFormatada = item.atualizado_em 
    ? format(new Date(item.atualizado_em), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR }) 
    : 'Data não disponível';
    
  // Ícone baseado no status
  const StatusIcon = () => {
    switch (item.status) {
      case 'concluido':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pendente':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'em_andamento':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'cancelado':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: riscoColors[item.risco] }} 
              />
              {item.item}
            </CardTitle>
            
            <CardDescription className="mt-1">
              {item.tipo_dd}
              {empresaNome && (
                <>
                  {' • '}
                  <span className="font-medium">{empresaNome}</span>
                </>
              )}
            </CardDescription>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleEdit} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={handleDelete} className="flex items-center gap-2 text-red-500">
                <Trash className="h-4 w-4" />
                <span>Excluir</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => handleStatusChange('pendente')}
                className={cn(
                  "flex items-center gap-2",
                  item.status === 'pendente' && "bg-muted"
                )}
              >
                Pendente
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleStatusChange('em_andamento')}
                className={cn(
                  "flex items-center gap-2",
                  item.status === 'em_andamento' && "bg-muted"
                )}
              >
                Em Andamento
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleStatusChange('concluido')}
                className={cn(
                  "flex items-center gap-2",
                  item.status === 'concluido' && "bg-muted"
                )}
              >
                Concluído
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleStatusChange('cancelado')}
                className={cn(
                  "flex items-center gap-2",
                  item.status === 'cancelado' && "bg-muted"
                )}
              >
                Cancelado
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Nível de Risco</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => handleRiscoChange('baixo')}
                className={cn(
                  "flex items-center gap-2",
                  item.risco === 'baixo' && "bg-muted"
                )}
              >
                Baixo
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleRiscoChange('medio')}
                className={cn(
                  "flex items-center gap-2",
                  item.risco === 'medio' && "bg-muted"
                )}
              >
                Médio
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleRiscoChange('alto')}
                className={cn(
                  "flex items-center gap-2",
                  item.risco === 'alto' && "bg-muted"
                )}
              >
                Alto
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleRiscoChange('critico')}
                className={cn(
                  "flex items-center gap-2",
                  item.risco === 'critico' && "bg-muted"
                )}
              >
                Crítico
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge
            variant="outline"
            className="flex items-center gap-1"
            style={{ 
              backgroundColor: statusColors[item.status],
              borderColor: 'transparent',
            }}
          >
            <StatusIcon />
            <span>
              {item.status === 'pendente' && 'Pendente'}
              {item.status === 'em_andamento' && 'Em Andamento'}
              {item.status === 'concluido' && 'Concluído'}
              {item.status === 'cancelado' && 'Cancelado'}
            </span>
          </Badge>
          
          <Badge
            variant="outline"
            style={{ 
              backgroundColor: riscoColors[item.risco],
              borderColor: 'transparent',
            }}
          >
            Risco: {
              item.risco === 'baixo' ? 'Baixo' :
              item.risco === 'medio' ? 'Médio' :
              item.risco === 'alto' ? 'Alto' :
              'Crítico'
            }
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {item.recomendacao && (
          <div className="text-sm">
            <p className="font-medium mb-1">Recomendação:</p>
            <p className="text-muted-foreground whitespace-pre-wrap">{item.recomendacao}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex items-center justify-between pt-3 border-t">
        <div className="text-xs text-muted-foreground">
          Atualizado em {dataFormatada}
        </div>
        
        {item.documento && (
          <Button 
            variant="outline" 
            onClick={handleOpenDocument}
            size="sm"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            <span>Ver Documento</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DDCard;
