import {
  ICreatePartner,
  IPartner,
  IPartnerById,
  IUpdatePartner,
  IResponsePartner,
  IPaginations
} from 'src/@types/partner';
import { iFilterPagination } from 'src/@types/filter';
import { apiPartner } from '../utils/axios';

export const createPartner = async (partner: ICreatePartner): Promise<IResponsePartner> => {
  const response = await apiPartner.post('/partner/create', partner);
  return response.data.data;
};

export const updatePartner = async (partner: IUpdatePartner): Promise<IResponsePartner> => {
  const response = await apiPartner.put('/partner/update', partner);
  return response.data.data;
};

export const deletePartner = async (id: string[]): Promise<boolean> => {
  const response = await apiPartner.delete(`/partner/delete`, { data: id });
  return response.data.data;
};

export const inactiveMassPartner = async (id: string[]): Promise<boolean> => {
  const response = await apiPartner.put('/partner/massinactive', id);
  return response.data.data;
};

export const getPartnerList = async ({ 
  filter,
  page,
  itensPerPage }: iFilterPagination): Promise<{pagination: IPaginations, partners: IPartner[]}> => {
  const params = new URLSearchParams();
  params.set('filter', String(filter));
  params.set('page', String(page + 1));
  params.set('itensPerPage', String(itensPerPage));
  const response = await apiPartner.get(`/partner`, { params });
  return response.data?.data;
};
export const getPartnerById = async (user_id: string): Promise<IPartnerById> => {
  const params = new URLSearchParams();
  params.set('id', String(user_id));
  console.log(params, 'params')
  const response = await apiPartner.get(`/partner/partnerby/${ user_id }`);
  return response.data?.data;
};
