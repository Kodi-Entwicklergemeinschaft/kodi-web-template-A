import { Category } from '@/api/endpoints';

export function flattenCategories(categories: Category[]): Category[] {
  const result: Category[] = [];

  const traverse = (catList: Category[]) => {
    for (const cat of catList) {
      // Push current category without children
      result.push({ ...cat, children: [] });

      // Recursively flatten children
      if (cat.children?.length) {
        traverse(cat.children);
      }
    }
  };

  traverse(categories);
  return result;
}
