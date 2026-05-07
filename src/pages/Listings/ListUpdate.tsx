import { useParams } from 'react-router-dom';

import { ListData } from '@/api/endpoints';
import { useGetSelectedListing } from '@/api/queries';
import { Spinner } from '@/components/ui/spinner';
import ListFormUpload from '@/pages/Listings/ListFormUpload';
import { ListUploadForm } from '@/schema/listingUpload';

function ListUpdate() {
  const { listingId } = useParams();

  const {
    data: selectedListingData,
    isLoading,
    isFetching,
  } = useGetSelectedListing(listingId);

  if (listingId && isFetching && isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="size-8" />
      </div>
    );
  return (
    <ListFormUpload
      selectedListingData={
        selectedListingData?.success
          ? (selectedListingData.data as ListUploadForm)
          : undefined
      }
      listData={
        selectedListingData?.success
          ? (selectedListingData.data as ListData)
          : undefined
      }
      listingId={listingId}
    />
  );
}

export default ListUpdate;
