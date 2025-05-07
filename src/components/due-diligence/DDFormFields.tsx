
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './DDFormSchema';
import { categoriasDueDiligence } from '@/services/dueDiligenceTypes';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface DDFormFieldsProps {
  form: UseFormReturn<FormData>;
}

const DDFormFields: React.FC<DDFormFieldsProps> = ({ form }) => {
  return (
    <>
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
    </>
  );
};

export default DDFormFields;
