import { UserSearch, Search } from "lucide-react";

export default function SearchUser() {
  return (
    <div className="join w-full flex justify-center my-4">
      <label className="input relative focus:border-none outline-0 focus:outline-0 focus-within:outline-0 validator join-item">
        <Search />
        <input
          type="search"
          className="focus:outline-0"
          placeholder="search user to connect"
          required
        />
      </label>
      {/* <div className="validator-hint hidden">Enter user name</div> */}
      <button className="btn btn-neutral join-item">
        <UserSearch size={18} />
      </button>
    </div>
  );
}
