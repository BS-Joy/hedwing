import { MessageSquareX, Hand } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect } from "react";

export default function NoMessages() {
  const {
    getUsers,
    sendMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser, socket } = useAuthStore();

  useEffect(() => {
    subscribeToMessages(); // ✅ Listen for messages globally

    return () => unsubscribeFromMessages();
  }, []); // 🔥 Run once when component mounts

  const sayHi = async () => {
    const text = "Hi";
    try {
      await sendMessage({
        text: text.trim(),
      });

      getUsers(authUser);
    } catch (error) {
      console.error("Failed to sayhi:", error);
    }
  };

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
                 justify-center animate-bounce"
            >
              <MessageSquareX className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">No messages yet</h2>
        <p className="text-base-content/60">
          Looks like you haven't initiated a conversation yet!
        </p>
        <button
          onClick={sayHi}
          type="submit"
          className="btn bg-base/10 text-base duration-400"
        >
          Say hi <Hand size={16} />
        </button>
      </div>
    </div>
  );
}
