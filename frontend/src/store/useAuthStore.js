import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { Cookies } from "react-cookie";
import { toast } from "react-hot-toast";

const cookies = new Cookies();

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  loginLoading: false,
  signupLoading: false,
  isUpdatingProfile: false,
  authError: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/checkauth");
      set({ authUser: res.data });
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
      toast.success(res?.data?.message || "Sign up successfull.");
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong!");
    } finally {
      set({ signupLoading: false });
    }
  },
  logIn: async (data) => {
    try {
      set({ loginLoading: true });
      const res = await axiosInstance.post("/auth/signin", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      // get().connectSocket();
    } catch (error) {
      toast.error(
        error.response.data.message || "Something went wrong during log in!"
      );
    } finally {
      set({ loginLoading: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      // get().disconnectSocket();
    } catch (error) {
      toast.error(
        error.response.data.message || "Something went wrong during logout"
      );
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.patch("/auth/updateProfile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(
        error.response.data.message ||
          "Something went wrong during profile update!"
      );
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
