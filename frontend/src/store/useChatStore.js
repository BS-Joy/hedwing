import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  typingUsers: [],

  messages: [],
  isMessagesLoading: false,

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
      const allChats = res.data?.chats;

      // Sort the chats by updatedAt (most recent first)
      const sortedChats = allChats.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      const refinedUsers = sortedChats.map((chat) => {
        const siUsers = chat?.users?.find(
          (user) => user?._id !== authUser?._id
        );

        return {
          ...siUsers,
          roomStatus: chat.roomStatus,
          roomId: chat._id,
          unseenCount: chat.unseenCount || 0,
          blockedBy: chat?.blockedBy || "",
        };
      });

      set({ users: refinedUsers });
      // set({ selectedUser: refinedUsers[0] });
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
    const onlineUsers = useAuthStore.getState().onlineUsers;
    const socket = useAuthStore.getState().socket;
    try {
      const { selectedUser, messages } = get();
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser?._id}`,
        messageData
      );

      const newMsg = res?.data?.data;

      set({ messages: [...messages, newMsg] });

      // for update seen status
      if (onlineUsers.includes(selectedUser._id)) {
        socket.on("update-message-status", ({ messageId, userId }) => {
          set((state) => ({
            messages: state.messages.map((msg) => {
              if (msg._id === messageId && !msg.readBy.includes(userId)) {
                return { ...msg, readBy: [...msg.readBy, userId] };
              }
              return msg;
            }),
          }));
        });
      }
    } catch (error) {
      console.log(error);
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
    const { socket, authUser } = useAuthStore.getState();

    // 🔥 Listen for new chat event (when a new room is created)
    socket.on("newChat", async ({ roomId, senderId }) => {
      // console.log("New chat created:", roomId, senderId);

      // 🔥 Fetch the latest users list so user B can see the new chat
      await get().getUsers(authUser);
    });

    socket.on("newMessage", async (newMessage) => {
      const { selectedUser, users } = get();

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

    socket.on("deleteMessage", (msgId) => {
      set((state) => ({
        messages: state.messages.filter(
          (msg) => msg._id.toString() !== msgId.toString()
        ),
      }));
    });
  },

  onUpdateMessage: () => {
    const socket = useAuthStore.getState().socket;

    socket.off("updateMessage");

    socket.on("updateMessage", (editedMessage) => {
      set((state) => ({
        messages: state.messages.map((msg) => {
          if (msg._id === editedMessage?._id) {
            msg.text = editedMessage.text;
            msg.edited = editedMessage?.edited;
          }

          return msg;
        }),
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setUsers: (newUsers) => set({ users: newUsers }),
}));
