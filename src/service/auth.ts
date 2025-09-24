import {
  ChangePasswordParams, ForgotPasswordParams, ICreateUser, iUpdateUser, IUser, IUserResponse, ResetPasswordParams
} from 'src/@types/user';
import { api } from '../utils/axios';

export const createSession = async (email: string, password: string): Promise<IUser> => {
  const response = await api.post('/session/create', {
    roleName: 1,
    email,
    password,
  });
  return response.data.data;
};

export const createUser = async (user: ICreateUser): Promise<IUserResponse> => {
  const response = await api.post('/user/create', user);
  return response.data.data;
};

export const deleteUser = async (user_id: string[] | string): Promise<boolean> => {
  const response = await api.delete('/user/delete', { data: typeof user_id === 'string' ?  [user_id] : [...user_id] });
  return response.data.data;
};

export const updateUser = async (user: iUpdateUser): Promise<IUserResponse> => {
  const formData = new FormData();
  formData.append('Email', String(user.Email));
  formData.append('Fullname', String(user.Fullname));
  formData.append('Phone', String(user.Phone));
  formData.append('Document', String(user.Document));
  formData.append('Active', String(user.Active));
  formData.append('User_Id', String(user.User_id));
  formData.append('Avatar', user.Avatar);
  formData.append('Phone_verified', String(user.Phone_verified));

  const response = await api.put('/user/update', formData);

  return response.data.data;
};

export const forgotPassword = async ({ token, email }: ForgotPasswordParams) => {
  const response = await api.get('/user/forgot-password', {
    params: {
      email,
      userRole: 1,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const resetPassword = async ({
  token,
  password,
  passwordConfirmation,
}: ResetPasswordParams) => {
  const response = await api.post(
    '/user/reset-password',
    {
      password,
      passwordConfirmation,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

export const ChangePassword = async ({
  token,
  old_password,
  password,
  passwordConfirmation,
}: ChangePasswordParams) => {
  const response = await api.post(
    '/user/change-password',
    {
      old_password,
      password,
      passwordConfirmation,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data;
};
