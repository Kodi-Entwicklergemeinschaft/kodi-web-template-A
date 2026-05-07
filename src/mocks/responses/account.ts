import { ApiErrorResponse, ApiSuccessResponse } from '@/api/api.type';
import { PersonalInfoFormType } from '@/schema/profile';
type SuccessResponse = ApiSuccessResponse<PersonalInfoFormType>;

const ProfileSuccessData: SuccessResponse = {
  success: true,
  data: {
    firstName: 'John Doe',
    lastName: 'johndoe',
    email: 'johndoe@example.com',
    // phoneNumber: '1234567890',
    // description: 'This is a sample description',
    // website: '',
    // metadata: [
    //   {
    //     link: 'https://example.com',
    //     name: 'google',
    //     id: 1,
    //   },
    // ],
  },
  message: 'Successfully Retrieved User Profile',
};

const ProfileErrorResponse: ApiErrorResponse = {
  success: false,
  error: 'Failed to retrieve user profile',
  code: 'INTERNAL_SERVER_ERROR',
  status: 500,
};

type UpdateProfileSuccessResponse = ApiSuccessResponse<unknown>;
const UpdateProfileSuccess: UpdateProfileSuccessResponse = {
  data: undefined,
  message: 'Successfully Updated',
  success: true,
  status: 200,
};

export { ProfileErrorResponse, ProfileSuccessData, UpdateProfileSuccess };
