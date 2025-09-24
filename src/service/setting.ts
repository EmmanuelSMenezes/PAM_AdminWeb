import {
  IFeeAdminResponse, IFeeAdminUpdate, IStyleCreate, IStyleResponse
} from 'src/@types/setting';
import { api } from '../utils/axios';

export const interestRateSettingGet = async (admin_id: string): Promise <IFeeAdminResponse> => {
  const response = await api.get(`/settings/fee/get/admin/${admin_id}`);
  return response.data.data;
}

export const interestRateSettingUpdate = async ({interest_rate_setting_id, admin_id, service_fee, card_fee}: IFeeAdminUpdate): Promise<IFeeAdminResponse> => {
  const response = await api.put('/settings/fee/update',  {interest_rate_setting_id, admin_id, service_fee, card_fee});
  return response.data.data;
}


export const stylePost = async (data: IStyleCreate): Promise<IStyleResponse> => {
  const formData = new FormData();
  formData.append('Logo', data.logo);
  formData.append('Contrasttext', data.contrasttext);
  formData.append('Darker', data.darker);
  formData.append('Dark', data.dark);
  formData.append('Main', data.main);
  formData.append('Light', data.light);
  formData.append('Lighter', data.lighter);
  formData.append('Admin_id', data.admin_id);

  const response = await api.post('/settings/style/create', formData);
  return response.data.data;
};

export const stylePut = async (data: IStyleCreate): Promise<IStyleResponse> => {
  const formData = new FormData();
  formData.append('Logo', data.logo);
  formData.append('Contrasttext', data.contrasttext);
  formData.append('Darker', data.darker);
  formData.append('Dark', data.dark);
  formData.append('Main', data.main);
  formData.append('Light', data.light);
  formData.append('Lighter', data.lighter);
  formData.append('Admin_id', data.admin_id);
  formData.append('Url', data.url);

  const response = await api.put('/settings/style/update', formData);
  return response.data.data;
};

export const styleGet = async (admin_id: string): Promise <any> =>  {
  const response = await api.get(`/settings/style/get/admin/${admin_id}`);
  return response.data.data;
};