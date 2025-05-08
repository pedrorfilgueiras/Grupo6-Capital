
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { DueDiligenceItem } from '@/services/dueDiligenceTypes';
import { saveDueDiligenceItem, getDueDiligenceItems } from '@/services/dueDiligenceService';
import { getCompanyById } from '@/services/companyService';
import { CompanyData } from '@/services/types';
import { Button } from '@/components/ui/button';
import {
  Form,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { formSchema, FormData, DDFormProps } from './DDFormSchema';
import DDFormFields from './DDFormFields';
import DDDocumentLink from './DDDocumentLink';

const DDForm: React.FC<DDFormProps> = ({ ddId, empresaId, onSuccess }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [documentName, setDocumentName] = useState<string>("");
  const [empresa, setEmpresa] = useState<CompanyData | null>(null);
  const [initialData, setInitialData] = useState<DueDiligenceItem | null>(null);
  
  const navigate = useNavigate();
  
  // Configuração do formulário com valores padrão
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo_dd: '',
      item: '',
      status: 'pendente',
      risco: 'medio',
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
            
            // Preencher dados do documento
            if (item.documento_url) {
              setDocumentUrl(item.documento_url);
            }
            if (item.documento_nome) {
              setDocumentName(item.documento_nome);
            }
            
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
      
      // Adicionar dados do documento se fornecidos
      if (documentUrl) {
        dueDiligenceItem.documento_url = documentUrl;
        dueDiligenceItem.documento_nome = documentName || "Documento sem nome";
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
          {/* Form Fields Component */}
          <DDFormFields form={form} />
          
          {/* Document Link Component */}
          <DDDocumentLink 
            documentUrl={documentUrl}
            documentName={documentName}
            onUrlChange={setDocumentUrl}
            onNameChange={setDocumentName}
            initialData={initialData}
          />
          
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
