export interface UserDto {
  id: number;
  email: string;
  password: string;
  roleId: number | null; 
  role: string 
  profilePhotoUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}