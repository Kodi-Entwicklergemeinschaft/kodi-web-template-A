import { format } from 'date-fns';
import { toast } from 'sonner';

import { useDeleteAdminListing, useRestoreAdminListing } from '@/api/queries';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTypedTranslation } from '@/hooks';
import { ROLE_USER_MAP, RoleValue } from '@/lib/constant';
import SwitchRoleAction from '@/pages/CityAdmin/SwitchRoleAction';
// import { selectUserRole } from '@/store/slices/userSlice';
// import { useGlobalStore } from '@/store/useGlobalStore';
type TableRows = {
  id: string;
  email: string;
  role: RoleValue;
  createdAt: string;
  isActive: boolean;
  citiesName: string[];
  firstName: string | null;
  lastName: string | null;
};

type AdminTableProps = {
  tableRows?: TableRows[];
  loading: boolean;
};

function AdminTable({ tableRows = [], loading }: AdminTableProps) {
  const { t } = useTypedTranslation();
  // const userRole = useGlobalStore(selectUserRole);
  const normalizedRows = tableRows.map((row) => ({
    ...row,
    citiesName:
      // Replace KODI with the city name by validating in backend code
      row.citiesName && row.citiesName.length > 0 ? row.citiesName : ['KODI'],
  }));

  const { mutate: disableAdmin } = useDeleteAdminListing();
  const restore = useRestoreAdminListing();

  return (
    <ShacnTable className="border-2 my-4">
      <TableHeader className="bg-secondary rounded-full">
        <TableRow>
          <TableHead className="text-primary text-bold font-bold text-base">
            {t('cityAdministration.table.head.name')}
          </TableHead>
          <TableHead className="text-primary text-bold font-bold text-base ">
            {t('cityAdministration.table.head.email')}
          </TableHead>
          <TableHead className="text-bold font-bold text-base text-center">
            {t('cityAdministration.table.head.role')}
          </TableHead>
          {/* <TableHead className="text-bold font-bold text-base text-center">
            {t('cityAdministration.table.head.cities')}
          </TableHead> */}
          <TableHead className="text-center text-bold font-bold text-base">
            {t('cityAdministration.table.head.createdAt')}
          </TableHead>
          {/* <TableHead className="text-center text-bold font-bold text-base">
            {t('cityAdministration.table.head.registered')}
          </TableHead> */}
          <TableHead className="text-center text-bold font-bold text-base">
            {t('cityAdministration.table.head.actions')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6}>
              <div className="flex justify-center items-center py-10">
                <Spinner className="size-8 text-primary" />
              </div>
            </TableCell>
          </TableRow>
        ) : !normalizedRows.length ? (
          <TableRow>
            <TableCell colSpan={6}>
              <span className="flex justify-center items-center py-10 text-lg font-bold">
                {t('tile.table.noData')}
              </span>
            </TableCell>
          </TableRow>
        ) : (
          normalizedRows.map((rowData) => (
            <TableRow key={rowData.id}>
              <TableCell className="">
                {(rowData.firstName ?? '') + ' ' + (rowData.lastName ?? '')}
              </TableCell>
              <TableCell className="">{rowData.email}</TableCell>
              <TableCell className="text-center">
                {ROLE_USER_MAP[rowData.role]}
              </TableCell>
              {/* <TableCell className="text-center">
                {rowData.citiesName.join(', ')}
              </TableCell> */}
              {/* TODO: Update performance */}
              <TableCell className="text-center">
                {format(new Date(rowData.createdAt), 'MMMM d, yyyy')}
              </TableCell>
              {/* TODO: Add Switcher Like Terminal Proj */}

              {/* <TableCell className="text-center">
                <Switch defaultChecked={rowData.isActive} />
              </TableCell> */}

              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-8">
                  {/* {PermissionsMap[userRole ?? USER_ROLE_MAP.CITIZEN]
                    .canEdit && (
                    <Pencil className="cursor-pointer text-green-500 hover:fill-green-500 hover:text-green-500 transition-colors" />
                  )} */}
                  {/* {PermissionsMap[userRole ?? USER_ROLE_MAP.CITIZEN]
                    .canDelete && <DeleteAction itemId={rowData.id} />} */}

                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <SwitchRoleAction
                            itemId={rowData.id}
                            currentRole={rowData.role}
                            disabled={!rowData.isActive}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>{t('switchRole.title')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Switch
                    checked={rowData.isActive}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        // ENABLE → RESTORE USER
                        restore.mutate(rowData.id, {
                          onSuccess: () => toast.success(t('user.restore')),
                          onError: () => toast.error(t('user.restoreFailed')),
                        });
                      } else {
                        // DISABLE → DELETE USER
                        disableAdmin(rowData.id, {
                          onSuccess: () => toast.success(t('user.disable')),
                          onError: () => toast.error(t('user.disableFailed')),
                        });
                      }
                    }}
                    aria-label="Toggle user enable disable status"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </ShacnTable>
  );
}

export default AdminTable;
