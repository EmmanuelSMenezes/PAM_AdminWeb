import axios from 'axios';
// config
import { HOST_API_KEY, HOST_API_PARTNER, HOST_API_CATALOG, HOST_API_ORDER } from '../config-global';

// ----------------------------------------------------------------------

export const api = axios.create({ baseURL: HOST_API_KEY });

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export const apiPartner = axios.create({ baseURL: HOST_API_PARTNER });
apiPartner.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

apiPartner.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export const apiOrder = axios.create({ baseURL: HOST_API_ORDER });

apiOrder.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);


export const apiCatalog = axios.create({ baseURL: HOST_API_CATALOG });
apiCatalog.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, (error) => Promise.reject(error));

apiCatalog.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);
