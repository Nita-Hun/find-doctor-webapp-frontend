export type PermissionSet = {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  confirm: boolean;
  completed: boolean;
  canceled: boolean;
};

export interface RoleFormData {
  name: string;
  description: string;
  status: string;
  permissions: Record<string, PermissionSet>;
}
export interface Role {
  id: number;
  name: string;
  description?: string;
  status: string;
  permissions: Record<string, PermissionSet>;
  updatedAt: string
}

export const ENTITIES = ["DOCTOR", "PATIENT", "APPOINTMENT", "ROLE", "USER", "SPECIALIZATION", "DASHBOARD", "PAYMENT" ];
export const ACTIONS = ["view", "create", "edit", "delete", "confirm", "completed", "canceled"] as const;


export interface RoleFormModalProps {
  initialData?: Partial<Role> & RoleFormData;
  onClose: () => void;
  onSuccess: () => void;
}





