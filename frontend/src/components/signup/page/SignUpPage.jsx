import { Link } from "react-router";
import logo from "../../../assets/hedwing-logo-v3.svg";
import AuthPagesLayout from "../../layout/AuthPagesLayout";
import SignupForm from "../SignupForm";
import AuthImagePattern from "../../AuthImagePattern";

export default function SignUpPage() {
  return (
    <AuthPagesLayout>
      <SignupForm />
      <div className="text-center">
        <p className="text-base-content/60">
          Already have an account?{" "}
          <Link to="/login" className="link link-primary">
            Sign in
          </Link>
        </p>
      </div>
    </AuthPagesLayout>
  );
}
