import { useChatStore } from "../../store/useChatStore";

const TypingIndicator = ({ receiver }) => {
  const { typingUsers } = useChatStore();
  const isUserTyping = typingUsers.includes(receiver._id);

  return isUserTyping ? (
    <p className="text-[12px]">
      {receiver?.fullName?.split(" ")[0]} is typing{" "}
      <span className="loading loading-dots loading-xs"></span>
    </p>
  ) : null;
};

export default TypingIndicator;
