import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  BtnBold,
  // BtnBulletList,
  // BtnClearFormatting,
  BtnItalic,
  // BtnLink,
  // BtnNumberedList,
  // BtnRedo,
  BtnStrikeThrough,
  BtnUnderline,
  // BtnUndo,
  Editor,
  EditorProvider,
  Toolbar,
} from 'react-simple-wysiwyg';

import { cn } from '@/lib/utils';

export type RichTextFieldProps<FormType extends FieldValues> = {
  name: Path<FormType>;
  control: Control<FormType>;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

export function RichTextField<FormType extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required,
  className,
}: RichTextFieldProps<FormType>) {
  const { t } = useTranslation();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    shouldUnregister: false,
  });
  const errorMessage = error?.message ? t(error.message) : '';

  return (
    <div className="space-y-2 w-full">
      <label
        className={cn(
          'text-primary',
          errorMessage && 'font-medium text-red-500'
        )}
      >
        {label.concat(required ? ' *' : '')}
      </label>
      <EditorProvider>
        <Editor
          value={field.value || ''}
          onChange={field.onChange}
          placeholder={placeholder}
          className={cn(
            'border p-3 min-h-[150px] rounded-lg shadow-sm focus:border-primary focus:ring-primary',
            className
          )}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            {/* TODO: Removed this Tools as per new design feedback */}
            {/* <BtnBulletList />
                  <BtnClearFormatting />
                  <BtnNumberedList />
                  <BtnUndo />
                  <BtnRedo />
                  <BtnLink /> */}
          </Toolbar>
        </Editor>
      </EditorProvider>
      {errorMessage && (
        <span className="text-red-600 font-medium">{errorMessage}</span>
      )}
    </div>
  );
}
