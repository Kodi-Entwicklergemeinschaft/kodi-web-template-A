import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multiselect';
import { useTypedTranslation } from '@/hooks';

// Replace KODI with the city name by validating in backend code
const citiesList = [
  { label: 'KODI', value: 'KODI' },
  { label: 'Berlin', value: 'Berlin' },
  { label: 'Kusel', value: 'Kusel' },
];
export function PopUp({
  HandleCreateAdmin,
}: {
  HandleCreateAdmin: ({
    email,
    cities,
  }: {
    email: string;
    cities: string[];
  }) => void;
}) {
  const { t } = useTypedTranslation();
  const [cities, setCities] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Plus className="w-4 h-4 mr-2" />
          {t('cityAdministration.createAdmin')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('cityAdministration.createAdmin')}</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            HandleCreateAdmin({ email, cities });
            setOpen(false);
          }}
        >
          <div className="grid gap-3">
            <Label htmlFor="email-1">Email</Label>
            <Input
              id="email-1"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <MultiSelect
            defaultValue={cities}
            className="bg-primary-foreground hover:bg-secondary text-primary-foreground font-normal"
            placeholder="Select Cities"
            options={citiesList}
            onValueChange={setCities}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
