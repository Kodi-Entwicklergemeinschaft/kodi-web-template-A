import { useTermsAndConditions } from '@/api/queries/termsAndCondition';
import { Spinner } from '@/components/ui/spinner';
import { useTypedTranslation } from '@/hooks';
import LanguageSelector from '@/shared/LanguageSelector';
import ThemeSwitcher from '@/shared/ThemeSwitcher';

function TermsConditions() {
  const { t } = useTypedTranslation();
  const { data: termsAndData, isLoading, isFetching } = useTermsAndConditions();

  return (
    <>
      <div className="w-full flex justify-end p-3 space-x-4">
        <ThemeSwitcher />
        <LanguageSelector />
      </div>
      {isLoading || isFetching ? (
        <div className="flex justify-center items-center h-32">
          <Spinner />
        </div>
      ) : !termsAndData?.success ? (
        <p className="text-center">{t('termsConditions.noData')}</p>
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: termsAndData.data.content }}
          className="p-2 rich-text-content"
        />
      )}
    </>
  );
}

export default TermsConditions;
