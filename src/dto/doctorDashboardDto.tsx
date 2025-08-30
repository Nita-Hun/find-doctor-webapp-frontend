export interface DoctorDashboardDto {
  totalPatients: number;
  consultations: number;
  chart: {
    month: string;
    male: number;
    female: number;
  }[];
  doctor: {
    id: number;
    name: string;
    specialization: string;
    photoUrl: string;
    rating: number;
    ratingCount: number;
  };
  colleagues: {
    id: number;
    name: string;
    specialization: string;
    photoUrl: string;
    rating: number;
  }[];
  recentPatients: {
    id: number;
    name: string;
    age: number;
    date: string;
  }[];
}