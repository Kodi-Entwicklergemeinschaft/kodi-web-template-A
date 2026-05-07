import { Upload, X } from 'lucide-react';
import React, {
  startTransition,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { MAX_FILE_SIZE } from '@/lib/constant';
import { cn } from '@/lib/utils';

const DEFAULT_SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png'] as const;
const MIME_TYPE_MAP: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

type ImageUploaderProps = {
  name: string;
  /** Optional unique id for <input type=file> to avoid collisions when multiple instances are rendered */
  id?: string;
  value?: string | null;
  label?: string;
  selectBtnName?: string;
  placeholderText?: string;
  onChange?: (file: File | null) => void;
  onDelete?: () => void;
  accept?: string;
  maxFileSize?: number;
  supportedExtension?: string[];
  formErrMsg?: string;
  required?: boolean;
  errorName?: {
    maxFileSizeFileUpload: string;
    maxFileSize: string;
    supportedExtension: string;
    invalidFile: string;
  };
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  name,
  id,
  value = null,
  label = 'formMessages.uploadField.label',
  onChange,
  onDelete,
  placeholderText = 'formMessages.uploadField.placeholder',
  selectBtnName = 'formMessages.uploadField.btnLabel',
  maxFileSize = MAX_FILE_SIZE,
  supportedExtension = DEFAULT_SUPPORTED_EXTENSIONS,
  accept,
  formErrMsg,
  required = false,
  errorName = {
    maxFileSizeFileUpload:
      'formMessages.uploadField.errorName.maxFileSizeFileUpload',
    maxFileSize: 'formMessages.uploadField.errorName.maxFileSize',
    supportedExtension: 'formMessages.uploadField.errorName.supportedExtension',
    invalidFile: 'formMessages.uploadField.errorName.invalidFile',
  },
}) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);
  const [isCustomFile, setIsCustomFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const prevValueRef = useRef<string | null>(null);

  const normalizedSupportedExtensions = useMemo(
    () => supportedExtension.map((ext) => ext.toLowerCase()),
    [supportedExtension]
  );

  const allowedMimeTypes = useMemo(
    () =>
      normalizedSupportedExtensions.map(
        (ext) => MIME_TYPE_MAP[ext] ?? `image/${ext}`
      ),
    [normalizedSupportedExtensions]
  );

  const resolvedAccept = useMemo(
    () =>
      accept ?? normalizedSupportedExtensions.map((ext) => `.${ext}`).join(','),
    [accept, normalizedSupportedExtensions]
  );

  useEffect(() => {
    if (value === null || !value) {
      prevValueRef.current = null;
      startTransition(() => {
        setPreview(null);
        setIsCustomFile(false);
      });
      // Also clear the underlying file input if present
      if (fileInputRef.current) {
        try {
          fileInputRef.current.value = '';
        } catch {
          /* ignore */
        }
      }
      return;
    }

    if (typeof value === 'string') {
      const newValue = value.concat(`?cb=${new Date().getTime()}`);
      // Update preview when:
      // 1. Not a custom file (!isCustomFile), OR
      // 2. The string URL has changed from previous value (handles cache-busting)
      const hasValueChanged = prevValueRef.current !== newValue;

      if (!isCustomFile || hasValueChanged) {
        prevValueRef.current = newValue;
        startTransition(() => {
          setPreview(newValue);
          setIsCustomFile(false);
        });
      }
    }
  }, [value, isCustomFile]);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error(t(errorName.invalidFile));
      } else {
        const ext = file.name.split('.').pop()?.toLowerCase();
        const sizeMB = file.size / 1024 / 1024;

        if (!allowedMimeTypes.includes(file.type)) {
          toast.error(
            `${t(errorName.supportedExtension)}: ${normalizedSupportedExtensions.join(', ')}`
          );
        } else if (sizeMB > maxFileSize) {
          toast.error(
            `${t(errorName.maxFileSizeFileUpload)} ${maxFileSize} MB`
          );
        } else if (!ext || !normalizedSupportedExtensions.includes(ext)) {
          toast.error(
            `${t(errorName.supportedExtension)}: ${normalizedSupportedExtensions.join(', ')}`
          );
        } else {
          const blobUrl = URL.createObjectURL(file);
          setPreview(blobUrl);
          setIsCustomFile(true);

          onChange?.(file);
        }
      }
    },
    [
      maxFileSize,
      onChange,
      normalizedSupportedExtensions,
      allowedMimeTypes,
      t,
      errorName,
    ]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = () => {
    if (preview?.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setIsCustomFile(false);
    onChange?.(null);
    onDelete?.();
    if (fileInputRef.current) {
      try {
        fileInputRef.current.value = '';
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium">
          {t(label)} {required ? '*' : ''}
        </label>
      )}

      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-4 text-center transition-colors border-primary',
          isDragging && 'border-blue-500 bg-white',
          formErrMsg && 'border-red-500'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="rounded-md object-cover mx-auto aspect-square size-60"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 bg-white shadow-sm hover:bg-red-50"
              onClick={handleRemove}
              aria-label={t('removeImage')}
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {t(placeholderText)}
            </p>

            <input
              type="file"
              accept={resolvedAccept}
              id={id ?? name}
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />

            <Button
              asChild
              variant="outline"
              size="sm"
              className="mt-2 cursor-pointer"
            >
              <label htmlFor={id ?? name}>{t(selectBtnName)}</label>
            </Button>
          </>
        )}
      </div>

      {formErrMsg && <p className="text-red-500 text-sm">{t(formErrMsg)}</p>}
    </div>
  );
};

type FileUploadFieldProps<FormType extends FieldValues> = {
  name: Path<FormType>;
  control: Control<FormType>;
} & Omit<ImageUploaderProps, 'name' | 'value' | 'onChange' | 'formErrMsg'>;

export const FileUploadField = <FormType extends FieldValues>({
  control,
  name,
  ...restProps
}: FileUploadFieldProps<FormType>) => {
  // Create a stable, unique id for file input to avoid collisions when multiple
  // instances are rendered on the same page (e.g., sub-forms)
  const reactId = useId();
  // useId can return colons/other characters; sanitize to keep id usable in selectors
  const sanitizedReactId = reactId.replace(/[:.]/g, '-');
  const idRef = useRef<string>(`${String(name)}-${sanitizedReactId}`);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <ImageUploader
          name={String(name)}
          id={idRef.current}
          value={field.value ?? null}
          onChange={field.onChange}
          formErrMsg={fieldState.error?.message}
          {...restProps}
        />
      )}
    />
  );
};
