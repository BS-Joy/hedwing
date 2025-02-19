import { useState, useEffect, useRef } from "react";
import { UserSearch } from "lucide-react";
import SearchResults from "./SearchResults";
// import SearchResults from "./SearchResults"

export default function SearchUser({ showSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchbarRef = useRef(null);

  useEffect(() => {
    if (showSearch) {
      searchbarRef.current?.focus();
    } else {
      searchbarRef.current?.blur();
    }

    return () => searchbarRef.current?.blur();
  }, [showSearch]);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.trim() === "") {
        setResults([]);
        return;
      }

      setIsLoading(true);
      // Simulating an API call with setTimeout
      setTimeout(() => {
        const mockResults = [
          { id: 1, title: "User 1" },
          { id: 2, title: "User 2" },
          { id: 3, title: "User 3" },
        ];
        setResults(mockResults);
        setIsLoading(false);
      }, 500);
    };

    fetchResults();
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    // You can add additional search logic here if needed
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <form
        onSubmit={handleSearch}
        className="join w-full rounded flex justify-center my-4"
      >
        <label className="input rounded focus:border-none outline-0 focus:outline-0 focus-within:outline-0">
          <UserSearch />
          <input
            ref={searchbarRef}
            type="search"
            className="focus:outline-0"
            placeholder="search user to connect"
            required
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        {/* <button type="submit" className="btn btn-neutral join-item">
          <UserSearch size={18} />
        </button> */}
      </form>
      <SearchResults results={results} isLoading={isLoading} />
    </div>
  );
}
