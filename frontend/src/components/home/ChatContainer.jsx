import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../../store/useAuthStore";
import defaultAvatar from "../../assets/avatar.png";
import { formatMessageTime } from "../../utils/formatMessageTime";
import MessageContainer from "./MessageContainer";
import NoMessages from "./NoMessages";

export default function ChatContainer() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
      <div className="flex-1 flex flex-col overflow-auto h-full">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto h-full">
      <ChatHeader />
      {/* messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.length === 0 ? (
          <NoMessages />
        ) : (
          messages?.map((msg) => (
            <div
              key={msg._id}
              className={`chat ${
                msg.senderId === authUser._id ? "chat-end" : "chat-start"
              } group`}
              ref={messageEndRef}
            >
              {/* user avatar */}
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

              {/* msg time */}
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(msg?.createdAt)}
                </time>
              </div>

              {/* message */}
              <MessageContainer
                msg={msg}
                setMessage={setMessage}
                loading={loading}
                setLoading={setLoading}
              />
            </div>
          ))
        )}
      </div>
      <MessageInput msg={message} setMsg={setMessage} />
    </div>
  );
}
