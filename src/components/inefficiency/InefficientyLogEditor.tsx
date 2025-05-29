
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit2, Trash2, Save, History, Wand, ArrowLeft } from 'lucide-react';
import { InefficientyLog, InefficientyEntry, INEFFICIENCY_CATEGORIES } from '@/services/inefficiencyTypes';
import { saveInefficientyLog, compareVersions, saveLogVersion } from '@/services/inefficiencyService';

interface InefficientyLogEditorProps {
  log: InefficientyLog;
  onSave: (log: InefficientyLog) => void;
  onViewHistory: (logId: string) => void;
  onBack: () => void;
}

const InefficientyLogEditor: React.FC<InefficientyLogEditorProps> = ({
  log,
  onSave,
  onViewHistory,
  onBack
}) => {
  const [editingLog, setEditingLog] = useState<InefficientyLog>(log);
  const [editingEntry, setEditingEntry] = useState<InefficientyEntry | null>(null);
  const [newEntryForm, setNewEntryForm] = useState({
    description: '',
    category: 'Outros' as const,
    severity: 'Média' as const,
    status: 'Identificada' as const
  });
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Verificar se há mudanças comparando com o log original
    const hasLogChanges = JSON.stringify(editingLog) !== JSON.stringify(log);
    setHasChanges(hasLogChanges);
  }, [editingLog, log]);

  const handleSaveLog = async () => {
    try {
      // Comparar com versão anterior para criar histórico
      const changes = compareVersions(log.entries, editingLog.entries);
      
      if (changes.length > 0) {
        // Salvar versão anterior no histórico
        await saveLogVersion({
          id: crypto.randomUUID(),
          logId: editingLog.id,
          entries: log.entries,
          changes,
          createdAt: Date.now(),
          createdBy: 'Usuário Atual',
          description: `Alterações: ${changes.length} modificação(ões)`
        });
      }

      const savedLog = await saveInefficientyLog({
        ...editingLog,
        updatedAt: Date.now(),
        currentVersion: (editingLog.currentVersion || 0) + 1
      });
      
      onSave(savedLog);
      setHasChanges(false);
      toast({
        title: "Log salvo com sucesso",
        description: "As alterações foram registradas no histórico."
      });
    } catch (error) {
      console.error('Erro ao salvar log:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o log.",
        variant: "destructive"
      });
    }
  };

  const handleAddEntry = () => {
    if (!newEntryForm.description.trim()) {
      toast({
        title: "Descrição obrigatória",
        description: "Por favor, insira uma descrição para a ineficiência.",
        variant: "destructive"
      });
      return;
    }

    const newEntry: InefficientyEntry = {
      id: crypto.randomUUID(),
      description: newEntryForm.description,
      category: newEntryForm.category,
      severity: newEntryForm.severity,
      status: newEntryForm.status,
      source: 'Manual',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setEditingLog({
      ...editingLog,
      entries: [...editingLog.entries, newEntry]
    });

    setNewEntryForm({
      description: '',
      category: 'Outros',
      severity: 'Média',
      status: 'Identificada'
    });
    setIsAddingEntry(false);
  };

  const handleUpdateEntry = (updatedEntry: InefficientyEntry) => {
    setEditingLog({
      ...editingLog,
      entries: editingLog.entries.map(entry =>
        entry.id === updatedEntry.id
          ? { ...updatedEntry, updatedAt: Date.now() }
          : entry
      )
    });
    setEditingEntry(null);
  };

  const handleDeleteEntry = (entryId: string) => {
    setEditingLog({
      ...editingLog,
      entries: editingLog.entries.filter(entry => entry.id !== entryId)
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Baixa': return 'bg-green-100 text-green-800';
      case 'Média': return 'bg-yellow-100 text-yellow-800';
      case 'Alta': return 'bg-orange-100 text-orange-800';
      case 'Crítica': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Identificada': return 'bg-blue-100 text-blue-800';
      case 'Em Análise': return 'bg-purple-100 text-purple-800';
      case 'Em Resolução': return 'bg-yellow-100 text-yellow-800';
      case 'Resolvida': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Edit2 className="h-5 w-5" />
                  Editor de Log de Ineficiências
                </CardTitle>
                <CardDescription>
                  Edite manualmente o log e categorize as ineficiências por área
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onViewHistory(editingLog.id)}
                className="flex items-center gap-2"
              >
                <History className="h-4 w-4" />
                Histórico
              </Button>
              <Button
                onClick={handleSaveLog}
                disabled={!hasChanges}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {hasChanges ? 'Salvar Alterações' : 'Salvo'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título do Log</label>
              <Input
                value={editingLog.title}
                onChange={(e) => setEditingLog({ ...editingLog, title: e.target.value })}
                placeholder="Digite o título do log"
              />
            </div>
            
            {/* Informações do log */}
            <div className="flex gap-4 text-sm text-muted-foreground">
              <div>
                <strong>Criado em:</strong> {new Date(editingLog.createdAt).toLocaleString('pt-BR')}
              </div>
              <div>
                <strong>Última atualização:</strong> {new Date(editingLog.updatedAt).toLocaleString('pt-BR')}
              </div>
              <div>
                <strong>Versão:</strong> {editingLog.currentVersion || 1}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Ineficiências */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Ineficiências Identificadas ({editingLog.entries.length})</CardTitle>
            <Button
              onClick={() => setIsAddingEntry(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Ineficiência
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Formulário para nova entrada */}
            {isAddingEntry && (
              <Card className="border-dashed border-2">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Descrição da Ineficiência</label>
                      <Textarea
                        placeholder="Descreva a ineficiência identificada..."
                        value={newEntryForm.description}
                        onChange={(e) => setNewEntryForm({ ...newEntryForm, description: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Categoria</label>
                        <Select
                          value={newEntryForm.category}
                          onValueChange={(value) => setNewEntryForm({ ...newEntryForm, category: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {INEFFICIENCY_CATEGORIES.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Severidade</label>
                        <Select
                          value={newEntryForm.severity}
                          onValueChange={(value) => setNewEntryForm({ ...newEntryForm, severity: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Baixa">Baixa</SelectItem>
                            <SelectItem value="Média">Média</SelectItem>
                            <SelectItem value="Alta">Alta</SelectItem>
                            <SelectItem value="Crítica">Crítica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <Select
                          value={newEntryForm.status}
                          onValueChange={(value) => setNewEntryForm({ ...newEntryForm, status: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Identificada">Identificada</SelectItem>
                            <SelectItem value="Em Análise">Em Análise</SelectItem>
                            <SelectItem value="Em Resolução">Em Resolução</SelectItem>
                            <SelectItem value="Resolvida">Resolvida</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleAddEntry} disabled={!newEntryForm.description.trim()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingEntry(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de entradas */}
            {editingLog.entries.map((entry) => (
              <Card key={entry.id} className="border">
                <CardContent className="pt-6">
                  {editingEntry?.id === entry.id ? (
                    <EditEntryForm
                      entry={editingEntry}
                      onSave={handleUpdateEntry}
                      onCancel={() => setEditingEntry(null)}
                    />
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <p className="flex-1 text-sm">{entry.description}</p>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingEntry(entry)}
                            title="Editar entrada"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Excluir entrada"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          {INEFFICIENCY_CATEGORIES.find(cat => cat.value === entry.category)?.label}
                        </Badge>
                        <Badge className={getSeverityColor(entry.severity)}>
                          {entry.severity}
                        </Badge>
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {entry.source === 'IA' ? (
                            <>
                              <Wand className="h-3 w-3 mr-1" />
                              Gerado por IA
                            </>
                          ) : (
                            'Manual'
                          )}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Criado em: {new Date(entry.createdAt).toLocaleString('pt-BR')}
                        {entry.updatedAt !== entry.createdAt && (
                          <> | Atualizado em: {new Date(entry.updatedAt).toLocaleString('pt-BR')}</>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {editingLog.entries.length === 0 && !isAddingEntry && (
              <div className="text-center py-8 text-muted-foreground">
                <Edit2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma ineficiência registrada ainda.</p>
                <p className="text-sm">Clique em "Adicionar Ineficiência" para começar.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente para editar entrada individual
const EditEntryForm: React.FC<{
  entry: InefficientyEntry;
  onSave: (entry: InefficientyEntry) => void;
  onCancel: () => void;
}> = ({ entry, onSave, onCancel }) => {
  const [editingEntry, setEditingEntry] = useState(entry);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Descrição</label>
        <Textarea
          value={editingEntry.description}
          onChange={(e) => setEditingEntry({ ...editingEntry, description: e.target.value })}
          placeholder="Descrição da ineficiência..."
          className="mt-1"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Categoria</label>
          <Select
            value={editingEntry.category}
            onValueChange={(value) => setEditingEntry({ ...editingEntry, category: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INEFFICIENCY_CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium">Severidade</label>
          <Select
            value={editingEntry.severity}
            onValueChange={(value) => setEditingEntry({ ...editingEntry, severity: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Baixa">Baixa</SelectItem>
              <SelectItem value="Média">Média</SelectItem>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Crítica">Crítica</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select
            value={editingEntry.status}
            onValueChange={(value) => setEditingEntry({ ...editingEntry, status: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Identificada">Identificada</SelectItem>
              <SelectItem value="Em Análise">Em Análise</SelectItem>
              <SelectItem value="Em Resolução">Em Resolução</SelectItem>
              <SelectItem value="Resolvida">Resolvida</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={() => onSave(editingEntry)} disabled={!editingEntry.description.trim()}>
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default InefficientyLogEditor;
