import { Trash, XCircle } from 'lucide-react';
import { useState } from 'react';

import { toast } from 'sonner';

import { useDeleteCategory } from '@/api/queries';
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

type CategoryDeleteActionProps = {
  wrapperClassName?: string;
  iconClassName?: string;
  categoryId: string;
};

function CategoryDeleteAction({
  categoryId,
  wrapperClassName,
  iconClassName,
}: CategoryDeleteActionProps) {
  const { t } = useTypedTranslation();
  const deleteCategory = useDeleteCategory();
  const [open, setOpen] = useState(false);

  const confirmDelete = () => {
    deleteCategory.mutate(categoryId, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success(
            response.message || t('category.listing.deleteSuccess')
          );
          setOpen(false);
        } else {
          toast.error(response.error);
        }
      },
      onError: (error) => {
        toast.error(error.message || t('category.listing.deleteError'));
      },
    });
  };

  return (
    <>
      <button
        type="button"
        className={cn(wrapperClassName)}
        onClick={() => setOpen(true)}
      >
        <Trash
          aria-label="delete-trash"
          className={cn(
            'cursor-pointer text-red-500 hover:fill-red-500 hover:text-red-500 transition-colors',
            iconClassName
          )}
        />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-full cursor-pointer">
                <XCircle className="h-5 w-5 text-red-700" />
              </div>
              <DialogTitle className="text-lg font-semibold text-primary.default">
                {t('category.listing.confirmDelete.heading')}
              </DialogTitle>
            </div>
            <DialogDescription className="text-primary mt-2">
              {t('category.listing.confirmDelete.message')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-6">
            <DialogClose asChild>
              <Button variant="outline">
                {t('category.listing.confirmDelete.cancelMessage')}
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              loading={deleteCategory.isPending}
            >
              {t('category.listing.confirmDelete.confirmMessage')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CategoryDeleteAction;
