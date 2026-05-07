import { ReactNode, useState } from 'react';

import { useTranslation } from 'react-i18next';

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
import { cn } from '@/lib/utils';

type HelpDialogProps = {
  btnName: ReactNode;
  btnClassName?: string;
};

function HelpDialog({ btnName, btnClassName }: HelpDialogProps) {
  const { t } = useTranslation();

  const [openHelpDialog, setOpenHelpDialog] = useState(false);

  const openHelpDialogHandler = () => {
    setOpenHelpDialog(true);
  };

  const closeHelpDialog = () => {
    setOpenHelpDialog(false);
  };

  return (
    <>
      <Button
        type="button"
        aria-label="helpDialogBox"
        variant={'outline'}
        onClick={openHelpDialogHandler}
        className={cn(
          'border-0 text-base h-5 hover:text-slate-600 bg-inherit p-0 hover:bg-transparent text-xs',
          btnClassName
        )}
      >
        {btnName}
      </Button>
      <Dialog open={openHelpDialog} onOpenChange={closeHelpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex flex-col">
              <span className="font-bold text-blue-600 text-xl text-center mb-6">
                {t('anleitung')}
              </span>
              <span className="font-bold text-blue-600 text-lg text-center mb-6">
                {t('subtitle')}
              </span>
            </DialogTitle>
            <DialogDescription asChild>
              <div>
                <p
                  className={cn(
                    'mb-6',
                    'text-gray-800',
                    'dark:text-foreground'
                  )}
                  dangerouslySetInnerHTML={{ __html: t('step1') }}
                ></p>
                <p
                  className={cn(
                    'mb-6',
                    'text-gray-800',
                    'dark:text-foreground'
                  )}
                  dangerouslySetInnerHTML={{ __html: t('step2') }}
                ></p>
                <p
                  className={cn(
                    'mb-6',
                    'text-gray-800',
                    'dark:text-foreground'
                  )}
                  dangerouslySetInnerHTML={{ __html: t('step3') }}
                ></p>
                <p
                  className={cn(
                    'mb-6',
                    'text-gray-800',
                    'dark:text-foreground'
                  )}
                  dangerouslySetInnerHTML={{ __html: t('step4') }}
                ></p>
                <p className="font-bold text-blue-600 text-lg text-center mb-6">
                  <strong>{t('thankYou')}</strong>
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="!flex !justify-center">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="w-1/2 items-center  text-center"
              >
                {t('Close')}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default HelpDialog;
