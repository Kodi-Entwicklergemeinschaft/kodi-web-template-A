import { CircleUserRound, Pencil } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { ListingDataResponse } from '@/api/endpoints';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import {
  Table as ShacnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTypedTranslation } from '@/hooks';
import { USER_ROLE_MAP } from '@/lib/constant';
import { normalizeRichTextHtml } from '@/lib/richText';
import DeleteAction from '@/pages/Listings/DeleteAction';
import ROUTES from '@/route/routesConstant';
import { PermissionsMap } from '@/shared/RoleBasedPermission';
import { selectUserRole } from '@/store/slices/userSlice';
import { useGlobalStore } from '@/store/useGlobalStore';

type TableRows = ListingDataResponse['items'];

type ListTableProps = {
  tableRows: TableRows;
  loading: boolean;
  tabIndex: number;
};

function ListTable({ tableRows, loading, tabIndex }: ListTableProps) {
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const userRole = useGlobalStore(selectUserRole);
  return (
    <ShacnTable className="border-2 my-4">
      <TableHeader className="bg-secondary rounded-full">
        <TableRow>
          <TableHead className="text-primary text-bold font-bold text-base text-center">
            {t('listing.table.head.list')}
          </TableHead>
          <TableHead className="text-bold font-bold text-base text-center">
            {t('listing.table.head.description')}
          </TableHead>
          <TableHead className="text-center text-bold font-bold text-base">
            {t('listing.table.head.actions')}
          </TableHead>
          {/* <TableHead className="text-bold font-bold text-base text-center">
            {t('listing.table.head.status')}
          </TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={4}>
              <div className="flex justify-center items-center py-10">
                <Spinner className="size-8 text-primary" />
              </div>
            </TableCell>
          </TableRow>
        ) : !tableRows.length ? (
          <TableRow>
            <TableCell colSpan={4}>
              <span className="flex justify-center items-center py-10 text-lg font-bold">
                {t('tile.table.noData')}
              </span>
            </TableCell>
          </TableRow>
        ) : (
          tableRows.map((rowData) => (
            <TableRow key={rowData.id}>
              <TableCell className="font-medium max-w-40 md:max-w-6">
                <div className="flex flex-row items-center gap-5">
                  <Avatar>
                    <AvatarImage
                      src={
                        rowData.heroImageUrl?.concat(
                          `?cb=${new Date().getTime()}`
                        ) ?? ''
                      }
                      alt={rowData.slug.concat('-bg-image')}
                    />
                    <AvatarFallback>
                      <CircleUserRound className="text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <strong className="truncate block overflow-hidden text-ellipsis whitespace-nowrap">
                    {rowData.title}
                  </strong>
                </div>
              </TableCell>
              {/* <TableCell className="text-center">
                {rowData.isActive ? t('tile.active') : t('tile.inactive')}
              </TableCell> */}
              <TableCell className="text-center max-w-8">
                <div
                  className="truncate block overflow-hidden text-ellipsis whitespace-nowrap"
                  dangerouslySetInnerHTML={{
                    __html: normalizeRichTextHtml(rowData.summary),
                  }}
                />
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-8">
                  {PermissionsMap[userRole ?? USER_ROLE_MAP.CITY_ADMIN]
                    .canEdit && (
                    <Pencil
                      className="cursor-pointer text-green-500 hover:fill-green-500 hover:text-green-500 transition-colors"
                      onClick={() => {
                        const updateListingRoute = ROUTES.UpdateListing;
                        const r = updateListingRoute.replace(
                          ':listingId',
                          String(rowData.id)
                        );
                        navigate(`${ROUTES.Listings}/${r}`);
                      }}
                    />
                  )}
                  {PermissionsMap[userRole ?? USER_ROLE_MAP.CITY_ADMIN]
                    .canDelete &&
                    tabIndex != 2 && <DeleteAction itemId={rowData.id} />}
                </div>
              </TableCell>
              {/* <TableCell className="w-full flex justify-center">
                <Switch
                  defaultChecked={rowData.isArchived}
                  onCheckedChange={() => handleToggleChange()}
                />
              </TableCell> */}
            </TableRow>
          ))
        )}
      </TableBody>
    </ShacnTable>
  );
}

export default ListTable;
