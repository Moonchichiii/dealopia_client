export interface Category {
    id: number;
    name: string;
    description: string;
    icon: string;
    image: string;
    parent: number | null;
    order: number;
    is_active: boolean;
    subcategories: Category[];
    created_at: string;
    updated_at: string;
  }
  
  export interface CategoryState {
    categories: Category[];
    currentCategory: Category | null;
    isLoading: boolean;
    error: string | null;
  }