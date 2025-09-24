export interface IOrderResponseList {
  orders: IOrderResponse[];
  pagination: IPagination;
}

export interface IOrderResponse {
  order_id: string;
  order_number: number;
  amount: number;
  freight: number;
  orders_status_id: string;
  status_name: string;
  consumer: Consumer;
  partner: Partner;
  order_itens: OrderIten[];
  created_at: string;
  updated_at: string;
}

export interface Consumer {
  user_id: string;
  consumer_id: string;
  legal_name: string;
}

export interface Partner {
  legal_name: string;
  user_id: string;
  partner_id: string;
  fantasy_name: string;
  branch_id: string;
  branch_name: string;
}

export interface OrderIten {
  order_item_id: string;
  product_name: string;
  quantity: number;
  product_value: number;
  product_id: string;
  image_default: string;
  url: string;
}

export interface IPagination {
  totalRows: number;
  totalPages: number;
}

// ----------------------------------------------------
export interface IOrderDetails {
  order_id: string;
  order_number: number;
  freight: number;
  amount: number;
  change: number;
  order_status_id: string;
  status_name: string;
  observation: string;
  consumer: ConsumerDetails;
  partner: PartnerDetails;
  shipping: ShippingDetails;
  order_itens: IOrderItenDetails[];
  payments: PaymentDetails[];
  created_by: string;
  shipping_options: {
    delivery_option_id: string;
    value: number;
    name: string;
  };

  created_at: string;
  updated_by: string;
  updated_at: string;
  service_fee: number;
  card_fee: number;
}

export interface ConsumerDetails {
  user_id: string;
  consumer_id: string;
  legal_name: string;
  fantasy_name: string;
  document: string;
  email: string;
  phone_number: string;
  street: string;
  city: string;
  state: string;
  number: string;
  complement: string;
  district: string;
  zip_code: string;
}

export interface PartnerDetails {
  user_id: string;
  partner_id: string;
  identifier: number;
  legal_name: string;
  fantasy_name: string;
  document: string;
  email: string;
  phone_number: string;
  branch_id: string;
  branch_name: string;
  phone: string;
}

export interface ShippingDetails {
  shipping_company_id: string;
  company_name: string;
  document: string;
  address_id: string;
  address: AddressDetails;
}

export interface AddressDetails {
  address_id: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  zip_code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  latitude: string;
  longitude: string;
}

export interface IOrderItenDetails {
  product_id: string;
  product_name: string;
  quantity: number;
  product_value: number;
}

export interface PaymentDetails {
  payment_id: string;
  payment_options_id: string;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  installments: number;
  amount_paid: number;
  payment_situation_id: string;
  description: string;
  identifier: number;
}

export interface iFilterPagination {
  admin_id: string;
  status?: string;
  consumer?: string;
  partner?: string;
  itensPerPage: number;
  page: number;
  filter?: string;
  start_date?: string;
  end_date?: string;
  order_number?: string;
}
