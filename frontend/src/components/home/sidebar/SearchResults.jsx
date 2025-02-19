import { ModalWrapper } from "../../ModalWrapper";
import UserModalCard from "./UserModalCard";

const SearchResults = ({ results, isLoading, searchTerm }) => {
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
            >
              <ModalWrapper user={user}>
                <UserModalCard user={user} />
              </ModalWrapper>
              {/* {user.fullName} */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
