import axios from "axios";
import { HOST_API_CATALOG, HOST_API_COMMUNICATION, HOST_API_KEY, HOST_API_ORDER, HOST_API_PARTNER, HOST_API_CONSUMER, HOST_API_BILLING } from "src/config-global";

export const api = axios.create({ baseURL: HOST_API_KEY });
export const apiPartner = axios.create({ baseURL: HOST_API_PARTNER });
export const apiCatalog = axios.create({ baseURL: HOST_API_CATALOG });
export const apiCommunication = axios.create({ baseURL: HOST_API_COMMUNICATION });
export const apiOrder = axios.create({ baseURL: HOST_API_ORDER });
export const apiConsumer = axios.create({ baseURL: HOST_API_CONSUMER });
export const apiBilling = axios.create({ baseURL: HOST_API_BILLING });


const connections = [api, apiPartner, apiCatalog, apiCommunication, apiOrder, apiConsumer, apiBilling];

connections.forEach(conn => {
  conn.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken')
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    }, (error) => Promise.reject(error));
  
  conn.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
  );
});