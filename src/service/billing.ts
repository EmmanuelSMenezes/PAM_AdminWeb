import { IPaymentResponse, IDeliveryResponse, IPagination, IDeliveryListResponse, IPaymentListResponse, IPaymentUpdate, IDeliveryUpdate } from 'src/@types/billing';
import { apiBilling } from './api';

export const paymentCreate = async (description: string): Promise <IPaymentResponse> => {
  const response = await apiBilling.post('/payment/create', {description});
  return response.data.data;
}

export const paymentGet = async ({ page, itensPerPage}: IPagination): Promise<IPaymentListResponse> => {
  const params = new URLSearchParams();
  params.set('page', String(page + 1));
  params.set('itensPerPage', String(itensPerPage));
  const response = await apiBilling.get(`/payment`, {params});
  return response.data.data;
}

export const paymentUpdate = async (data: IPaymentUpdate): Promise<IPaymentResponse> => {
  const response = await apiBilling.put('/payment/active', data);
  return response.data.data;
};


export const deliveryCreate = async (name: string): Promise <IDeliveryResponse> => {
  const response = await apiBilling.post('/delivery/create', {name});
  return response.data.data;
}

export const deliveryGet = async ({ page, itensPerPage}: IPagination): Promise<IDeliveryListResponse> => {
  const params = new URLSearchParams();
  params.set('page', String(page + 1));
  params.set('itensPerPage', String(itensPerPage));
  const response = await apiBilling.get(`/delivery`, {params});
  return response.data.data;
}

export const deliveryUpdate = async (data: IDeliveryUpdate): Promise<IDeliveryResponse> => {
  const response = await apiBilling.put('/delivery/active', data);
  return response.data.data;
};