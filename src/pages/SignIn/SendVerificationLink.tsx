import { useState } from 'react';

import { toast } from 'sonner';

import { useResetPassword } from '@/api/queries/resetPassword';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useTypedTranslation } from '@/hooks';
import { REGEX } from '@/lib/regexConstant';

type SendVerificationLinkProps = {
  onCancel: () => void;
};

function SendVerificationLink({ onCancel }: SendVerificationLinkProps) {
  const { t } = useTypedTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const { mutate: sendResetLink, isPending } = useResetPassword();
  const a = t('registration.form.email.error.invalidMail');
  if (error && error !== a) {
    setError(a);
  }
  const handleSend = () => {
    if (!REGEX.EMAIL.test(email)) {
      setError(t('registration.form.email.error.invalidMail'));
      return;
    }

    setError('');

    sendResetLink(
      { email },
      {
        onSuccess: (data) => {
          if (data.success) {
            toast.success(data.message);
          }
        },
        onError: (error) => {
          console.warn(error.message);
        },
      }
    );
  };

  return (
    <div>
      <Separator className="my-4 " />

      <div>
        <Input
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`border p-3 h-12 shadow-md duration-300 rounded-lg focus:border-primary focus:ring-primary ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          disabled={isPending}
          variant={'default'}
          className="text-base w-full"
          onClick={handleSend}
        >
          {t('sendLink')}
        </Button>
        <Button
          variant={'outline'}
          onClick={onCancel}
          className="w-full hover:bg-red-500 border-red-500 text-base"
        >
          {t('cancel')}
        </Button>
      </div>
    </div>
  );
}

export default SendVerificationLink;
