import { ICategoryCreateResponse, ICategoryPost, ICategoryPostResponse, ICategoryResponse, IUpdateCategory } from 'src/@types/category';
import { iFilterPagination } from 'src/@types/filter';
import { iNewProductResponse, iProductImage, IProductServicePost, IProductServiceResponse, iUpdateProduct } from 'src/@types/productService';
import { apiCatalog } from '../utils/axios';

export const getCategory = async ({
  itensPerPage,
  page,
  filter,
}: iFilterPagination): Promise<ICategoryCreateResponse> => {
  const params = new URLSearchParams();
  params.set('filter', String(filter));
  params.set('page', String(page + 1));
  params.set('itensPerPage', String(itensPerPage));
  const response = await apiCatalog.get('/category/get', { params });
  return response.data.data;
};

export const postCategory = async ({
  description,
  category_parent_id,
  created_by,
}: ICategoryPost): Promise<ICategoryPostResponse> => {
  const response = await apiCatalog.post('/category/create', {
    description,
    category_parent_id,
    created_by,
  });
  return response.data.data;
};

export const putCategory = async (categoryUpdate: IUpdateCategory): Promise<ICategoryCreateResponse> => {
  const response = await apiCatalog.put('/category/update', categoryUpdate);
  return response.data.data;
};

export const getCategoryById = async (category_id: string): Promise<ICategoryResponse[]> => {
  const response = await apiCatalog.get(`/category/get/${category_id}`);
  return response.data?.data.categories;
};

export const getproductService = async ({
  itensPerPage,
  page,
  filter,
}: iFilterPagination): Promise<IProductServiceResponse> => {
  const params = new URLSearchParams();
  params.set('itensPerPage', String(itensPerPage));
  params.set('page', String(page + 1));
  params.set('filter', String(filter));
  const response = await apiCatalog.get('/product/get', {params});
  return response.data.data;
};

export const postProductService = async ({
  name,
  description,
  category,
  minimum_price,
  note,
  created_by,
  type,
  admin_id
}: IProductServicePost): Promise<iNewProductResponse> => {
  const response = await apiCatalog.post('/product/create', {
    name,
    description,
    category,
    minimum_price,
    note,
    created_by,
    type,
    admin_id
  });
  return response.data.data;
};

export const postProductImage = async (data: iProductImage): Promise<iNewProductResponse> => {
  const formData = new FormData();
  formData.append('Image', data.Image);
  formData.append('product_id', data.product_id);

  const response = await apiCatalog.post('/product/image/create', formData);
  return response.data.data;
};

export const putProductService = async (
  productUpdate: iUpdateProduct
): Promise<iNewProductResponse> => {
  const response = await apiCatalog.put('/product/update', productUpdate);
  return response.data.data;
};

export const getProductById = async (product_id: string): Promise<iNewProductResponse> => {
  const response = await apiCatalog.get(`/product/get/${product_id}`);
  return response.data?.data;
};
