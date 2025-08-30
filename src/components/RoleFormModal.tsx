'use client';

import { useState } from "react";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";
import { apiClient } from "@/lib/api-client";
import { ACTIONS, ENTITIES, PermissionSet, RoleFormData, RoleFormModalProps } from "@/types/Role";

function mapPermissionsArrayToRecord(perms: string[]): Record<string, PermissionSet> {
  const record: Record<string, PermissionSet> = {};
  ENTITIES.forEach((entity) => {
    record[entity] = { view: false, create: false, edit: false, delete: false, confirm: false, completed: false, canceled: false };
  });
  for (const perm of perms) {
    const [entity, action] = perm.split(":");
    if (entity && action && record[entity]) {
      record[entity][action as keyof PermissionSet] = true;
    }
  }
  return record;
}

export default function RoleFormModal({ initialData, onClose, onSuccess }: RoleFormModalProps) {
  const [formData, setFormData] = useState<Omit<RoleFormData, "permissions">>(() => ({
    name: initialData?.name || "",
    description: initialData?.description || "",
    status: initialData?.status || "ACTIVE",
    id: initialData?.id,
  }));

  const [permissions, setPermissions] = useState<Record<string, PermissionSet>>(() => {
    if (initialData?.permissions) {
      if (Array.isArray(initialData.permissions)) {
        return mapPermissionsArrayToRecord(initialData.permissions);
      } else {
        return initialData.permissions;
      }
    }
    const perms: Record<string, PermissionSet> = {};
    ENTITIES.forEach((entity) => {
      perms[entity] = { view: false, create: false, edit: false, delete: false, confirm: false, completed: false, canceled: false };
    });
    return perms;
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePermission = (entity: string, action: keyof PermissionSet) => {
    setPermissions((prev) => ({
      ...prev,
      [entity]: {
        ...(prev[entity] ?? {}),
        [action]: !prev[entity]?.[action],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a role name");
      return;
    }

    const selectedPermissions: string[] = [];
    for (const entity of ENTITIES) {
      for (const action of ACTIONS) {
        if (permissions[entity]?.[action]) {
          selectedPermissions.push(`${entity}:${action}`);
        }
      }
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description,
      status: formData.status,
      permissions: selectedPermissions,
    };

    setLoading(true);
    try {
      if (initialData?.id) {
        await apiClient.put(`/api/roles/${initialData.id}`, payload);
      } else {
        await apiClient.post("/api/roles", payload);
      }

      toast.success(`Role ${initialData ? "updated" : "created"} successfully`);
      onSuccess();
    } catch (error) {
      toast.error(`Failed to ${initialData ? "update" : "create"} role`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? "Edit Role" : "Create New Role"}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-500 transition-colors"
            aria-label="Close"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                id="status"
                name="status"
                type="checkbox"
                checked={formData.status === "ACTIVE"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.checked ? "ACTIVE" : "INACTIVE",
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="status" className="ml-2 block text-sm font-medium text-gray-700">
                Active Role
              </label>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Permissions</h3>
            <p className="text-sm text-gray-500 mb-4">
              Select the permissions this role should have
            </p>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 overflow-hidden">
              {ENTITIES.map((entity) => (
                <div key={entity} className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800">{entity}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                      {ACTIONS.map((action) => (
                        <div key={action} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`${entity}-${action}`}
                            checked={permissions[entity]?.[action] || false}
                            onChange={() => togglePermission(entity, action)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`${entity}-${action}`}
                            className="ml-2 text-sm font-medium text-gray-700 capitalize"
                          >
                            {action}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {initialData ? "Updating..." : "Creating..."}
                </span>
              ) : initialData ? "Update Role" : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
