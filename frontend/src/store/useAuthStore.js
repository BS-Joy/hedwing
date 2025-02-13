import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  loginLoading: false,
  signupLoading: false,
  updateProfileLoading: false,
  authError: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/checkauth");
      set({ authUser: res.data });
      // cookies.set('auth_')
    } catch (error) {
      console.log("Error on checkauth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (data) => {
    try {
      set({ signupLoading: true });
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
    } catch (error) {}
  },
}));
