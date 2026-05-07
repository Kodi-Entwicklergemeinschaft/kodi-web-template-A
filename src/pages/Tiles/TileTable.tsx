import { CircleUserRound, Pencil } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { EditTileUploadPayload } from '@/api/endpoints';
import { TileListingDataResponse } from '@/api/endpoints/tileListings';
import { useEditTileUpload } from '@/api/queries/tileUpload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
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
import DeleteAction from '@/pages/Tiles/DeleteAction';
import { PermissionsMap } from '@/shared/RoleBasedPermission';
import { selectUserRole } from '@/store/slices/userSlice';
import { useGlobalStore } from '@/store/useGlobalStore';

type TableRows = TileListingDataResponse['items'];

type TileTableProps = {
  tableRows: TableRows;
  loading: boolean;
};

function TileTable({ tableRows, loading }: TileTableProps) {
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const editTile = useEditTileUpload();
  const userRole = useGlobalStore(selectUserRole);
  const handleToggleChange = (id: string, rowData: EditTileUploadPayload) => {
    editTile.mutate(
      {
        tileId: id,
        payload: { isActive: !rowData.isActive },
      },
      {
        onSuccess: () => {
          if (rowData.isActive)
            toast.success(t('tile.table.head.tile') + ' ' + t('tile.inactive'));
          else
            toast.success(t('tile.table.head.tile') + ' ' + t('tile.active'));
        },
      }
    );
  };
  return (
    <ShacnTable className="border-2 my-4">
      <TableHeader className="bg-secondary rounded-full">
        <TableRow>
          <TableHead className="text-primary text-bold font-bold text-base text-center w-40">
            {t('tile.table.head.tile')}
          </TableHead>
          <TableHead className="text-bold font-bold text-base text-center">
            {t('tile.table.head.description')}
          </TableHead>
          <TableHead className="text-center text-bold font-bold text-base">
            {t('tile.table.head.displayOrder')}
          </TableHead>
          <TableHead className="text-center text-bold font-bold text-base">
            {t('tile.table.head.actions')}
          </TableHead>
          <TableHead className="text-bold font-bold text-base text-center">
            {t('tile.table.head.status')}
          </TableHead>
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
                        rowData.backgroundImageUrl?.concat(
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
                    {rowData.header}
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
                    __html: normalizeRichTextHtml(rowData.description),
                  }}
                />
              </TableCell>
              <TableCell className="text-center text-lg">
                {rowData.displayOrder}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-8">
                  {PermissionsMap[userRole ?? USER_ROLE_MAP.CITY_ADMIN]
                    .canEdit && (
                    <Pencil
                      className="cursor-pointer text-green-500 hover:fill-green-500 hover:text-green-500 transition-colors"
                      onClick={() => navigate(`/tiles/upload/${rowData.id}`)}
                    />
                  )}
                  {PermissionsMap[userRole ?? USER_ROLE_MAP.CITY_ADMIN]
                    .canDelete && <DeleteAction itemId={rowData.id} />}
                </div>
              </TableCell>
              <TableCell className="w-full flex justify-center">
                <Switch
                  defaultChecked={rowData.isActive}
                  onCheckedChange={() =>
                    handleToggleChange(rowData.id, rowData)
                  }
                  aria-label="Toggle active status"
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </ShacnTable>
  );
}

export default TileTable;
