import { useMemo } from 'react';

import {
  selectUserFirstName,
  selectUserLastName,
} from '@/store/slices/userSlice';
import { useGlobalStore } from '@/store/useGlobalStore';

export default function ProfileAvatar() {
  const firstName = useGlobalStore(selectUserFirstName);
  const lastName = useGlobalStore(selectUserLastName);

  const name = useMemo(
    () => ((firstName || '') + ' ' + (lastName || '')).trim(),
    [firstName, lastName]
  );

  const initials = useMemo(() => {
    if (!name) return '';
    const parts = name.split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[1]?.[0] : '';
    return (first + last).toUpperCase();
  }, [name]);

  return (
    <div
      title={name}
      className="flex items-center justify-center w-10 h-10 aspect-square
             rounded-full shadow-sm select-none
             bg-secondary text-secondary-foreground font-semibold text-sm"
    >
      {initials || '?'}
    </div>
  );
}
