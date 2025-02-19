const SearchResults = ({ results, isLoading }) => {
  if (results.length === 0 && !isLoading) return null;

  return (
    <div className="w-full bg-base-100 border border-primary rounded-md shadow-lg absolute z-10">
      {isLoading ? (
        <div className="p-4 text-center text-base-content">
          <span className="loading loading-ring loading-md"></span>
        </div>
      ) : (
        <ul className="py-2">
          {results.map((result) => (
            <li
              key={result.id}
              className="px-4 py-2 hover:bg-base-200 cursor-pointer"
            >
              {result.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
