import { iFilterPagination, IOrderDetails, IOrderResponseList } from 'src/@types/order';
import { apiOrder } from './api';


export const orderGet = async ({admin_id, status, consumer, partner, page, itensPerPage, start_date, end_date, order_number}: iFilterPagination): Promise<IOrderResponseList> => {
  const params = new URLSearchParams();
  params.set('status', String(status));
  params.set('consumer', String(consumer));
  params.set('partner', String(partner));
  params.set('page', String(page + 1));
  params.set('itensPerPage', String(itensPerPage));
  params.set('start_date', String(start_date));
  params.set('end_date', String(end_date));
  params.set('order_number', String(order_number));
  const response = await apiOrder.get(`/order/byadmin/${admin_id}`, {params});
  return response.data.data;
}

export const orderDetailsGet = async (order_id: string): Promise <IOrderDetails> => {
  const response = await apiOrder.get(`/order/details/${order_id}`);
  return response.data.data;
}