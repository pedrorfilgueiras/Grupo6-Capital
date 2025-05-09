
import React from 'react';
import { Link2 } from 'lucide-react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DueDiligenceItem } from '@/services/dueDiligenceTypes';

interface DocumentUploadProps {
  documentLink: string;
  onLinkChange: (link: string) => void;
  initialData: DueDiligenceItem | null;
}

const DDDocumentUpload: React.FC<DocumentUploadProps> = ({ 
  documentLink, 
  onLinkChange, 
  initialData 
}) => {
  return (
    <div className="space-y-2">
      <FormLabel>Documento</FormLabel>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input 
            value={documentLink}
            onChange={(e) => onLinkChange(e.target.value)}
            placeholder="https://exemplo.com/documento.pdf"
            className="pl-10"
          />
          <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Insira um link para um documento relevante para este item (opcional).
      </p>
      {!documentLink && initialData?.documento_nome && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Link atual: {initialData.documento}</span>
        </div>
      )}
    </div>
  );
};

export default DDDocumentUpload;
