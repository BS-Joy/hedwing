import { Link } from "react-router";
import AuthPagesLayout from "../layout/AuthPagesLayout";
import LogInForm from "./LogInForm";

export default function LogInPage() {
  return (
    <AuthPagesLayout
      title={"Welcome Back"}
      subtitle={"Sign in to your account"}
    >
      <LogInForm />
      <div className="text-center">
        <p className="text-base-content/60">
          Don't have an account?{" "}
          <Link to="/signup" className="link link-primary">
            Create Account
          </Link>
        </p>
      </div>
    </AuthPagesLayout>
  );
}
