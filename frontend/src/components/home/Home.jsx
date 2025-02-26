import ChatContainer from "./ChatContainer";
import NoChatSelected from "./NoChatSelected";
import { useChatStore } from "../../store/useChatStore";
import Sidebar from "./sidebar/Sidebar";
import { useEffect } from "react";

const HomePage = () => {
  const { selectedUser, subscribeToMessages, unsubscribeFromMessages } =
    useChatStore();

  // useEffect(() => {
  //   subscribeToMessages(); // ✅ Listen for messages globally

  //   return () => unsubscribeFromMessages();
  // }, []); // 🔥 Run once when component mounts

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-32 sm:pt-20 px-0 sm:px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex flex-col sm:flex-row h-full rounded-lg">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
