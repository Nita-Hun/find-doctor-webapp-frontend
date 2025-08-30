export interface Specialization {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
export type SpecializationCard = {
  id: number;
  name: string;
};

export type SpecializationCardProps = {
  specialization: Specialization;
};