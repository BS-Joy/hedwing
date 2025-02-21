import { X } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import defaultAvatar from "../../assets/avatar.png";
import { EllipsisVertical, ShieldBan, Trash2 } from "lucide-react";
import { useState } from "react";
import { ModalWrapper } from "../ModalWrapper";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [openModal, setOpenModal] = useState(false);

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
          {/* 3dot dropdown */}
          {/* <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="cursor-pointer m-1">
              <EllipsisVertical />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>
                <a>Delete this chat</a>
              </li>
            </ul>
          </div> */}
          <button
            onClick={() => document.getElementById("my_modal_2").showModal()}
            className="px-4 py-2 p-2 rounded-lg text-red-500  btn btn-soft hover:bg-red-100/80 hover:text-red-500 cursor-pointer border-none font-lumanosimo"
          >
            Block
          </button>
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
                <button className="inline-flex items-center justify-center flex-1 h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap btn bg-red-500/90 hover:bg-red-500">
                  <span>Yes, I'm sure</span>
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
