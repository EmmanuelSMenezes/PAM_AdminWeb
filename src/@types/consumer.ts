export type IConsumerGet = IConsumer[];

export interface IConsumer {
  consumer_id: string
  legal_name: string
  fantasy_name: string
  document: string
  email: string
  phone_number: string
  active: boolean
  created_at: string
  deleted_at: string
  updated_at: string
  user_id: string
  default_address: string
  addresses: Address[]
}

export interface Address {
  description: string
  address_id: string
  street: string
  number: string
  complement: string
  district: string
  city: string
  state: string
  zip_code: string
  active: boolean
  created_at: string
  deleted_at: string
  updated_at: string
  latitude: string
  longitude: string
  consumer_id: string
}
