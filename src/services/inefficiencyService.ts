
import { InefficientyLog, InefficientyEntry, InefficientyVersion, VersionChange } from './inefficiencyTypes';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Salvar log de ineficiências no Supabase
export const saveInefficientyLog = async (log: InefficientyLog): Promise<InefficientyLog> => {
  try {
    const timestamp = Date.now();
    const logToSave = {
      ...log,
      id: log.id || crypto.randomUUID(),
      updated_at: timestamp,
      created_at: log.createdAt || timestamp
    };

    // Salvar ou atualizar o log principal
    const { data: savedLog, error: logError } = await supabase
      .from('inefficiency_logs')
      .upsert({
        id: logToSave.id,
        company_id: logToSave.companyId,
        title: logToSave.title,
        ai_prompt: logToSave.aiPrompt,
        ai_response: logToSave.aiResponse,
        created_at: logToSave.created_at,
        updated_at: logToSave.updated_at,
        current_version: logToSave.currentVersion || 1
      })
      .select()
      .single();

    if (logError) throw logError;

    // Deletar entradas existentes e inserir as novas
    await supabase
      .from('inefficiency_entries')
      .delete()
      .eq('log_id', logToSave.id);

    if (logToSave.entries && logToSave.entries.length > 0) {
      const entries = logToSave.entries.map(entry => ({
        id: entry.id,
        log_id: logToSave.id,
        description: entry.description,
        category: entry.category,
        severity: entry.severity,
        status: entry.status,
        source: entry.source,
        created_at: entry.createdAt,
        updated_at: entry.updatedAt,
        created_by: entry.createdBy
      }));

      const { error: entriesError } = await supabase
        .from('inefficiency_entries')
        .insert(entries);

      if (entriesError) throw entriesError;
    }

    toast({
      title: "Log salvo com sucesso!",
      description: "O log foi salvo no banco de dados."
    });

    return {
      ...logToSave,
      createdAt: logToSave.created_at,
      updatedAt: logToSave.updated_at
    };
  } catch (error) {
    console.error('Erro ao salvar log de ineficiências:', error);
    toast({
      title: "Erro ao salvar log",
      description: "Não foi possível salvar o log no banco de dados.",
      variant: "destructive"
    });
    throw error;
  }
};

// Obter logs de ineficiências por empresa do Supabase
export const getInefficientyLogsByCompany = async (companyId: string): Promise<InefficientyLog[]> => {
  try {
    const { data: logs, error: logsError } = await supabase
      .from('inefficiency_logs')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (logsError) throw logsError;

    if (!logs || logs.length === 0) return [];

    // Buscar entradas para cada log
    const logsWithEntries = await Promise.all(
      logs.map(async (log) => {
        const { data: entries, error: entriesError } = await supabase
          .from('inefficiency_entries')
          .select('*')
          .eq('log_id', log.id)
          .order('created_at', { ascending: true });

        if (entriesError) {
          console.error('Erro ao buscar entradas:', entriesError);
          return {
            ...log,
            companyId: log.company_id,
            createdAt: log.created_at,
            updatedAt: log.updated_at,
            currentVersion: log.current_version,
            aiPrompt: log.ai_prompt,
            aiResponse: log.ai_response,
            entries: []
          };
        }

        const mappedEntries: InefficientyEntry[] = entries?.map(entry => ({
          id: entry.id,
          description: entry.description,
          category: entry.category as any,
          severity: entry.severity as any,
          status: entry.status as any,
          source: entry.source as any,
          createdAt: entry.created_at,
          updatedAt: entry.updated_at,
          createdBy: entry.created_by
        })) || [];

        return {
          ...log,
          companyId: log.company_id,
          createdAt: log.created_at,
          updatedAt: log.updated_at,
          currentVersion: log.current_version,
          aiPrompt: log.ai_prompt,
          aiResponse: log.ai_response,
          entries: mappedEntries
        };
      })
    );

    return logsWithEntries;
  } catch (error) {
    console.error('Erro ao carregar logs de ineficiências:', error);
    return [];
  }
};

