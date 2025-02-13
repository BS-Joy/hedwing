import React, { useEffect } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";

export default function Home() {
  return (
    <div className="mt-16">
      <h1 className="text-red-500 text-4xl">Hello world</h1>
      <button className="btn btn-error">Error</button>
      <Link className="link link-success" to="/signup">
        To Signup page
      </Link>
    </div>
  );
}
