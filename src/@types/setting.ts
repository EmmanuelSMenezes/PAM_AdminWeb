import { CustomFile } from "src/components/upload";

export type IFeeAdminResponse = {
  interest_rate_setting_id: string;
  admin_id: string;
  service_fee: number;
  card_fee: number;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export interface IFeeAdminUpdate {
  interest_rate_setting_id?: string;
  admin_id: string;
  service_fee: number | string;
  card_fee: number | string;
}

export interface IStyleCreate {
  admin_id: string;
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
  contrasttext: string;
  logo?: string | CustomFile | any;
  url?: string | CustomFile | any;
}

export interface IStyleResponse {
  status: number;
  success: boolean;
  message: string;
  data: DataResponse;
  error: string;
}

export interface DataResponse {
  style_partner_id: string;
  admin_id: string;
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
  contrasttext: string;
  logo: string;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export interface IStyleGetResponse {
  style_partner_id: string;
  admin_id: string;
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
  contrasttext: string;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  logo: string;
}