import { useState, useEffect, useRef } from "react";
import { UserSearch } from "lucide-react";
import SearchResults from "./SearchResults";
import useDebounce from "../../../hooks/useDebounce";
import { useAuthStore } from "../../../store/useAuthStore";
import { axiosInstance } from "../../../lib/axios";
import { ModalWrapper } from "../../ModalWrapper";
// import SearchResults from "./SearchResults"

export default function SearchUser({ showSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchbarRef = useRef(null);
  // const {searchUser} = useAuthStore()

  useEffect(() => {
    if (showSearch) {
      searchbarRef.current?.focus();
    } else {
      searchbarRef.current?.blur();
    }

    return () => searchbarRef.current?.blur();
  }, [showSearch]);

  const searchUser = useDebounce(async (searchQuery) => {
    try {
      const res = await axiosInstance.get(
        `/auth/search?searchTerm=${searchQuery}`
      );

      if (res?.data?.success) {
        setIsLoading(false);
        setResults(res?.data?.users);
      }
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  }, 700);

  // useEffect(() => {
  //   const fetchResults = async () => {
  //     if (searchTerm.trim() === "") {
  //       setResults([]);
  //       return;
  //     }

  //     setIsLoading(true);
  //     // Simulating an API call with setTimeout
  //     setTimeout(() => {
  //       const mockResults = [
  //         { id: 1, title: "User 1" },
  //         { id: 2, title: "User 2" },
  //         { id: 3, title: "User 3" },
  //       ];
  //       setResults(mockResults);
  //       setIsLoading(false);
  //     }, 500);
  //   };

  //   fetchResults();
  // }, [searchTerm]);

  const handleSearchTerm = (e) => {
    const query = e.target.value;
    setIsLoading(true);
    setSearchTerm(query);
    if (query?.length > 0) {
      searchUser(query);
    } else {
      setIsLoading(false);
      setResults([]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="join w-full rounded flex justify-center my-4">
        <label className="input rounded focus:border-none outline-0 focus:outline-0 focus-within:outline-0">
          <UserSearch />
          <input
            ref={searchbarRef}
            type="search"
            className="focus:outline-0"
            placeholder="search user to connect"
            required
            value={searchTerm}
            onChange={handleSearchTerm}
          />
        </label>
        {/* <button type="submit" className="btn btn-neutral join-item">
          <UserSearch size={18} />
        </button> */}
      </div>
      <SearchResults
        results={results}
        isLoading={isLoading}
        searchTerm={searchTerm}
        setResults={setResults}
        setIsLoading={setIsLoading}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}
