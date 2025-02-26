import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";
import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import defaultAvatar from "../../../assets/avatar.png";
import SearchUser from "./SearchUser";
import { UserX, UserSearch } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setUsers,
    setSelectedUser,
    isUsersLoading,
    messages,
  } = useChatStore();

  const { onlineUsers, authUser, socket } = useAuthStore();

  const [showSearch, setShowSearch] = useState(false);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const unseenChats = JSON.parse(localStorage.getItem("unseen_chats"));

  const filteredUsers = showOnlineOnly
    ? users?.filter((user) => onlineUsers?.includes(user?._id))
    : users;

  // console.log(filteredUsers);

  const filteredUserIds = filteredUsers.map((u) => u._id);

  const handleSelectUser = (user) => {
    // Reset unseen count for the selected user in Zustand state
    const updatedUsers = users.map((u) =>
      u._id === user._id ? { ...u, unseenCount: 0 } : u
    );

    setUsers(updatedUsers);
    setSelectedUser(user);

    // ✅ Remove selected user from `unseenChats` in localStorage
    const lsChats = JSON.parse(localStorage.getItem("unseen_chats")) || [];

    const updatedUnseenChats = lsChats.filter((chat) => chat._id !== user._id);

    localStorage.setItem("unseen_chats", JSON.stringify(updatedUnseenChats));
  };

  // for seen unseen messages
  useEffect(() => {
    if (selectedUser && messages.length > 0) {
      messages.forEach((msg) => {
        if (
          msg.senderId === selectedUser._id &&
          !msg.readBy.includes(authUser._id)
        ) {
          socket.emit("message-seen", {
            messageId: msg._id,
            userId: authUser._id,
          });
        }
      });
    }
  }, [selectedUser, messages, authUser, socket]);

  useEffect(() => {
    getUsers(authUser);
  }, [getUsers, authUser]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="sm:h-full sm:w-64 md:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        {/* sidebar title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium font-fondamento">Friends</span>
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="hover:cursor-pointer tooltip"
            data-tip={`${showSearch ? "Close search" : "Search user"}`}
          >
            {showSearch ? <UserX /> : <UserSearch />}
          </button>
        </div>

        {/* search user */}
        {showSearch && <SearchUser showSearch={showSearch} />}

        {/* Online filter toggle */}
        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            {
              onlineUsers?.filter(
                (id) => id !== authUser?._id && filteredUserIds.includes(id)
              )?.length
            }{" "}
            online
          </span>
        </div>
      </div>

      {/* users list */}
      <div className="overflow-x-auto w-full sm:overflow-y-auto flex flex-row sm:flex-col py-3 sm:border-0 border-b border-base-300">
        {filteredUsers?.map((user) => (
          <button
            key={user._id}
            onClick={() => handleSelectUser(user)}
            className={`
        w-auto p-3 flex items-center gap-3
        hover:bg-base-300 transition-colors hover:cursor-pointer
        ${
          selectedUser?._id === user._id
            ? "bg-base-300 rounded-full sm:rounded-none ring-1 ring-base-300"
            : ""
        }
      `}
          >
            <div className="relative lg:mx-0 flex-shrink-0">
              <img
                src={user.profilePic || defaultAvatar}
                alt={user.name}
                className="size-12 object-cover rounded-full max-w-[50px] max-h-[50px]"
              />
              {onlineUsers?.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
            rounded-full ring-2 ring-zinc-900"
                />
              )}

              {/* unseen count on small screens */}
              {unseenChats?.find(({ _id }) => _id === user._id)?.unseenCount >
                0 && (
                <div className="badge badge-primary absolute -top-2 -right-3 size-6 flex justify-center items-center sm:hidden">
                  {unseenChats.find(({ _id }) => _id === user._id)?.unseenCount}
                </div>
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden sm:block text-left min-w-0 relative">
              <h4 className="font-medium  font-cinzel">{user.fullName}</h4>
              {user.unseenCount > 0 && (
                <div className="badge badge-primary absolute -right-10 top-0 size-6">
                  {user.unseenCount}
                </div>
              )}
              <div className="text-sm text-zinc-400">
                {onlineUsers?.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center w-full text-zinc-500 py-4">
            {showOnlineOnly ? (
              "No online users"
            ) : (
              <p className="text-sm">
                You have no connection yet. Search for new connection.
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
