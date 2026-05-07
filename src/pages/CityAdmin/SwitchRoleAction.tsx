import { User } from 'lucide-react';
import { useState } from 'react';

import { toast } from 'sonner';

import { useAssignRole } from '@/api/queries/cityAdminList';
import { useGetCityList } from '@/api/queries/cityList';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTypedTranslation } from '@/hooks';
import { RoleValue } from '@/lib/constant';

type SwitchRoleActionProps = {
  itemId: string | number;
  currentRole: RoleValue;
  disabled?: boolean;
};

function SwitchRoleAction({
  itemId,
  currentRole,
  disabled = false,
}: SwitchRoleActionProps) {
  const { t } = useTypedTranslation();
  const assignRoleMutation = useAssignRole();
  const { data: cityListData } = useGetCityList();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(String(currentRole));
  const [selectedCity, setSelectedCity] = useState<string>('');

  const handleSave = () => {
    if (!selectedCity) {
      toast.error(t('user.select_city'));
      return;
    }

    assignRoleMutation.mutate(
      {
        userId: String(itemId),
        cityId: selectedCity,
        role: Number(selectedRole) as RoleValue,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            toast.success(t('user.roleAssign'));
            setOpenDialog(false);
          } else {
            toast.error(t('user.roleAssignFailed'));
          }
        },
        onError: () => {
          toast.error('Something went wrong');
        },
      }
    );
  };

  const handleOpenDialog = () => {
    if (disabled) return;
    setOpenDialog(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenDialog}
        disabled={disabled}
        className={disabled ? 'cursor-not-allowed opacity-50' : undefined}
        aria-disabled={disabled}
        aria-label="button for switch role"
      >
        <User
          className={`w-5 h-5 cursor-pointer ${
            disabled ? 'text-muted-foreground' : 'text-primary'
          }`}
        />
      </button>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {t('switchRole.title')}
            </DialogTitle>
            <DialogDescription>{t('switchRole.description')}</DialogDescription>
          </DialogHeader>

          {/* ROLE DROPDOWN */}
          <div className="my-4">
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('switchRole.selectRole')} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="3">Citizen</SelectItem>
                <SelectItem value="2">City Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CITY DROPDOWN */}
          <div className="my-4">
            <Select
              value={selectedCity}
              onValueChange={(value) => setSelectedCity(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('switchRole.selectCity')} />
              </SelectTrigger>

              <SelectContent>
                {cityListData?.success &&
                  cityListData?.data?.items.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">{t('cancel')}</Button>
            </DialogClose>

            <Button
              variant="default"
              onClick={handleSave}
              loading={assignRoleMutation.isPending}
            >
              {t('accountSetting.form.saveBtn')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SwitchRoleAction;
