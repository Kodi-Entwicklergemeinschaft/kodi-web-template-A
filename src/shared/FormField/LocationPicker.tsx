import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Control, FieldValues, Path, useWatch } from 'react-hook-form';

// These are your project's UI primitives — keep the imports the same as your app
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useTypedTranslation } from '@/hooks';
import { cn } from '@/lib/utils';
import FormErrorMessage from '@/shared/FormErrorMessage';

// -----------------------------
// Types
// -----------------------------
export type AddressValue = {
  address?: string | null;
  lat?: number | null;
  lon?: number | null;
  display_name?: string | null;
  place_id?: string | number | null;
} | null;

export type ListingFormValues = {
  title: string;
  description?: string;
  location?: AddressValue | string | null; // allow either object or legacy string
};

interface NominatimPlace {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: [string, string, string, string];
}

// -----------------------------
// AddressAutocompleteField (refactored)
// - keeps same API but is more defensive
// - exposes string label for display_name/address and stores an object
// -----------------------------
export type AddressAutocompleteFieldProps<FormType extends FieldValues> = {
  name: Path<FormType>;
  control: Control<FormType>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  debounceMs?: number;
  limit?: number;
  onSelectAddress?: (address: NominatimPlace) => void;
};

export function AddressAutocompleteField<FormType extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'Enter address...',
  required = false,
  className,
  debounceMs = 700,
  limit = 5,
  onSelectAddress,
}: AddressAutocompleteFieldProps<FormType>) {
  const formValue = useWatch({
    control,
    name,
  });
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<NominatimPlace>>([]);
  const [loading, setLoading] = useState(false);
  const [isStartedTyping, setIsStartedTyping] = useState(false);

  // const { t } = useTranslation();
  const { t } = useTypedTranslation();

  useEffect(() => {
    if (!formValue) {
      setQuery('');
    } else if (formValue && formValue !== query) {
      setQuery(formValue);
    }
    // TODO: THIS IS NOT ACTUAL WAY OF DOING BUT HAVE SCOPE OF REFACTOR
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue]);

  useEffect(() => {
    if (isStartedTyping) {
      if (!query || query.trim().length < 3) {
        setResults([]);
        setLoading(false);
        return;
      }

      const ac = new AbortController();
      const timeout = window.setTimeout(async () => {
        setLoading(true);
        try {
          const PROXY_BASE = 'https://nominatim.openstreetmap.org/search?'; //'https://nominatim-proxy.locationsearch.workers.dev';
          const url = `${PROXY_BASE}q=${encodeURIComponent(query)}&limit=${encodeURIComponent(String(limit))}&format=json`;

          const res = await fetch(url, { signal: ac.signal });
          if (!res.ok) {
            console.warn('proxy search failed', res.status);
            setResults([]);
          } else {
            const json = (await res.json()) as Promise<NominatimPlace[]>;
            setResults(Array.isArray(json) ? json : []);
          }
        } catch (err: unknown) {
          if (err instanceof DOMException && err.name === 'AbortError') {
            // aborted
          } else {
            console.error('search error', err);
            setResults([]);
          }
        } finally {
          setLoading(false);
        }
      }, debounceMs);

      return () => {
        clearTimeout(timeout);
        ac.abort();
      };
    }
  }, [query, debounceMs, limit, isStartedTyping]);

  return (
    <FormField
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const handleSelect = (
          // lat: number | null | undefined,
          // lon: number | null | undefined,
          display_name: string | null | undefined,
          addressVal: NominatimPlace
          // place_id?: string | number | null
        ) => {
          // store as an object. consumers should render safely (see Preview below)
          //   address: display_name ?? undefined,
          //   lat: lat == null ? undefined : Number(lat),
          //   lon: lon == null ? undefined : Number(lon),
          //   display_name: display_name ?? undefined,
          //   place_id: place_id ?? undefined,
          field.onChange(display_name ?? '');
          if (display_name) {
            onSelectAddress?.(addressVal);
          }

          setQuery(display_name ?? '');
          setResults([]);
        };

        return (
          <FormItem className={cn('w-full', className)}>
            {label && (
              <FormLabel className="text-primary">
                {label}
                {required ? ' *' : ''}
              </FormLabel>
            )}

            <FormControl>
              <div className="relative">
                <div
                  className={cn(
                    'flex items-center gap-2 border p-3 h-12 shadow-md rounded-lg',
                    fieldState.error && 'border-red-500'
                  )}
                >
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    value={query ? query : (field.value ?? '')}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      if (e.target.value === '') {
                        // clear the stored value
                        field.onChange(null);
                      }
                    }}
                    onFocus={() => {
                      setIsStartedTyping(true);
                    }}
                    onBlur={() => {
                      setIsStartedTyping(false);
                    }}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none"
                  />
                </div>

                {results.length > 0 && (
                  <ul className="absolute z-50 mt-1 w-full max-h-56 overflow-auto bg-primary-foreground border rounded-md shadow-md">
                    {results.map((r: NominatimPlace, idx: number) => (
                      <li
                        key={String(
                          r.place_id ??
                            `${r.lat ?? 'na'}-${r.lon ?? 'na'}-${idx}`
                        )}
                        className="px-3 py-2 hover:bg-secondary cursor-pointer text-sm text-foreground"
                        onClick={() =>
                          handleSelect(
                            // r.lat ?? '',
                            // r.lon ?? null,
                            r.display_name ?? r.name ?? null,
                            r
                            // r.place_id
                          )
                        }
                      >
                        {r.display_name ??
                          r.name ??
                          `${r.lat ?? '—'}, ${r.lon ?? '—'}`}
                      </li>
                    ))}
                  </ul>
                )}

                {loading && (
                  <div className="absolute w-full mt-1 bg-white border rounded-md px-3 py-2 text-xs text-muted-foreground">
                    {t('listing.upload.form.address.searching')}
                  </div>
                )}
              </div>
            </FormControl>

            <FormErrorMessage className="text-red-600">
              {(fieldState.error?.message as React.ReactNode) ?? null}
            </FormErrorMessage>
          </FormItem>
        );
      }}
    />
  );
}
