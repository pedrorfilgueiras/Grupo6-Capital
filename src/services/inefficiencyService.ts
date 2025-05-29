
import { InefficientyLog, InefficientyEntry, InefficientyVersion, VersionChange } from './inefficiencyTypes';
import { showSuccessToast, showErrorToast } from './storageUtils';

// Salvar log de ineficiências
export const saveInefficientyLog = async (log: InefficientyLog): Promise<InefficientyLog> => {
  try {
    const timestamp = Date.now();
    const logToSave = {
      ...log,
      id: log.id || crypto.randomUUID(),
      updatedAt: timestamp,
      createdAt: log.createdAt || timestamp
    };

    const logs = JSON.parse(localStorage.getItem('inefficiencyLogs') || '[]');
    const existingIndex = logs.findIndex((l: InefficientyLog) => l.id === logToSave.id);
    
    if (existingIndex >= 0) {
      logs[existingIndex] = logToSave;
    } else {
      logs.push(logToSave);
    }
    
    localStorage.setItem('inefficiencyLogs', JSON.stringify(logs));
    showSuccessToast("Log de ineficiências salvo com sucesso!");
    
    return logToSave;
  } catch (error) {
    console.error('Erro ao salvar log de ineficiências:', error);
    showErrorToast("Erro ao salvar log de ineficiências.");
    throw error;
  }
};

// Obter logs de ineficiências por empresa
export const getInefficientyLogsByCompany = async (companyId: string): Promise<InefficientyLog[]> => {
  try {
    const logs = JSON.parse(localStorage.getItem('inefficiencyLogs') || '[]');
    return logs.filter((log: InefficientyLog) => log.companyId === companyId);
  } catch (error) {
    console.error('Erro ao carregar logs de ineficiências:', error);
    return [];
  }
};

// Obter log por ID
export const getInefficientyLogById = async (id: string): Promise<InefficientyLog | null> => {
  try {
    const logs = JSON.parse(localStorage.getItem('inefficiencyLogs') || '[]');
    return logs.find((log: InefficientyLog) => log.id === id) || null;
  } catch (error) {
    console.error('Erro ao carregar log:', error);
    return null;
  }
};

// Salvar versão do histórico
export const saveLogVersion = async (version: InefficientyVersion): Promise<InefficientyVersion> => {
  try {
    const versionToSave = {
      ...version,
      id: version.id || crypto.randomUUID(),
      createdAt: Date.now()
    };

    const versions = JSON.parse(localStorage.getItem('inefficiencyVersions') || '[]');
    versions.push(versionToSave);
    localStorage.setItem('inefficiencyVersions', JSON.stringify(versions));
    
    return versionToSave;
  } catch (error) {
    console.error('Erro ao salvar versão:', error);
    throw error;
  }
};

// Obter versões de um log
export const getLogVersions = async (logId: string): Promise<InefficientyVersion[]> => {
  try {
    const versions = JSON.parse(localStorage.getItem('inefficiencyVersions') || '[]');
    return versions
      .filter((version: InefficientyVersion) => version.logId === logId)
      .sort((a: InefficientyVersion, b: InefficientyVersion) => b.createdAt - a.createdAt);
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

// Deletar log
export const deleteInefficientyLog = async (id: string): Promise<boolean> => {
  try {
    const logs = JSON.parse(localStorage.getItem('inefficiencyLogs') || '[]');
    const filteredLogs = logs.filter((log: InefficientyLog) => log.id !== id);
    localStorage.setItem('inefficiencyLogs', JSON.stringify(filteredLogs));
    
    // Também remover versões associadas
    const versions = JSON.parse(localStorage.getItem('inefficiencyVersions') || '[]');
    const filteredVersions = versions.filter((version: InefficientyVersion) => version.logId !== id);
    localStorage.setItem('inefficiencyVersions', JSON.stringify(filteredVersions));
    
    showSuccessToast("Log de ineficiências excluído com sucesso!");
    return true;
  } catch (error) {
    console.error('Erro ao excluir log:', error);
    showErrorToast("Erro ao excluir log de ineficiências.");
    return false;
  }
};
