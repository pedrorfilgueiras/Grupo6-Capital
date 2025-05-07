
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import { DueDiligenceItem, StatusDD, NivelRisco, categoriasDueDiligence } from '@/services/dueDiligenceTypes';
import { saveDueDiligenceItem, uploadDocumento, getDueDiligenceItems } from '@/services/dueDiligenceService';
import { getCompanyById } from '@/services/companyService';
import { CompanyData } from '@/services/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, AlertTriangle, Info, Upload } from 'lucide-react';

// Schema de validação para o formulário
const formSchema = z.object({
  tipo_dd: z.string().min(1, { message: 'Tipo de DD é obrigatório' }),
  item: z.string().min(3, { message: 'Descrição do item deve ter pelo menos 3 caracteres' }),
  status: z.enum(['pendente', 'em_andamento', 'concluido', 'cancelado'] as const),
  risco: z.enum(['baixo', 'medio', 'alto', 'critico'] as const),
  recomendacao: z.string().optional(),
  empresa_id: z.string().min(1, { message: 'Empresa é obrigatória' }),
});

type FormData = z.infer<typeof formSchema>;

interface DDFormProps {
  ddId?: string; // Para edição de item existente
  empresaId?: string; // Para pré-seleção de empresa
  onSuccess?: () => void;
}

const DDForm: React.FC<DDFormProps> = ({ ddId, empresaId, onSuccess }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [empresa, setEmpresa] = useState<CompanyData | null>(null);
  const [initialData, setInitialData] = useState<DueDiligenceItem | null>(null);
  
  const navigate = useNavigate();
  
  // Configuração do formulário com valores padrão
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo_dd: '',
      item: '',
      status: 'pendente' as StatusDD,
      risco: 'medio' as NivelRisco,
      recomendacao: '',
      empresa_id: empresaId || '',
    },
  });
  
  // Carregar dados da empresa se o ID for fornecido
  useEffect(() => {
    if (empresaId) {
      const loadEmpresa = async () => {
        try {
          const empresaData = await getCompanyById(empresaId);
          if (empresaData) {
            setEmpresa(empresaData);
            form.setValue('empresa_id', empresaId);
          } else {
            toast({
              title: "Erro",
              description: "Empresa não encontrada",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Erro ao carregar dados da empresa:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados da empresa",
            variant: "destructive",
          });
        }
      };
      
      loadEmpresa();
    }
  }, [empresaId, form]);
  
  // Carregar dados do item DD existente (se for edição)
  useEffect(() => {
    if (ddId) {
      const loadDDItem = async () => {
        try {
          const items = await getDueDiligenceItems();
          const item = items.find(i => i.id === ddId);
          
          if (item) {
            setInitialData(item);
            
            // Preencher o formulário com os dados
            form.reset({
              tipo_dd: item.tipo_dd,
              item: item.item,
              status: item.status,
              risco: item.risco,
              recomendacao: item.recomendacao || '',
              empresa_id: item.empresa_id,
            });
            
            // Carregar dados da empresa relacionada
            if (item.empresa_id) {
              const empresaData = await getCompanyById(item.empresa_id);
              if (empresaData) {
                setEmpresa(empresaData);
              }
            }
          } else {
            toast({
              title: "Erro",
              description: "Item de DD não encontrado",
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
        }
      };
      
      loadDDItem();
    }
  }, [ddId, form]);
  
  // Lidar com o envio do formulário
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
      console.log("Enviando dados para salvar:", data);
      
      // Criar o objeto de item DD
      const dueDiligenceItem: DueDiligenceItem = {
        id: ddId, // Será undefined para novos itens
        empresa_id: data.empresa_id,
        tipo_dd: data.tipo_dd,
        item: data.item,
        status: data.status,
        risco: data.risco,
        recomendacao: data.recomendacao || '',
        criado_em: initialData?.criado_em || Date.now(),
        atualizado_em: Date.now()
      };
      
      // Se houver arquivo selecionado, fazer o upload
      if (selectedFile) {
        const itemId = ddId || crypto.randomUUID(); // Usar um UUID temporário para novos itens
        const filePath = await uploadDocumento(selectedFile, data.empresa_id, itemId);
        
        if (filePath) {
          dueDiligenceItem.documento = filePath;
          dueDiligenceItem.documento_nome = selectedFile.name;
        }
      } else if (initialData?.documento) {
        // Manter o documento existente se não houver novo upload
        dueDiligenceItem.documento = initialData.documento;
        dueDiligenceItem.documento_nome = initialData.documento_nome;
      }
      
      console.log("Objeto final a ser salvo:", dueDiligenceItem);
      
      // Salvar o item DD
      const savedItem = await saveDueDiligenceItem(dueDiligenceItem);
      
      console.log("Item salvo com sucesso:", savedItem);
      
      toast({
        title: "Sucesso",
        description: ddId ? "Item de DD atualizado com sucesso!" : "Item de DD cadastrado com sucesso!",
      });
      
      // Executar callback de sucesso ou redirecionar
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/due-diligence');
      }
    } catch (error) {
      console.error("Erro ao salvar item DD:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o item de Due Diligence.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Lidar com seleção de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };
  
  // Restante do componente permanece o mesmo
  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {ddId ? 'Editar' : 'Novo'} Item de Due Diligence
        </h2>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para {ddId ? 'atualizar o' : 'cadastrar um novo'} item de due diligence.
        </p>
        
        {empresa && (
          <Alert className="mt-4 border-l-4 border-primary">
            <Info className="h-4 w-4" />
            <AlertTitle>Empresa Selecionada</AlertTitle>
            <AlertDescription>
              {empresa.razaoSocial} (CNPJ: {empresa.cnpj})
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Campo de tipo de DD */}
          <FormField
            control={form.control}
            name="tipo_dd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Due Diligence</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de DD" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoriasDueDiligence.map(categoria => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecione a categoria de due diligence para este item.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Empresa ID - Campo hidden */}
          <FormField
            control={form.control}
            name="empresa_id"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Descrição do item */}
          <FormField
            control={form.control}
            name="item"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição do Item</FormLabel>
                <FormControl>
                  <Input placeholder="Descreva o item de due diligence" {...field} />
                </FormControl>
                <FormDescription>
                  Uma descrição clara e concisa do item a ser verificado.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  O status atual desta verificação.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Risco */}
          <FormField
            control={form.control}
            name="risco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível de Risco</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível de risco" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="baixo">Baixo</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="alto">Alto</SelectItem>
                    <SelectItem value="critico">Crítico</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  O nível de risco associado a este item.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Recomendação */}
          <FormField
            control={form.control}
            name="recomendacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recomendação</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Digite quaisquer recomendações ou notas importantes" 
                    className="min-h-32" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Recomendações, próximos passos ou informações adicionais relevantes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Upload de documento */}
          <div className="space-y-2">
            <FormLabel>Documento</FormLabel>
            <div className="flex items-center space-x-4">
              <label 
                htmlFor="documento" 
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md cursor-pointer transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Selecionar arquivo</span>
              </label>
              <input 
                id="documento" 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
              />
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  {selectedFile.name}
                </div>
              )}
              {!selectedFile && initialData?.documento_nome && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  <span>{initialData.documento_nome} (atual)</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Anexe um documento relevante para este item (opcional).
            </p>
          </div>
          
          {/* Botões de ação */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/due-diligence')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : ddId ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DDForm;
