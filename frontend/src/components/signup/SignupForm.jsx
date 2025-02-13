import { User, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import InputFieldWrapper from "../form/InputFieldWrapper";
import { useAuthStore } from "../../store/useAuthStore";

export default function SignupForm() {
  const { signupLoading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = (data) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* full name */}
      <InputFieldWrapper label={"Full Name"} error={errors.fullName}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <User
            className={`size-5 text-base-content/40 z-10 ${
              errors.fullName && "text-red-500/60"
            }`}
          />
        </div>
        <input
          {...register("fullName", {
            required: "Full name is required!",
            minLength: {
              value: 3,
              message: "Full name can't be less than 3 character!",
            },
          })}
          type="text"
          className={`input input-bordered w-full pl-10 focus:outline-0 ${
            errors.fullName && "border-red-500"
          }`}
          placeholder="John Doe"
        />
      </InputFieldWrapper>

      {/* email */}
      <InputFieldWrapper label={"Email"} error={errors.email}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail
            className={`size-5 text-base-content/40 z-10 ${
              errors.email && "text-red-500/60"
            }`}
          />
        </div>
        <input
          {...register("email", {
            required: "Email is required!",
          })}
          type="email"
          className={`input input-bordered w-full pl-10 focus:outline-0 ${
            errors.email && "border-red-500"
          }`}
          placeholder="john@gmail.com"
        />
      </InputFieldWrapper>

      {/* password */}
      <InputFieldWrapper label={"Password"} error={errors.password}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock
            className={`size-5 text-base-content/40 z-10 ${
              errors.password && "text-red-500/60"
            }`}
          />
        </div>
        <input
          {...register("password", {
            required: "Password is required!",
            minLength: {
              value: 6,
              message: "Password can't be less than 6 character!",
            },
          })}
          type="password"
          className={`input input-bordered w-full pl-10 focus:outline-0 ${
            errors.password && "border-red-500"
          }`}
          placeholder="******"
        />
      </InputFieldWrapper>

      {/* submit button */}
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={signupLoading}
      >
        {signupLoading ? (
          <>
            <span className="loading loading-ring loading-xl"></span>
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}
