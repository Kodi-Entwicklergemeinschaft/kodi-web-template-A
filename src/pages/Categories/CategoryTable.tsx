import { Pencil } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { CategoryData } from '@/api/endpoints/categories';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTypedTranslation } from '@/hooks';
import { normalizeRichTextHtml } from '@/lib/richText';
import CategoryDeleteAction from '@/pages/Categories/CategoryDeleteAction';
import ROUTES from '@/route/routesConstant';

interface CategoryTableProps {
  tableRows: CategoryData[];
  loading: boolean;
  handleCustomEdit?: (id: string) => void;
  showDeleteAction?: boolean;
}

function CategoryTable({
  tableRows,
  loading,
  handleCustomEdit,
  showDeleteAction = true,
}: CategoryTableProps) {
  const { t } = useTypedTranslation();
  const navigate = useNavigate();

  const handleEdit = (id: string) => {
    const updateCategoryUrl = ROUTES.UpdateCategory.replace(':categoryId', id);
    // Navigate to Create Category page with query param id for edit
    navigate(`${ROUTES.Categories}/${updateCategoryUrl}`);
  };

  if (loading) {
    return (
      <div className="w-full space-y-4 mt-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (tableRows?.length === 0) {
    return (
      <div className="w-full mt-8 text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">
          {t('category.listing.noCategories')}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-4 border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('category.listing.table.name')}</TableHead>
            <TableHead>{t('category.listing.table.description')}</TableHead>
            <TableHead>{t('category.listing.table.displayOrder')}</TableHead>
            {/* <TableHead className="text-center">
              {t('category.listing.table.type')}
            </TableHead> */}
            {/* <TableHead className="text-center">
              {t('category.listing.table.displayOrder')}
            </TableHead> */}
            <TableHead className="text-center">
              {t('category.listing.table.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableRows?.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="max-w-md truncate">
                <div
                  className="truncate block overflow-hidden text-ellipsis whitespace-nowrap"
                  dangerouslySetInnerHTML={{
                    __html: normalizeRichTextHtml(category.description || '-'),
                  }}
                />
              </TableCell>
              <TableCell className="text-center text-lg">
                {category.cityCategoryDisplayOrder ?? 0}
              </TableCell>
              {/* <TableCell className="text-center">
                {category.type ?? '-'}
              </TableCell> */}
              {/* <TableCell className="text-center">
                {category.displayOrder ?? 0}
              </TableCell> */}
              <TableCell className="text-center">
                <div className="flex justify-center gap-6">
                  <Pencil
                    className="cursor-pointer text-green-500 hover:fill-green-500 hover:text-green-500 transition-colors"
                    onClick={() =>
                      handleCustomEdit
                        ? handleCustomEdit(category.id)
                        : handleEdit(category.id)
                    }
                  />
                  {showDeleteAction && (
                    <CategoryDeleteAction categoryId={category.id} />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default CategoryTable;
