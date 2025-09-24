import { CustomFile } from "src/components/upload";

export interface IProductServicePost {
    name: string;
    description: string;
    category: ICategoryPost[];
    minimum_price: string;
    note: string;
    type: string;
    admin_id: string;
    created_by: string;
  }
  
  export interface ICategoryPost {
    category_id: string;
    category_parent_id: string;
  }
  

export interface iNewProductResponse {
  product: Product
}

export interface Product {
  product_id: string
  identifier: number
  name: string
  description: string
  note: string
  minimum_price: number
  active: boolean
  type: string
  categories: Category[]
  admin_id: string
  url: string
  created_by: string
  created_at: string
  updated_by: string
  updated_at: string
}

export interface Category {
  category_id: string
  identifier: number
  description: string
  category_parent_name: string
  category_parent_id: string
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
  active: boolean
}

export interface Paginations {
  totalRows: number;
  totalPages: number;
}

export interface iProductImage {
  product_id: string,
  Image: string | CustomFile;
}

export interface iUpdateProduct {
  product_id?: string;
  name: string;
  type: string;
  description: string;
  category: iCategoryUpdate[];
  minimum_price: number | string;
  note: string;
  active: boolean;
  updated_by: string;
}

export interface iCategoryUpdate {
  category_id: string;
  category_parent_id: string;
}

// *******************************____________________**********************************


export interface IProductServiceResponse {
  products: IProductResponse[];
  pagination: Pagination;
}

export interface IProductResponse {
  product_id: string;
  identifier: number;
  name: string;
  description: string;
  note: string;
  minimum_price: number;
  active: boolean;
  type: string;
  categories: ICategoryResponse[];
  admin_id: string;
  url: string;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export interface ICategoryResponse {
  category_id: string;
  identifier: number;
  description: string;
  category_parent_name: string;
  category_parent_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  active: boolean;
}

export interface Pagination {
  totalRows: number;
  totalPages: number;
}


