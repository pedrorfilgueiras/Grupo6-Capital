
import React from 'react';
import { FileText, Link } from 'lucide-react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DueDiligenceItem } from '@/services/dueDiligenceTypes';

interface DocumentLinkProps {
  documentUrl: string;
  documentName: string;
  onUrlChange: (url: string) => void;
  onNameChange: (name: string) => void;
  initialData: DueDiligenceItem | null;
}

const DDDocumentLink: React.FC<DocumentLinkProps> = ({ 
  documentUrl, 
  documentName, 
  onUrlChange, 
  onNameChange,
  initialData 
}) => {
  return (
    <div className="space-y-2">
      <FormLabel>Documento</FormLabel>
      <div className="space-y-4">
        <div>
          <FormLabel className="text-xs text-muted-foreground">URL do Documento</FormLabel>
          <div className="flex items-center gap-2">
            <Link className="h-4 w-4 text-muted-foreground" />
            <Input 
              value={documentUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://exemplo.com/documento.pdf"
              className="flex-1"
            />
          </div>
        </div>
        
        <div>
          <FormLabel className="text-xs text-muted-foreground">Nome do Documento</FormLabel>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <Input 
              value={documentName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Nome do documento"
              className="flex-1"
            />
          </div>
        </div>
        
        {initialData?.documento_url && (
          <div className="pt-2">
            <a 
              href={initialData.documento_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary flex items-center gap-2 hover:underline"
            >
              <FileText className="h-4 w-4" />
              {initialData.documento_nome || "Ver documento atual"}
            </a>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Adicione um link para o documento relevante para este item (opcional).
      </p>
    </div>
  );
};

export default DDDocumentLink;
