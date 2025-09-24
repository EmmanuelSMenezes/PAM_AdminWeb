export interface ICategoryCreateResponse {
  categories: ICategoryResponse[];
  paginations: Paginations;
}

export interface ICategoryResponse {
  category_id: string;
  identifier: number;
  description: string;
  category_parent_name: string;
  category_parent_id: string;
  created_by: string;
  updated_by: string
  created_at: string;
  updated_at: string;
  active: boolean;
}

export interface Paginations {
  totalRows: number;
  totalPages: number;
}

export interface ICategory {
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

export interface ICategoryPost {
  description: string,
  category_parent_id: string | null,
  created_by: string,
}

export interface ICategoryPostResponse {
  category: [
    {
      category_id: string;
      identifier: number;
      description: string;
      category_parent_name: string;
      category_parent_id: string;
      created_by: string;
      updated_by: string;
      created_at: string;
      updated_at: any;
      active: boolean;
    }
  ];
  paginations: Paginations;
}


export interface IUpdateCategory {
  category_id: string | string[] | undefined;
  description: string;
  category_parent_id: string | null;
  active: boolean;
  updated_by: string;
}
