import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { UserDto } from "@/dto/userDto";

export function useUserProfile() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.get<UserDto>("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, refetch: fetchUser };
}
