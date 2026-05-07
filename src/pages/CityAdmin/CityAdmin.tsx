import { useState } from 'react';

import { useGetAdminListings } from '@/api/queries/cityAdminList';
import { useTypedTranslation } from '@/hooks';
import { TABLE_PAGE_SIZE } from '@/lib/constant';
import AdminTable from '@/pages/CityAdmin/AdminTable';
import Pagination from '@/shared/Pagination';
function CityAdmin() {
  const { t } = useTypedTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: adminListings,
    isLoading,
    isFetching,
  } = useGetAdminListings({
    page: currentPage,
    limit: TABLE_PAGE_SIZE,
  });

  const rowData =
    adminListings?.success && adminListings.data.users
      ? adminListings.data.users.map((admin) => ({
          id: admin.id,
          firstName: admin.firstName ?? '',
          lastName: admin.lastName ?? '',
          email: admin.email ?? '-',
          role: admin.role,
          createdAt: admin.createdAt,
          isActive: admin.isActive,
          // Replace KODI with the city name by validating in backend code
          citiesName: ['KODI'],
        }))
      : [];
  // const createAdmin = useCreateAdmin();
  // function HandleCreateAdmin({
  //   email,
  //   cities,
  // }: {
  //   email: string;
  //   cities: string[];
  // }) {
  //   createAdmin.mutate(
  //     {
  //       email,
  //       cities,
  //     },
  //     {
  //       onSuccess: (data) => {
  //         if (data.success) {
  //           toast.success(data.message);
  //         } else {
  //           toast.error(data.error);
  //         }
  //       },
  //       onError: (error) => {
  //         console.warn(error.message);
  //       },
  //     }
  //   );
  // }
  return (
    <div className="p-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('cityAdministration.heading')}
          </h1>
          <p className="text-muted-foreground">
            {t('cityAdministration.description')}
          </p>
        </div>
        {/* <PopUp HandleCreateAdmin={HandleCreateAdmin} /> */}
        {/* <Button type="button" onClick={() => setPopupVisible(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('cityAdministration.createAdmin')}
        </Button> */}
      </div>
      <div className="mt-8">
        <AdminTable loading={isLoading || isFetching} tableRows={rowData} />
      </div>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={
          adminListings?.success && !isLoading
            ? adminListings.data?.pages || 0
            : 0
        }
      />
    </div>
  );
}

export default CityAdmin;
