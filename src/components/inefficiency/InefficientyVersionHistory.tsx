
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock, User, FileText, Plus, Minus, Edit } from 'lucide-react';
import { InefficientyVersion, VersionChange, InefficientyEntry, INEFFICIENCY_CATEGORIES } from '@/services/inefficiencyTypes';
import { getLogVersions } from '@/services/inefficiencyService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InefficientyVersionHistoryProps {
  logId: string;
  onBack: () => void;
}

const InefficientyVersionHistory: React.FC<InefficientyVersionHistoryProps> = ({
  logId,
  onBack
}) => {
  const [versions, setVersions] = useState<InefficientyVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<InefficientyVersion | null>(null);
  const [compareVersion, setCompareVersion] = useState<InefficientyVersion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVersions();
  }, [logId]);

  const loadVersions = async () => {
    try {
      setIsLoading(true);
      const loadedVersions = await getLogVersions(logId);
      setVersions(loadedVersions);
      if (loadedVersions.length > 0) {
        setSelectedVersion(loadedVersions[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar versões:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added': return <Plus className="h-4 w-4 text-green-600" />;
      case 'removed': return <Minus className="h-4 w-4 text-red-600" />;
      case 'updated': return <Edit className="h-4 w-4 text-blue-600" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'added': return 'bg-green-100 text-green-800 border-green-200';
      case 'removed': return 'bg-red-100 text-red-800 border-red-200';
      case 'updated': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const compareVersions = (v1: InefficientyVersion, v2: InefficientyVersion) => {
    const differences: VersionChange[] = [];
    
    // Implementar lógica de comparação entre versões
    // Por simplicidade, vamos mostrar as mudanças registradas
    return [...v1.changes, ...v2.changes];
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando histórico...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Histórico de Versões
              </CardTitle>
              <CardDescription>
                Visualize e compare versões anteriores do log de ineficiências
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {versions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Nenhuma versão salva ainda.</p>
            <p className="text-sm text-muted-foreground">
              O histórico será criado automaticamente quando você fizer alterações no log.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Versões */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Versões Salvas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedVersion?.id === version.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedVersion(version)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{version.createdBy}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {version.changes.length} mudança(s)
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {version.description}
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(version.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Detalhes da Versão Selecionada */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedVersion ? 'Detalhes da Versão' : 'Selecione uma Versão'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedVersion ? (
                <Tabs defaultValue="changes">
                  <TabsList className="mb-4">
                    <TabsTrigger value="changes">Alterações</TabsTrigger>
                    <TabsTrigger value="snapshot">Snapshot</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="changes" className="space-y-4">
                    <div className="space-y-3">
                      {selectedVersion.changes.map((change, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${getChangeColor(change.type)}`}
                        >
                          <div className="flex items-start gap-3">
                            {getChangeIcon(change.type)}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{change.description}</p>
                              {change.field && (
                                <div className="mt-2 text-xs space-y-1">
                                  {change.oldValue && (
                                    <p><strong>Antes:</strong> {change.oldValue}</p>
                                  )}
                                  {change.newValue && (
                                    <p><strong>Depois:</strong> {change.newValue}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {selectedVersion.changes.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          Nenhuma alteração registrada nesta versão.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="snapshot" className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">
                        Ineficiências nesta versão ({selectedVersion.entries.length})
                      </h4>
                      
                      {selectedVersion.entries.map((entry) => (
                        <Card key={entry.id} className="border">
                          <CardContent className="pt-4">
                            <p className="text-sm mb-2">{entry.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">
                                {INEFFICIENCY_CATEGORIES.find(cat => cat.value === entry.category)?.label}
                              </Badge>
                              <Badge variant="outline">{entry.severity}</Badge>
                              <Badge variant="outline">{entry.status}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {selectedVersion.entries.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          Nenhuma ineficiência registrada nesta versão.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione uma versão na lista ao lado para ver os detalhes.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InefficientyVersionHistory;
