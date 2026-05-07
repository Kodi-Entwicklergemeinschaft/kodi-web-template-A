import apiRequest from '../apiRequest';

export type CreateAdminRes = {
  status: string;
  message: string;
};

export type AdminForm = {
  email: string;
  cities: string[];
};

export const createAdmin = async (userFormData: AdminForm) => {
  return await apiRequest<CreateAdminRes, AdminForm>({
    url: 'create-admin',
    method: 'POST',
    data: userFormData,
  });
};
