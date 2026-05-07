// ImageUploader.tsx
import { Upload, X } from 'lucide-react';
import React, {
  startTransition,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { MAX_FILE_SIZE } from '@/lib/constant';
import { cn } from '@/lib/utils';

type PreviewItem = {
  id: string; // stable id (can be blob url or generated)
  url: string;
  file?: File; // present when created from user file
  isBlob?: boolean; // true if url is a created object URL
};

type ImageUploaderProps = {
  name: string;
  /**
   * ✅ CHANGED: allow mixed array as value
   * Can be single URL, array of URLs, array of Files, or mixed (string | File)[], or null
   */
  value?: string | string[] | File[] | (string | File)[] | null;
  label?: string;
  selectBtnName?: string;
  placeholderText?: string;
  /**
   * ✅ CHANGED: onChange now returns (File | string)[] | null
   * so parent can store both existing URLs and new Files together.
   */
  onChange?: (files: (File | string)[] | null) => void;
  accept?: string;
  /** max bytes value? Keep as MB for compatibility with your previous API */
  maxFileSize?: number; // MB
  supportedExtension?: string[];
  formErrMsg?: string;
  required?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  /** localized error keys */
  errorName?: {
    maxFileSize: string;
    supportedExtension: string;
    invalidFile: string;
    tooManyFiles?: string;
  };
};

export const MultiImageUploader: React.FC<ImageUploaderProps> = ({
  name,
  value = null,
  label = 'formMessages.uploadField.label',
  onChange,
  placeholderText = 'formMessages.uploadField.placeholder',
  selectBtnName = 'formMessages.uploadField.btnLabel',
  accept = 'image/*',
  maxFileSize = MAX_FILE_SIZE,
  supportedExtension = ['jpg', 'jpeg', 'png'],
  formErrMsg,
  required = false,
  multiple = false,
  maxFiles = 8,
  errorName = {
    maxFileSize: 'formMessages.uploadField.errorName.maxFileSize',
    supportedExtension: 'formMessages.uploadField.errorName.supportedExtension',
    invalidFile: 'formMessages.uploadField.errorName.invalidFile',
    tooManyFiles: 'formMessages.uploadField.errorName.tooManyFiles',
  },
}) => {
  const { t } = useTranslation();

  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  // files created from user selection (keeps ordering consistent with previews)
  const filesRef = useRef<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ NEW helper: normalize any allowed value to (File | string)[]
  const normalizeToArray = (
    v: ImageUploaderProps['value']
  ): (File | string)[] => {
    if (v == null) return [];
    if (Array.isArray(v)) return v as (File | string)[];
    return [v as File | string];
  };

  useEffect(() => {
    // helper to revoke blob urls
    const revokePrevBlobs = (items: PreviewItem[]) =>
      items.forEach((p) => {
        if (p.isBlob) URL.revokeObjectURL(p.url);
      });

    if (value == null) {
      startTransition(() => {
        setPreviews((prev) => {
          revokePrevBlobs(prev);
          return [];
        });
        filesRef.current = [];
      });
      if (fileInputRef.current) {
        try {
          fileInputRef.current.value = '';
        } catch {
          /* ignore */
        }
      }
      return;
    }

    // ✅ CHANGED: handle mixed arrays (File | string)[]
    const arr = normalizeToArray(value);

    const files: File[] = [];
    const urls: string[] = [];

    for (const item of arr) {
      if (item instanceof File) {
        files.push(item);
      } else if (typeof item === 'string') {
        urls.push(item);
      }
    }

    startTransition(() => {
      setPreviews((prev) => {
        revokePrevBlobs(prev);

        const limitedFiles = files.slice(0, maxFiles);
        const remainingSlots = Math.max(0, maxFiles - limitedFiles.length);
        const limitedUrls = urls.slice(0, remainingSlots);

        const filePreviews: PreviewItem[] = limitedFiles.map((f) => {
          const blob = URL.createObjectURL(f);
          return {
            id: blob,
            url: blob,
            file: f,
            isBlob: true,
          };
        });

        const urlPreviews: PreviewItem[] = limitedUrls.map((u) => ({
          id: String(u),
          url: String(u),
          isBlob: false,
        }));

        // You can choose order: URLs first then files, or vice versa.
        // Here: URLs first, then files.
        return [...urlPreviews, ...filePreviews];
      });

      // keep the file references in sync
      filesRef.current = files.slice(0, maxFiles);
    });
  }, [value, maxFiles]);

  // cleanup on unmount: revoke any blob URLs
  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (p.isBlob) URL.revokeObjectURL(p.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      if (list.length === 0) return;

      // check total count limit (includes existing URLs + files)
      const totalAllowed = maxFiles;
      const currentCount = previews.length;
      if (currentCount + list.length > totalAllowed) {
        toast.error(
          t(
            errorName.tooManyFiles ?? 'You cannot upload more than {max} files'
          ).replace('{max}', String(maxFiles))
        );
        return;
      }

      const acceptedFiles: File[] = [];

      for (const file of list) {
        if (!file.type.startsWith('image/')) {
          toast.error(t(errorName.invalidFile));
          continue;
        }

        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        const sizeMB = file.size / 1024 / 1024;

        if (sizeMB > maxFileSize) {
          toast.error(`${t(errorName.maxFileSize)} ${maxFileSize} MB`);
          continue;
        }

        if (!ext || !supportedExtension.includes(ext)) {
          toast.error(
            `${t(errorName.supportedExtension)}: ${supportedExtension.join(
              ', '
            )}`
          );
          continue;
        }

        acceptedFiles.push(file);
      }

      if (acceptedFiles.length === 0) return;

      const newPreviews = acceptedFiles.map((f) => {
        const blobUrl = URL.createObjectURL(f);
        return {
          id: blobUrl,
          url: blobUrl,
          file: f,
          isBlob: true,
        } as PreviewItem;
      });

      // ✅ CHANGED: compute next previews and propagate BOTH URLs + Files
      const nextPreviews = [...previews, ...newPreviews].slice(0, maxFiles);
      setPreviews(nextPreviews);

      const nextFiles = nextPreviews
        .filter((p) => p.file)
        .map((p) => p.file!) as File[];
      filesRef.current = nextFiles;

      const remoteUrls = nextPreviews
        .filter((p) => !p.file)
        .map((p) => p.url) as string[];

      const combined: (File | string)[] = [...remoteUrls, ...nextFiles];
      onChange?.(combined.length > 0 ? combined : null);
    },
    [
      maxFileSize,
      maxFiles,
      previews,
      onChange,
      supportedExtension,
      t,
      errorName,
    ]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    addFiles(fileList);
    // reset the input so same file can be selected again if needed
    e.currentTarget.value = '';
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const fileList = e.dataTransfer.files;
      if (!fileList || fileList.length === 0) return;
      addFiles(fileList);
    },
    [addFiles]
  );

  const handleRemoveAt = (index: number) => {
    setPreviews((prev) => {
      const item = prev[index];
      if (!item) return prev;

      // revoke blob url if needed
      if (item.isBlob) URL.revokeObjectURL(item.url);

      const next = prev.filter((_, i) => i !== index);

      // recompute filesRef from remaining previews
      const nextFiles = next
        .filter((p) => p.file)
        .map((p) => p.file!) as File[];
      filesRef.current = nextFiles;

      const remainingUrls = next
        .filter((p) => !p.file)
        .map((p) => p.url) as string[];

      // ✅ CHANGED: parent always gets combined (URLs + Files)
      const combined: (File | string)[] = [...remainingUrls, ...nextFiles];
      onChange?.(combined.length > 0 ? combined : null);

      return next;
    });
  };

  const handleClearAll = () => {
    // revoke blob urls
    setPreviews((prev) => {
      prev.forEach((p) => {
        if (p.isBlob) URL.revokeObjectURL(p.url);
      });
      return [];
    });
    filesRef.current = [];
    onChange?.(null);
    if (fileInputRef.current) {
      try {
        fileInputRef.current.value = '';
      } catch {
        /* ignore */
      }
    }
  };

  // For accessibility and unique input id
  const reactId = useId();
  const sanitizedReactId = reactId.replace(/[:.]/g, '-');
  const inputIdRef = useRef<string>(
    `uploader-${String(name)}-${sanitizedReactId}`
  );
  const inputId = inputIdRef.current;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium">
          {t(label)} {required ? '*' : ''}
        </label>
      )}

      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-4 transition-colors border-primary',
          formErrMsg ? 'border-red-500' : ''
        )}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={handleDrop}
      >
        {previews.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {previews.map((p, idx) => (
                <div key={p.id} className="relative rounded-md overflow-hidden">
                  <img
                    src={p.url}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 bg-white shadow-sm hover:bg-red-50"
                    onClick={() => handleRemoveAt(idx)}
                    aria-label={t('removeImage')}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-3">
              {previews.length < maxFiles && (
                <>
                  <input
                    id={inputId}
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                  <Button asChild variant="outline" size="sm">
                    <label htmlFor={inputId}>{t(selectBtnName)}</label>
                  </Button>
                </>
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="ml-auto"
              >
                Clear
              </Button>
              <div className="text-sm text-muted-foreground ml-2">
                {previews.length}/{maxFiles}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center py-6">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {t(placeholderText)}
              </p>

              <input
                id={inputId}
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                className="hidden"
                onChange={handleFileInputChange}
              />

              <div className="flex items-center justify-center gap-2 mt-3">
                <Button asChild variant="outline" size="sm">
                  <label htmlFor={inputId}>{t(selectBtnName)}</label>
                </Button>
                <div className="text-sm text-muted-foreground">
                  {multiple ? `${0}/${maxFiles}` : ''}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {formErrMsg && <p className="text-red-500 text-sm">{t(formErrMsg)}</p>}
    </div>
  );
};

/* ----------------------------
   MultiFileUploadField (Controller wrapper)
   ---------------------------- */
type FileUploadFieldProps<FormType extends FieldValues> = {
  name: Path<FormType>;
  control: Control<FormType>;
} & Omit<ImageUploaderProps, 'name' | 'value' | 'onChange'>;

export const MultiFileUploadField = <FormType extends FieldValues>({
  control,
  name,
  ...restProps
}: FileUploadFieldProps<FormType>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <MultiImageUploader
            name={String(name)}
            /**
             * ✅ CHANGED: field.value may now be (File | string)[]
             */
            value={
              field.value as
                | (File | string)[]
                | string
                | string[]
                | File[]
                | null
            }
            onChange={(files) => {
              // ✅ Just forward; ImageUploader already returns mixed array.
              field.onChange(files);
            }}
            formErrMsg={fieldState.error?.message}
            {...restProps}
          />
        );
      }}
    />
  );
};
