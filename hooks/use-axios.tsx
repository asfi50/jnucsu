import { useAuth } from "@/context/auth-context";
import axios, { AxiosInstance } from "axios";
import { useMemo } from "react";

export default function useAxios(): AxiosInstance {
  const { accessToken } = useAuth();
  const token = accessToken;

  return useMemo(() => {
    const instance = axios.create();
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return instance;
  }, [token]);
}
