import { useQuery } from '@tanstack/react-query';

import { getPosts } from '../endpoints';

export const usePostsQuery = () =>
  useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
