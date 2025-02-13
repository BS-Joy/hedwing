import { useRouteError, Link } from "react-router";

export default function ErrorPage({ errorProp }) {
  const error = useRouteError() || errorProp;

  const isNotFound = !error || error.status === 404;

  console.log("On error page:", error);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      {isNotFound ? (
        <>
          <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          <p className="text-gray-600 mt-2">
            The page you are looking for does not exist.
          </p>
          <Link
            to="/"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Go Home
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold">Something went wrong</h1>
          <p className="text-gray-600 mt-2">
            {error?.response?.data?.message ||
              error ||
              "An unexpected error occurred."}
          </p>
          <Link
            to="/"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Go Home
          </Link>
        </>
      )}
    </div>
  );
}
