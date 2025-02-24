import { useEffect, useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useChatStore } from "../../store/useChatStore";
import TypingIndicator from "./TypingIndicator";

const MessageInput = ({ msg, setMsg }) => {
  const [text, setText] = useState(msg?.text ?? "");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const {
    sendMessage,
    editMessage,
    sendTypingStatus,
    selectedUser,
    listenForTypingEvents,
  } = useChatStore();
  const [isTyping, setIsTyping] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const textInputRef = useRef(null);

  // ✅ Update state when `msg` prop changes
  useEffect(() => {
    setText(msg?.text ?? "");

    if (msg?.text) {
      setIsEditing(true);
    }

    if (msg?.text) {
      textInputRef.current.focus();
    }
  }, [msg?.text]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  let typingTimeout;

  const handleMsgText = (e) => {
    const inputText = e.target.value;
    if (isEditing && inputText === "") {
      setIsEditing(false);
      setMsg("");
    }
    setText(inputText);

    if (!isTyping) {
      sendTypingStatus(selectedUser?._id, true);
      setIsTyping(true);
    }

    // Clear previous timeout (prevents multiple timeouts from stacking up)
    clearTimeout(typingTimeout);

    // Set new timeout to stop typing after 2 seconds
    typingTimeout = setTimeout(() => {
      sendTypingStatus(selectedUser?._id, false);
      setIsTyping(false);
    }, 2000);
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      if (isEditing) {
        await editMessage({
          ...msg,
          text: text,
        });
        setIsEditing(false);
      } else {
        await sendMessage({
          text: text.trim(),
          image: imagePreview,
        });
      }

      // Clear form
      setText("");
      setMsg("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    listenForTypingEvents();

    return () => clearTimeout(typingTimeout);
  }, []);

  return (
    <div className="p-4 w-full">
      <TypingIndicator receiver={selectedUser} />
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center hover:cursor-pointer"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmitMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            ref={textInputRef}
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md font-lumanosimo focus:outline-0"
            placeholder="Type a message..."
            value={text}
            onChange={handleMsgText}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle text-primary"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
