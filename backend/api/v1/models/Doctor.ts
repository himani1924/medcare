export interface Doctor {
  id?: number;
  name: string;
  specialty: string;
  experience: number;
  rating?: number;
  description?: string;
  available_slots?: string[];
}
