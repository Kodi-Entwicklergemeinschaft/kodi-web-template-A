import { Trash, XCircle } from 'lucide-react';
import { useState } from 'react';

import { toast } from 'sonner';

import { useDeleteAdminListing } from '@/api/queries/cityAdminList';
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
import { useTypedTranslation } from '@/hooks';
import { cn } from '@/lib/utils';

type DeleteActionProps = {
  wrapperClassName?: string;
  iconClassName?: string;
  itemId: number | string;
};

function DeleteAction({
  wrapperClassName,
  iconClassName,
  itemId,
}: DeleteActionProps) {
  const { t } = useTypedTranslation();
  const deleteTile = useDeleteAdminListing();

  const [openHelpDialog, setOpenHelpDialog] = useState(false);

  const openHelpDialogHandler = () => {
    setOpenHelpDialog(true);
  };

  const closeHelpDialog = () => {
    setOpenHelpDialog(false);
  };

  const confirmDelete = () => {
    deleteTile.mutate(itemId, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(data.message);
          closeHelpDialog();
        } else {
          toast.error(data.error);
        }
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });
  };

  return (
    <>
      <button
        type="button"
        className={cn(wrapperClassName)}
        onClick={openHelpDialogHandler}
      >
        <Trash
          aria-label="delete-trash"
          className={cn(
            'cursor-pointer text-red-500 hover:fill-red-500 hover:text-red-500 transition-colors',
            iconClassName
          )}
        />
      </button>
      <Dialog open={openHelpDialog} onOpenChange={setOpenHelpDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-full cursor-pointer">
                <XCircle className="h-5 w-5 text-red-700" />
              </div>
              <DialogTitle className="text-lg font-semibold text-primary.default">
                {t('tile.confirmDelete.heading')}
              </DialogTitle>
            </div>
            <DialogDescription className="text-primary mt-2">
              {t('tile.confirmDelete.message')}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2 mt-6">
            <DialogClose asChild>
              <Button variant="outline">
                {t('tile.confirmDelete.cancelMessage')}
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              loading={deleteTile.isPending}
            >
              {t('tile.confirmDelete.confirmMessage')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DeleteAction;
