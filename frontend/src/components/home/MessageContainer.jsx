import { EllipsisVertical, Pencil, Trash2, SmilePlus } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { useChatStore } from "../../store/useChatStore";
import { Check, CheckCheck } from "lucide-react";
import { useEffect } from "react";

export default function MessageContainer({
  msg,
  setMessage,
  // loading,
  // setLoading,
}) {
  const { authUser, socket } = useAuthStore();

  const {
    selectedUser,
    messages,
    setMessages,
    onDeleteMessage,
    onUpdateMessage,
  } = useChatStore();

  useEffect(() => {
    onDeleteMessage();
    // Optionally, return a cleanup function:
    // return () => {
    //   socket.off("deleteMessage");
    // };
  }, [onDeleteMessage]);

  useEffect(() => {
    onUpdateMessage();
    // Optionally, return a cleanup function:
    return () => {
      socket.off("updateMessage");
    };
  }, [onUpdateMessage]);

  const handleDeleteMessage = async () => {
    try {
      const res = await axiosInstance.delete(`/messages/delete/${msg._id}`);

      if (res?.data?.success) {
        // setting new messages to the messages state after deleting a message
        const newMessages = messages.filter(
          (msg) => msg._id !== res.data.response._id
        );

        setMessages(newMessages);

        toast.success(res?.data?.message || "Message deleted successfully.");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data.message ||
          "Something went wrong during message deletation!"
      );
    }
  };

  return (
    <div className="chat-bubble max-w-[80%] sm:max-w-[50%] relative flex flex-col bg-[#E4D8B4]">
      {msg?.image && (
        <img
          src={msg?.image}
          alt="msg attachd image"
          className="sm:max-w-[150px] rounded-md mb-2"
        />
      )}
      {msg.text && <p className="font-lumanosimo text-[#555144]">{msg.text}</p>}

      {/* 3dot dropdown */}
      <div
        className={`dropdown dropdown-left ${
          msg.senderId === authUser._id &&
          "-left-6 dropdown-end group-hover:block"
        }  hover:cursor-pointer hidden  absolute`}
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
            <button
              onClick={() => {
                setMessage(msg);
              }}
              className="flex hover:text-blue-400"
            >
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

      {/* add emoji icon */}
      <div
        className={`absolute ${
          msg.senderId !== authUser._id && "-bottom-4 right-0 group-hover:block"
        } hidden cursor-pointer`}
      >
        <SmilePlus size={14} />
      </div>

      {/* chat footer */}
      <div
        className={`chat-footer absolute -bottom-5 left-0 justify-between pr-1 mb-1 w-full ${
          msg.senderId === authUser._id ? "" : ""
        }`}
      >
        {msg?.edited && <p className="font-lumanosimo text-[8px]">(edited)</p>}
        {msg?.senderId === authUser._id && (
          <p>
            {msg?.readBy.includes(authUser._id) &&
            msg?.readBy.includes(selectedUser._id) ? (
              <CheckCheck size={12} color="#4fcf00" />
            ) : (
              <Check size={12} color="#4fcf00" />
            )}
          </p>
        )}
      </div>
    </div>
  );
}
