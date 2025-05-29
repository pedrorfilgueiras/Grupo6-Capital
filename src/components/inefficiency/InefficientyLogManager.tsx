import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Plus, FileText, Wand, History, Edit2, Download } from 'lucide-react';
import { InefficientyLog, InefficientyEntry } from '@/services/inefficiencyTypes';
import { 
  saveInefficientyLog, 
  getInefficientyLogsByCompany, 
  deleteInefficientyLog 
} from '@/services/inefficiencyService';
import { getCompanies } from '@/services/companyService';
import { saveAllSmartCompaniesToStorage } from '@/services/smartDataService';
import { useQuery } from '@tanstack/react-query';
import InefficientyLogEditor from './InefficientyLogEditor';
import InefficientyVersionHistory from './InefficientyVersionHistory';

const InefficientyLogManager: React.FC = () => {
  const [logs, setLogs] = useState<InefficientyLog[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<InefficientyLog | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLogId, setHistoryLogId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('list');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Carregar empresas
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
  });

  // Carregar empresas dos dados inteligentes ao montar o componente
  useEffect(() => {
    const loadSmartCompanies = async () => {
      await saveAllSmartCompaniesToStorage();
    };
    loadSmartCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      loadLogs();
    }
  }, [selectedCompanyId]);

  const loadLogs = async () => {
    if (!selectedCompanyId) return;
    
    try {
      const companyLogs = await getInefficientyLogsByCompany(selectedCompanyId);
      setLogs(companyLogs);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    }
  };

  const handleCreateNewLog = async () => {
    if (!selectedCompanyId) {
      toast({
        title: "Selecione uma empresa",
        description: "É necessário selecionar uma empresa para criar um log.",
        variant: "destructive"
      });
      return;
    }

    const newLog: InefficientyLog = {
      id: crypto.randomUUID(),
      companyId: selectedCompanyId,
      title: `Log de Ineficiências - ${new Date().toLocaleDateString('pt-BR')}`,
      entries: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      currentVersion: 1
    };

    try {
      const savedLog = await saveInefficientyLog(newLog);
      setLogs([savedLog, ...logs]);
      setSelectedLog(savedLog);
      setActiveTab('edit');
    } catch (error) {
      console.error('Erro ao criar log:', error);
    }
  };

  const handleGenerateAILog = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt necessário",
        description: "Digite um prompt para gerar o log com IA.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAI(true);
    
    try {
      // Simular resposta da IA (em um cenário real, aqui seria uma chamada para a API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAIResponse = `Baseado na análise da empresa selecionada, foram identificadas as seguintes ineficiências:

1. Processo de aprovação de compras muito longo - demora média de 15 dias
2. Falta de integração entre sistemas financeiro e operacional
3. Reuniões em excesso - média de 20 horas por semana por funcionário
4. Retrabalho em relatórios - 30% do tempo é gasto refazendo análises
5. Comunicação interna deficiente entre departamentos`;

      setAiResponse(mockAIResponse);

      // Criar entradas baseadas na resposta da IA
      const aiEntries: InefficientyEntry[] = [
        {
          id: crypto.randomUUID(),
          description: "Processo de aprovação de compras muito longo - demora média de 15 dias",
          category: 'Operacional',
          severity: 'Alta',
          status: 'Identificada',
          source: 'IA',
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: crypto.randomUUID(),
          description: "Falta de integração entre sistemas financeiro e operacional",
          category: 'TI',
          severity: 'Crítica',
          status: 'Identificada',
          source: 'IA',
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: crypto.randomUUID(),
          description: "Reuniões em excesso - média de 20 horas por semana por funcionário",
          category: 'RH',
          severity: 'Média',
          status: 'Identificada',
          source: 'IA',
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: crypto.randomUUID(),
          description: "Retrabalho em relatórios - 30% do tempo é gasto refazendo análises",
          category: 'Operacional',
          severity: 'Alta',
          status: 'Identificada',
          source: 'IA',
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: crypto.randomUUID(),
          description: "Comunicação interna deficiente entre departamentos",
          category: 'RH',
          severity: 'Média',
          status: 'Identificada',
          source: 'IA',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ];

      if (!selectedCompanyId) {
        toast({
          title: "Selecione uma empresa",
          description: "É necessário selecionar uma empresa primeiro.",
          variant: "destructive"
        });
        return;
      }

      const newLog: InefficientyLog = {
        id: crypto.randomUUID(),
        companyId: selectedCompanyId,
        title: `Log de Ineficiências (IA) - ${new Date().toLocaleDateString('pt-BR')}`,
        entries: aiEntries,
        aiPrompt,
        aiResponse,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        currentVersion: 1
      };

      const savedLog = await saveInefficientyLog(newLog);
      setLogs([savedLog, ...logs]);
      setSelectedLog(savedLog);
      setActiveTab('edit');

      toast({
        title: "Log gerado com sucesso",
        description: "O log foi criado com base na análise da IA."
      });

    } catch (error) {
      console.error('Erro ao gerar log com IA:', error);
      toast({
        title: "Erro ao gerar log",
        description: "Não foi possível gerar o log com IA.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleEditLog = (log: InefficientyLog) => {
    setSelectedLog(log);
    setActiveTab('edit');
  };

  const handleViewHistory = (logId: string) => {
    setHistoryLogId(logId);
    setShowHistory(true);
  };

  const handleLogSaved = (savedLog: InefficientyLog) => {
    setLogs(logs.map(log => log.id === savedLog.id ? savedLog : log));
    setSelectedLog(savedLog);
    setActiveTab('list');
  };

  const handleDeleteLog = async (logId: string) => {
    try {
      await deleteInefficientyLog(logId);
      setLogs(logs.filter(log => log.id !== logId));
      if (selectedLog?.id === logId) {
        setSelectedLog(null);
      }
    } catch (error) {
      console.error('Erro ao excluir log:', error);
    }
  };

  const handleExportLog = (log: InefficientyLog) => {
    const exportData = {
      titulo: log.title,
      empresa: companies.find(c => c.id === log.companyId)?.razaoSocial || 'N/A',
      dataCreacao: new Date(log.createdAt).toLocaleDateString('pt-BR'),
      versao: log.currentVersion || 1,
      ineficiencias: log.entries.map(entry => ({
        descricao: entry.description,
        categoria: entry.category,
        severidade: entry.severity,
        status: entry.status,
        fonte: entry.source
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log-ineficiencias-${log.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export realizado",
      description: "Log exportado em formato JSON."
    });
  };

  if (showHistory) {
    return (
      <InefficientyVersionHistory
        logId={historyLogId}
        onBack={() => setShowHistory(false)}
      />
    );
  }

  if (selectedLog && activeTab === 'edit') {
    return (
      <InefficientyLogEditor
        log={selectedLog}
        onSave={handleLogSaved}
        onViewHistory={handleViewHistory}
        onBack={() => {
          setSelectedLog(null);
          setActiveTab('list');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Seleção de Empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Log de Ineficiências</CardTitle>
          <CardDescription>
            Crie, edite e gerencie logs de ineficiências das empresas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Selecionar Empresa</label>
              <select
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
              >
                <option value="">Selecione uma empresa...</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.razaoSocial}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedCompanyId && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="list">Lista de Logs</TabsTrigger>
            <TabsTrigger value="ai-generate">Gerar com IA</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Logs de Ineficiências</CardTitle>
                  <Button onClick={handleCreateNewLog} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Log
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum log de ineficiências criado ainda.</p>
                    <p className="text-sm">Crie um novo log ou gere um com IA.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {logs.map((log) => (
                      <Card key={log.id} className="border">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-medium">{log.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {log.entries.length} ineficiência(s) registrada(s)
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Criado em {new Date(log.createdAt).toLocaleDateString('pt-BR')}
                              </p>
                              
                              <div className="flex gap-2 mt-2">
                                {log.aiPrompt && (
                                  <Badge variant="outline" className="text-xs">
                                    <Wand className="h-3 w-3 mr-1" />
                                    Gerado por IA
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  v{log.currentVersion || 1}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExportLog(log)}
                                title="Exportar log"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewHistory(log.id)}
                                title="Ver histórico"
                              >
                                <History className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditLog(log)}
                                title="Editar log"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteLog(log.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Excluir log"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-generate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand className="h-5 w-5" />
                  Gerar Log com IA
                </CardTitle>
                <CardDescription>
                  Use IA para identificar ineficiências automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Prompt para IA</label>
                  <Textarea
                    placeholder="Descreva o que você gostaria que a IA analise para identificar ineficiências..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <Button
                  onClick={handleGenerateAILog}
                  disabled={isGeneratingAI || !aiPrompt.trim()}
                  className="w-full"
                >
                  {isGeneratingAI ? (
                    <>Gerando análise...</>
                  ) : (
                    <>
                      <Wand className="h-4 w-4 mr-2" />
                      Gerar Log com IA
                    </>
                  )}
                </Button>
                
                {aiResponse && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Resposta da IA:</h4>
                    <pre className="whitespace-pre-wrap text-sm">{aiResponse}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default InefficientyLogManager;
