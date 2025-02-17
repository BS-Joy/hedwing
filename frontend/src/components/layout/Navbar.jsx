import { Link } from "react-router";
import { LogOut, Palette, Settings, User } from "lucide-react";
import { IoColorPaletteOutline } from "react-icons/io5";
import { useAuthStore } from "../../store/useAuthStore";
import logo from "../../assets/hedwing-logo-v3.svg";
import { GiOwl } from "react-icons/gi";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-90 transition-all"
            >
              <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center">
                {/* <img src={logo} alt="hedwing logo" /> */}
                <GiOwl size={25} />
              </div>
              <h1 className="text-2xl font-thin font-magicSchool2">HEDWING</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Themes</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="flex gap-2 items-center hover:cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