// Obter log por ID do Supabase
export const getInefficientyLogById = async (id: string): Promise<InefficientyLog | null> => {
  try {
    const { data: log, error: logError } = await supabase
      .from('inefficiency_logs')
      .select('*')
      .eq('id', id)
      .single();

    if (logError) throw logError;
    if (!log) return null;

    const { data: entries, error: entriesError } = await supabase
      .from('inefficiency_entries')
      .select('*')
      .eq('log_id', id)
      .order('created_at', { ascending: true });

    if (entriesError) throw entriesError;

    const mappedEntries: InefficientyEntry[] = entries?.map(entry => ({
      id: entry.id,
      description: entry.description,
      category: entry.category as any,
      severity: entry.severity as any,
      status: entry.status as any,
      source: entry.source as any,
      createdAt: entry.created_at,
      updatedAt: entry.updated_at,
      createdBy: entry.created_by
    })) || [];

    return {
      ...log,
      companyId: log.company_id,
      createdAt: log.created_at,
      updatedAt: log.updated_at,
      currentVersion: log.current_version,
      aiPrompt: log.ai_prompt,
      aiResponse: log.ai_response,
      entries: mappedEntries
    };
  } catch (error) {
    console.error('Erro ao carregar log:', error);
    return null;
  }
};

// Salvar versão do histórico no Supabase
export const saveLogVersion = async (version: InefficientyVersion): Promise<InefficientyVersion> => {
  try {
    const versionToSave = {
      ...version,
      id: version.id || crypto.randomUUID(),
      created_at: Date.now()
    };

    const { data, error } = await supabase
      .from('inefficiency_versions')
      .insert({
        id: versionToSave.id,
        log_id: versionToSave.logId,
        entries: JSON.stringify(versionToSave.entries),
        changes: JSON.stringify(versionToSave.changes),
        created_at: versionToSave.created_at,
        created_by: versionToSave.createdBy,
        description: versionToSave.description
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...versionToSave,
      createdAt: versionToSave.created_at
    };
  } catch (error) {
    console.error('Erro ao salvar versão:', error);
    throw error;
  }
};

// Obter versões de um log do Supabase
export const getLogVersions = async (logId: string): Promise<InefficientyVersion[]> => {
  try {
    const { data: versions, error } = await supabase
      .from('inefficiency_versions')
      .select('*')
      .eq('log_id', logId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return versions?.map(version => ({
      id: version.id,
      logId: version.log_id,
      entries: typeof version.entries === 'string' ? JSON.parse(version.entries) : version.entries as InefficientyEntry[],
      changes: typeof version.changes === 'string' ? JSON.parse(version.changes) : version.changes as VersionChange[],
      createdAt: version.created_at,
      createdBy: version.created_by,
      description: version.description
    })) || [];
  } catch (error) {
    console.error('Erro ao carregar versões:', error);
    return [];
  }
};

// Comparar duas versões e gerar mudanças
export const compareVersions = (oldEntries: InefficientyEntry[], newEntries: InefficientyEntry[]): VersionChange[] => {
  const changes: VersionChange[] = [];
  
  // Verificar entradas removidas
  oldEntries.forEach(oldEntry => {
    if (!newEntries.find(entry => entry.id === oldEntry.id)) {
      changes.push({
        type: 'removed',
        entryId: oldEntry.id,
        description: `Ineficiência removida: ${oldEntry.description.substring(0, 50)}...`
      });
    }
  });
  
  // Verificar entradas adicionadas e modificadas
  newEntries.forEach(newEntry => {
    const oldEntry = oldEntries.find(entry => entry.id === newEntry.id);
    
    if (!oldEntry) {
      changes.push({
        type: 'added',
        entryId: newEntry.id,
        description: `Nova ineficiência adicionada: ${newEntry.description.substring(0, 50)}...`
      });
    } else {
      // Verificar campos modificados
      Object.keys(newEntry).forEach(key => {
        const fieldKey = key as keyof InefficientyEntry;
        if (oldEntry[fieldKey] !== newEntry[fieldKey]) {
          changes.push({
            type: 'updated',
            entryId: newEntry.id,
            field: key,
            oldValue: oldEntry[fieldKey],
            newValue: newEntry[fieldKey],
            description: `${key} alterado de "${oldEntry[fieldKey]}" para "${newEntry[fieldKey]}"`
          });
        }
      });
    }
  });
  
  return changes;
};

// Deletar log do Supabase
export const deleteInefficientyLog = async (id: string): Promise<boolean> => {
  try {
    // Deletar versões associadas primeiro
    await supabase
      .from('inefficiency_versions')
      .delete()
      .eq('log_id', id);

    // Deletar entradas associadas
    await supabase
      .from('inefficiency_entries')
      .delete()
      .eq('log_id', id);

    // Deletar o log principal
    const { error } = await supabase
      .from('inefficiency_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast({
      title: "Log excluído com sucesso!",
      description: "O log foi removido do banco de dados."
    });

    return true;
  } catch (error) {
    console.error('Erro ao excluir log:', error);
    toast({
      title: "Erro ao excluir log",
      description: "Não foi possível remover o log do banco de dados.",
      variant: "destructive"
    });
    return false;
  }
};
