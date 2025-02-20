import { useState } from "react";
import { PiUsersThreeThin } from "react-icons/pi";
import { HiUserGroup } from "react-icons/hi2";
import { useChatStore } from "../../../store/useChatStore";

const SearchResults = ({
  results,
  isLoading,
  searchTerm,
  setResults,
  setIsLoading,
  setSearchTerm,
}) => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const [modalUser, setModalUser] = useState(null);
  if (results.length === 0 && !isLoading && searchTerm) {
    return (
      <div className="w-full bg-base-100 border border-primary rounded-md shadow-lg absolute z-10">
        <div className="p-4 text-center text-base-content">
          <p className="text-sm font-thin font-alegreya">No user found</p>
        </div>
      </div>
    );
  }

  if (results.length === 0 && !isLoading) return null;

  return (
    <div className="w-full bg-base-100 border rounded-md shadow-lg absolute z-10">
      {isLoading ? (
        <div className="p-4 text-center text-base-content">
          <span className="loading loading-ring loading-md"></span>
        </div>
      ) : (
        <ul className="py-2 max-h-[350px] h-full overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin">
          <p className="pl-4 text-sm font-thin font-alegreya border-b-[.2px] pb-2  flex items-center gap-2">
            <HiUserGroup /> Showing total {results?.length} users.
          </p>
          {results.map((user) => (
            <li
              key={user._id}
              className="px-4 py-2 hover:bg-base-200 cursor-pointer"
              onClick={() => {
                setSelectedUser(user);
                setIsLoading(false);
                setSearchTerm("");
                setResults([]);
              }}
            >
              {user?.fullName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
