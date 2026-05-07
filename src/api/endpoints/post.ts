import apiRequest from '../apiRequest';
type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type GetPostsResponse = Post[];

export const getPosts = async () => {
  return await apiRequest<GetPostsResponse>({
    url: 'posts',
  });
};
