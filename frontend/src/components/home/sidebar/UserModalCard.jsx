import { UserPlus, ShieldX } from "lucide-react";

export default function UserModalCard() {
  return (
    <div className="flex  flex-col items-center justify-center space-y-4 rounded-xl bg-base p-8 shadow-lg dark:bg-[#18181B]">
      <div className="group relative">
        <img
          width={110}
          height={110}
          className="h-[110px] w-[110px] rounded-full bg-slate-500 object-cover"
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop"
          alt="card navigate ui"
        />
        <span className="absolute bottom-3 right-0 h-5 w-5 rounded-full border-[3px] border-white bg-green-500 dark:border-[#18181B]"></span>
        <span className="absolute bottom-3 right-0 h-5 w-5 animate-ping rounded-full bg-green-500"></span>
      </div>
      <div className="space-y-1 text-center">
        <h1 className="text-2xl  dark:text-white/90">Nullify</h1>
        <p className="text-sm text-gray-400">nulify@gmail.com</p>
      </div>
      <div className="flex w-full justify-center py-2">
        <div className="space-y-1 text-center">
          <p className="text-gray-500 dark:text-white/70">Friends </p>
          <p className="font-mono text-xl text-gray-700 dark:text-white/50">
            11
          </p>
        </div>
        {/* <div className="space-y-1 text-center">
          <p className="text-gray-500 dark:text-white/70">Following</p>
          <p className="font-mono text-xl text-gray-700 dark:text-white/50">
            250
          </p>
        </div>
        <div className="space-y-1 text-center ">
          <p className="text-gray-500 dark:text-white/70">Followers</p>
          <p className="font-mono text-xl text-gray-700 dark:text-white/50">
            11
          </p>
        </div> */}
      </div>
      {/* bio  */}
      {/* <p className="pb-2 text-center text-sm text-gray-500">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore error
        ipsum officiis debitis quo odio?
      </p> */}
      {/* social icons  */}
      {/* <div className="flex justify-between gap-4 py-2">
        {svgArr?.map((svg, idx) => (
          <div
            key={idx}
            className="rounded-full shadow-[0px_2px_8px_0px_rgba(99,99,99,0.4)]  duration-300 hover:scale-150"
          >
            {svg?.svg}
          </div>
        ))}
      </div> */}
      <div className="flex justify-between gap-6 w-full">
        <button className="w-full flex justify-center items-center gap-2 rounded-full py-2 text-[12px] font-semibold hover:bg-lime-500 hover:text-black hover:border-lime-500 border transition-colors duration-500 sm:text-sm md:text-base cursor-pointer">
          <UserPlus size={20} /> <span>Connect</span>
        </button>
        <button className="w-full flex justify-center items-center gap-2 rounded-full py-2 text-[12px] font-semibold border border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-colors duration-500 sm:text-sm md:text-base cursor-pointer">
          <ShieldX size={20} />
          Block
        </button>
      </div>
    </div>
  );
}
