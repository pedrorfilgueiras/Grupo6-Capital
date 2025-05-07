
import React from 'react';
import { FileText, Upload } from 'lucide-react';
import { FormLabel } from '@/components/ui/form';
import { DueDiligenceItem } from '@/services/dueDiligenceTypes';

interface DocumentUploadProps {
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initialData: DueDiligenceItem | null;
}

const DDDocumentUpload: React.FC<DocumentUploadProps> = ({ 
  selectedFile, 
  onFileChange, 
  initialData 
}) => {
  return (
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
          onChange={onFileChange} 
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
  );
};

export default DDDocumentUpload;
