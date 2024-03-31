export interface Customer {}

interface Sales {}

export interface Product {
  id: string;
  name: string;
  price_in_cents: number;
  image_path: string;
  description: string;
  is_available_for_purchase: boolean;
  created_at: string;
  updated_at: string;

  download_verifications: DownloadVerification[];
  orders: Order[];
}

export interface User {
  id: string;
  name: string;
  password: string;
  email: string;
  created_at: string;
  updated_at: string;

  orders: Order[];
}

export interface Order {
  id: string;
  name: string;
  price_in_cents: number;
  created_at: string;
  updated_at: string;

  user_id: string;
  product_id: string;
}

export interface DownloadVerification {
  id: string;
  products: Product[];
  expires_at: string;
  created_at: string;
}
