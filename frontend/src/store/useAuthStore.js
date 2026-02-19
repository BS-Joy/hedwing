import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import { Cookies } from "react-cookie";

// const baseUrl = "http://localhost:5000";
const baseUrl = "https://hedwing.onrender.com";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  loginLoading: false,
  signupLoading: false,
  isUpdatingProfile: false,
  authError: null,
  onlineUsers: [],
  socket: null,

  // socket related
  connectSocket: () => {
    const { authUser } = get();

    if (!authUser?._id || get().socket?.connected) return;

    const socket = io(baseUrl, {
      query: {
        userId: authUser?._id,
      },
    });

    socket.connect();
    set({ socket: socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
    // console.log(socket);
  },
  disConnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },

  // auth related
  checkAuth: async () => {
    // const { authUser } = get();
    // console.log(authUser);
    try {
      set({ isCheckingAuth: true });
      // if (!authUser) {
      //   return;
      // }
      const res = await axiosInstance.get("/auth/checkauth");
      // console.log(res);
      if (res?.data?.success === false) {
        set({ authUser: null });
        return;
      }
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      // console.log("Error on checkauth: ", error);
      set({ authUser: null });
      return;
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (data) => {
    try {
      set({ signupLoading: true });
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success(res?.data?.message || "Sign up successfull.");
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong!");
    } finally {
      set({ signupLoading: false });
    }
  },
  logIn: async (data, navigate) => {
    try {
      set({ loginLoading: true });
      const res = await axiosInstance.post("/auth/signin", data);
      // console.log(res?.data);
      set({ authUser: res?.data });
      toast.success("Logged in successfully");
      if (res?.data) {
        navigate("/");
      }

      get().connectSocket();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong during log in!",
      );
    } finally {
      set({ loginLoading: false });
    }
  },
  logout: async () => {
    try {
      const cookies = new Cookies();
      const res = await axiosInstance.post("/auth/logout");

      if (res?.data?.success) {
        cookies.remove("jwt", { path: "/" });
      }
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disConnectSocket();
    } catch (error) {
      toast.error(
        error.response.data.message || "Something went wrong during logout",
      );
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.patch("/auth/updateProfile", data);
      set({ authUser: res.data?.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);

      const errMsg =
        error.response.data.message ||
        (error.status === 413 && "Image is too large!") ||
        "Something went wrong during profile update!";
      toast.error(errMsg);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
