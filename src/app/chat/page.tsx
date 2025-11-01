import { Suspense } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";

function ChatPageContent() {
  return <ChatInterface />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading StudyBot...</div>
          <div className="flex gap-1 justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
