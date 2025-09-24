export interface IPaymentResponse {
  payment_options_id: string;
  identifier: number;
  description: string;
  active: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export interface IPaymentListResponse {
  payments: IPayment[];
  pagination: Pagination;
}

export interface IPayment {
  payment_local_name: string;
  payment_options_id: string;
  identifier: number;
  description: string;
  active: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export interface IPaymentUpdate {
  payment_options_id: string;
  active: boolean;
}

// *******_____________________________________ ********** __________________________________________********

export interface IDeliveryResponse {
  delivery_option_id: string;
  name: string;
  active: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export interface IDeliveryListResponse {
  delivery_options: IDeliveryOption[];
  pagination: Pagination;
}

export interface IDeliveryOption {
  delivery_option_id: string;
  name: string;
  active: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export interface Pagination {
  totalRows: number;
  totalPages: number;
}

export interface IPagination {
  page: number;
  itensPerPage: number;
  filter?: string;
}

export interface IDeliveryUpdate {
  delivery_options_id: string;
  active: boolean;
}
