import { X } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import defaultAvatar from "../../assets/avatar.png";
import { ShieldBan } from "lucide-react";
import { ModalWrapper } from "../ModalWrapper";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { useState } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, users, setUsers } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const modal = document.getElementById("my_modal_2"); // Get modal element

  const handleBlockChat = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.patch("/chat/block", {
        toBlock: selectedUser?._id,
      });

      if (res.data.success) {
        toast.success("Chat is blocked now.");
        const modifiedSelectedUser = { ...selectedUser };
        const modifiedUsers = [...users];

        modifiedSelectedUser.roomStatus = "blocked";
        modifiedSelectedUser.blockedBy = authUser._id;
        setSelectedUser(modifiedSelectedUser);

        const newUsers = modifiedUsers.map((user) => {
          if (user?._id === selectedUser._id) {
            user.roomStatus = "blocked";
            user.blockedBy = authUser._id;
          }

          return user;
        });

        setUsers(newUsers);

        setLoading(false);
        modal.close();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(
        error.response.data.message || "Something went wrong during chat block!"
      );
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || defaultAvatar}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers?.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {selectedUser?.roomStatus === "okay" && (
            <button
              onClick={() => document.getElementById("my_modal_2").showModal()}
              className="px-4 py-2 p-2 rounded-lg text-red-500  btn btn-soft hover:bg-red-100/80 hover:text-red-500 cursor-pointer border-none font-lumanosimo"
            >
              Block
            </button>
          )}

          {/* chat block confirmation modal */}
          <ModalWrapper>
            <div
              className="flex max-h-[90vh]  flex-col gap-6 overflow-hidden rounded p-6 text-center text-slate-500 shadow-xl shadow-slate-700/10"
              id="modal"
              role="document"
            >
              {/*        <!-- Modal header --> */}
              <header
                id="header-5a"
                className="flex flex-col items-center gap-4"
              >
                <ShieldBan size={50} color="#ef4444" />
                <h3 className="flex-1 text-xl font-medium">Block user?</h3>
              </header>
              {/*        <!-- Modal body --> */}
              <div id="content-5a" className="flex-1 overflow-auto">
                <p>After blocking the user you can't message anymore.</p>
              </div>
              {/*        <!-- Modal actions --> */}
              <div className="flex justify-start gap-2">
                <button
                  onClick={handleBlockChat}
                  className="inline-flex items-center justify-center flex-1 h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap btn bg-red-500/90 hover:bg-red-500"
                >
                  {loading ? (
                    <span className="loading loading-dots loading-lg"></span>
                  ) : (
                    "Yes, I'm sure"
                  )}
                </button>
                <form
                  method="dialog"
                  className="inline-flex items-center justify-center flex-1"
                >
                  <button className="btn btn-soft flex-1">Cancel</button>
                </form>
              </div>
            </div>
          </ModalWrapper>
          {/* Close button */}
          <button
            onClick={() => setSelectedUser(null)}
            className="p-2 px-6 rounded-lg text-red-500  btn btn-soft hover:bg-red-100/80 hover:text-red-500 cursor-pointer border-none"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
