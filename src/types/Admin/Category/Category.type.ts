export interface CategoriesResponse {
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  created_by?: CreatedBy;
}

export interface CreatedBy {
  id: string;
  user_id: string;
  name: string;
  username: string;
  email: string;
}
