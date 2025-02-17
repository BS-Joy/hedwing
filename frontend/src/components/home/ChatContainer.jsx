import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../../store/useAuthStore";
import defaultAvatar from "../../assets/avatar.png";
import { formatMessageTime } from "../../utils/formatMessageTime";

export default function ChatContainer() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser?._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef?.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      {/* messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className={`chat ${
              msg.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    msg?.senderId === authUser?._id
                      ? authUser?.profilePic || defaultAvatar
                      : selectedUser?.profilePic || defaultAvatar
                  }
                  alt={`profile pic`}
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(msg?.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col bg-[#E4D8B4]">
              {msg?.image && (
                <img
                  src={msg?.image}
                  alt="msg attachd image"
                  className="sm:max-w-[150px] rounded-md mb-2"
                />
              )}
              {msg.text && (
                <p className="font-lumanosimo text-[#555144]">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
}
