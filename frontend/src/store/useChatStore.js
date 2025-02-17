import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,

  isUsersLoading: false,
  isMessagesLoading: false,
  typingUsers: [],

  listenForTypingEvents: () => {
    const socket = useAuthStore.getState().socket;
    const { typingUsers } = get();

    if (!socket) return;

    socket.on("userTyping", ({ senderId }) => {
      console.log("On user start typing: ", senderId);
      const x = [...new Set([...typingUsers, senderId])];

      console.log(x);
      set({ typingUsers: x });
    });

    socket.on("userStopTyping", ({ senderId }) => {
      console.log("on user stop typing: ", senderId);

      const x = typingUsers.filter((id) => id !== senderId);

      console.log(x);
      set({ typingUsers: x });
    });
  },

  sendTypingStatus: (receiverId, isTyping) => {
    const { socket, authUser } = useAuthStore.getState();

    const { typingUsers } = get();

    console.log({ receiverId, isTyping });

    if (!socket || !authUser?._id) return;

    socket.emit(isTyping ? "typing" : "stopTyping", {
      senderId: authUser._id,
      receiverId,
    });
  },

  getUsers: async () => {
    try {
      set({ isUsersLoading: true });
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data?.users });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong on get users in chatStore"
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data?.messages });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    try {
      const { selectedUser, messages } = get();
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser?._id}`,
        messageData
      );
      set({ messages: [...messages, res.data?.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage?.senderId !== selectedUser?._id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
