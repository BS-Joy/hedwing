import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { axiosInstance } from "../../lib/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../../store/useChatStore";

export default function MessageContainer({ msg }) {
  const { authUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { messages, setMessages } = useChatStore();

  const handleDeleteMessage = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.delete(`/messages/delete/${msg._id}`);

      if (res?.data?.success) {
        // setting new messages to the messages state after deleting a message
        const newMessages = messages.filter(
          (msg) => msg._id !== res.data.response._id
        );
        setMessages(newMessages);
        toast.success(res?.data?.message || "Message deleted successfully.");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response.data.message ||
          "Something went wrong during message deletation!"
      );
    }
  };
  return (
    <div className="chat-bubble relative flex flex-col bg-[#E4D8B4]">
      {loading ? (
        <span className="loading loading-dots text-[#555144] loading-xs"></span>
      ) : (
        <>
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
        </>
      )}
      <div
        className={`dropdown dropdown-top ${
          msg.senderId === authUser._id ? "-left-6 dropdown-end" : "-right-6"
        }  hover:cursor-pointer hidden group-hover:block absolute`}
      >
        <div tabIndex={0} role="button" className="">
          <EllipsisVertical />
        </div>
        <ul
          tabIndex={0}
          className={`dropdown-content ${
            msg.senderId === authUser._id ? "right-2" : "left-2 top-4"
          }  menu bg-base-100 rounded-box z-1 w-36 p-2 shadow-sm border`}
        >
          <li>
            <button className="flex hover:text-blue-400">
              <Pencil size={12} /> Edit
            </button>
          </li>
          <li>
            <button
              onClick={handleDeleteMessage}
              className="flex hover:text-red-500"
            >
              <Trash2 size={12} /> Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
