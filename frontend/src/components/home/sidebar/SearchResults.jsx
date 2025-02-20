import { useState } from "react";
import { ModalWrapper } from "../../ModalWrapper";
import UserModalCard from "./UserModalCard";

const SearchResults = ({ results, isLoading, searchTerm }) => {
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
    <div className="w-full bg-base-100 border border-primary rounded-md shadow-lg absolute z-10">
      {isLoading ? (
        <div className="p-4 text-center text-base-content">
          <span className="loading loading-ring loading-md"></span>
        </div>
      ) : (
        <ul className="py-2 max-h-[350px] h-full overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin">
          <p className="pl-4 text-sm font-thin font-alegreya">
            Showing total {results?.length} users.
          </p>
          {results.map((user) => (
            <li
              key={user._id}
              className="px-4 py-2 hover:bg-base-200 cursor-pointer"
              onClick={() => setModalUser(user)}
            >
              <button
                className="px-4 py-2 hover:bg-base-200 cursor-pointer"
                onClick={() =>
                  document.getElementById("my_modal_2").showModal()
                }
              >
                {user?.fullName}
              </button>
              {/* {user.fullName} */}
            </li>
          ))}
        </ul>
      )}
      <ModalWrapper>
        {modalUser && <UserModalCard user={modalUser} />}
      </ModalWrapper>
    </div>
  );
};

export default SearchResults;
