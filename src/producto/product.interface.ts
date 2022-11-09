export interface ICreateProduct {
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface IUpdateProduct {
  id: string;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
}

export interface IGetProduct {
  id: number;
}

export interface IGetProductsPagination {
  limit?: number;
}

export interface IGetProductsSort {
  sortBy?: any;
}

export interface IGetProducts {
  pagination?: IGetProductsPagination;
  sort?: IGetProductsSort;
}

export interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
} 