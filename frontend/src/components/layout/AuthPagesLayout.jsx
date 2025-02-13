import logo from "../../assets/hedwing-logo-v3.svg";
import AuthImagePattern from "../AuthImagePattern";

export default function AuthPagesLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2">
              <div
                className="size-12 rounded-xl  flex items-center justify-center 
                  group-hover:bg-primary/20 transition-colors"
              >
                <img src={logo} alt="hedwing logo" />
              </div>
              <h1 className="text-2xl font-bold mt-2">{title}</h1>
              <p className="text-base-content/60">{subtitle}</p>
            </div>
          </div>
          {children}
        </div>
      </div>
      <AuthImagePattern title={title} subtitle={subtitle} />
    </div>
  );
}
