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
      const x = [...new Set([...typingUsers, senderId])];
      set({ typingUsers: x });
    });

    socket.on("userStopTyping", ({ senderId }) => {
      const x = typingUsers.filter((id) => id !== senderId);
      set({ typingUsers: x });
    });
  },

  sendTypingStatus: (receiverId, isTyping) => {
    const { socket, authUser } = useAuthStore.getState();

    if (!socket || !authUser?._id) return;

    socket.emit(isTyping ? "typing" : "stopTyping", {
      senderId: authUser._id,
      receiverId,
    });
  },

  setMessages: (newMessages) => {
    set({ messages: newMessages });
  },

  getUsers: async (authUser) => {
    try {
      set({ isUsersLoading: true });
      const res = await axiosInstance.get("/messages/users");
      const refinedUsers = res.data?.chats.map((chat) => {
        const siUsers = chat?.users?.find(
          (user) => user?._id !== authUser?._id
        );

        return {
          ...siUsers,
          roomStatus: chat.roomStatus,
          roomId: chat._id,
          blockedBy: chat?.blockedBy || "",
        };
      });

      // console.log(refinedUsers);
      set({ users: refinedUsers });
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

  editMessage: async (msgData) => {
    const socket = useAuthStore.getState().socket;
    try {
      const { selectedUser, messages } = get();
      const res = await axiosInstance.patch(`/messages/edit`, msgData);
      const updatedMessage = res?.data?.updatedMessage;
      const updatedMessages = messages.map((msg) => {
        if (msg._id === updatedMessage?._id) {
          msg.text = updatedMessage.text;
          msg.edited = updatedMessage?.edited;
        }

        return msg;
      });

      socket.on("updateMessage", (editedMessage) => {
        set({ messages: updatedMessages });
      });

      set({ messages: updatedMessages });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    // console.dir("Subscribing messages");
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      const { selectedUser, users } = get();

      console.log(selectedUser);

      // Check if the message is from the currently selected chat
      if (!selectedUser || newMessage.senderId !== selectedUser._id) {
        // Update unseen count for the sender
        const updatedUsers = users.map((user) => {
          if (user._id === newMessage.senderId) {
            return {
              ...user,
              unseenCount: (user.unseenCount || 0) + 1,
              lastMessageTime: newMessage.createdAt,
            };
          }
          return user;
        });

        console.dir(updatedUsers);

        // Reorder the list: bring the sender to the top based on lastMessageTime
        updatedUsers.sort((a, b) => {
          return (
            new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
          );
        });
        set({ users: updatedUsers });
      } else {
        // If message is from the currently active chat, simply add to messages
        set({ messages: [...get().messages, newMessage] });
      }
    });
  },

  onDeleteMessage: () => {
    const socket = useAuthStore.getState().socket;

    socket.off("deleteMessage");

    const { messages } = get();

    socket.on("deleteMessage", (msgId) => {
      console.log(msgId);
      const updatedMsgs = messages.filter((msg) => msg._id !== msgId);
      set({ messages: updatedMsgs });
    });
  },

  onUpdateMessage: () => {
    const socket = useAuthStore.getState().socket;

    socket.off("updateMessage");

    const { messages } = get();

    socket.on("updateMessage", (editedMessage) => {
      const updatedMessages = messages.map((msg) => {
        if (msg._id === editedMessage?._id) {
          msg.text = editedMessage.text;
          msg.edited = editedMessage?.edited;
        }

        return msg;
      });
      set({ messages: updatedMessages });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setUsers: (newUsers) => set({ users: newUsers }),
}));
