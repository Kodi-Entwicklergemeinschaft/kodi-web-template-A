import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { useGetCityList } from '@/api/queries';
import { Spinner } from '@/components/ui/spinner';

import NewForm from './Form';

function CreateCityCategory() {
  const { t } = useTranslation();

  const { data: cityListData, isLoading, isFetching } = useGetCityList();

  const fetchedCityId = useMemo(() => {
    if (cityListData?.success && cityListData?.data?.items?.length) {
      return cityListData.data.items[0].id;
    } else {
      return;
    }
  }, [cityListData]);

  if (isFetching || isLoading) return <Spinner className="size-8" />;

  if (!fetchedCityId) {
    return <p className="text-center">{t('category.listing.noCity')}</p>;
  }

  return (
    <div>
      <NewForm cityId={fetchedCityId} editMode={false} />
    </div>
  );
}

export default CreateCityCategory;
