export interface iFilterPagination {
  itensPerPage: number;
  page: number;
  filter?: string;
}

export interface iFilterOrder {
  costumer: string;
  partner: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
}