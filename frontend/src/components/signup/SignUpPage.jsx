import { Link } from "react-router";
import SignupForm from "./SignupForm";
import AuthPagesLayout from "../layout/AuthPagesLayout";

export default function SignUpPage() {
  return (
    <AuthPagesLayout
      title="Join Our Community"
      subtitle="Connet with the close ones in online."
    >
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
