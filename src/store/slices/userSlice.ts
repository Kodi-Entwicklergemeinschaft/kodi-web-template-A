import { StateCreator } from 'zustand';

import { RoleValue } from '@/lib/constant';

type UserSliceState = {
  id: string;
  email: string;
  username: string;
  role?: RoleValue;
  userType?: string;
  firstName: string;
  lastName: string;
};

type UserSliceActions = {
  setUserData: (userData: UserSliceState) => void;
  resetUserData: () => void;
};

export type UserSlice = UserSliceState & UserSliceActions;

const INITIAL_DATA: UserSliceState = {
  id: '',
  email: '',
  username: '',
  role: undefined,
  userType: '',
  firstName: '',
  lastName: '',
};
const createUserSlice: StateCreator<UserSlice> = (set) => ({
  ...INITIAL_DATA,
  resetUserData: () => {
    set(INITIAL_DATA);
  },
  setUserData: (userData) => {
    set(userData);
  },
});

// Selectors
export const selectUserId = (state: UserSlice) => state.id;
export const selectUserEmail = (state: UserSlice) => state.email;
export const selectUserUsername = (state: UserSlice) => state.username;
export const selectUserRole = (state: UserSlice) => state.role;
export const selectUserType = (state: UserSlice) => state.userType;
export const selectUserFirstName = (state: UserSlice) => state.firstName;
export const selectUserLastName = (state: UserSlice) => state.lastName;

// Actions
export const resetUserDataAction = (state: UserSlice) => state.resetUserData;
export const setUserDataAction = (state: UserSlice) => state.setUserData;

export default createUserSlice;
