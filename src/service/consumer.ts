import { IConsumerGet } from 'src/@types/consumer';
import { apiConsumer } from './api';

export const consumerAllGet = async (): Promise <IConsumerGet> => {
  const response = await apiConsumer.get(`/consumer/all`);
  return response.data.data;
}