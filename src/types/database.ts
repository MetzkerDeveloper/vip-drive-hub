export interface Vehicle {
  id: string;
  name: string;
  year: number;
  km: number;
  description: string | null;
  image_url: string | null;
  is_sold: boolean;
  price: number | null;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  vehicle_interest: string | null;
  message: string;
  created_at: string;
}
