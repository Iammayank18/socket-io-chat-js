"use client";
import React from "react";
import MessageList from "../../../../component/MessageList";
import MessageInput from "../../../../component/MessageInput";
import useChatSocket from "../../../../hooks/useChatSocket";
import { useRouter } from "next/navigation";
import Loader from "../../../../component/Loader";

const Chat = () => {
  const router = useRouter();
  const { messages, sendMessage, messageListRef } = useChatSocket();
  const handleNavigate = () => {
    router.back();
  };

  if (!messages.length) {
    return (
      <div className="flex justify-center items-center h-screen overflow-hidden">
        <Loader size={8} label={"Loading chats....."} />
      </div>
    );
  }

  return (
    <div className="mt-15">
      <button
        onClick={handleNavigate}
        className="inline-flex gap-2 items-center py-2.5 px-3 ms-2 text-sm font-medium cursor-pointer hover:text-gray-400"
      >
        <svg
          className="w-4 h-4 text-gray-800"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 5H1m0 0 4 4M1 5l4-4"
          />
        </svg>
        Chats
      </button>

      <MessageList ref={messageListRef} messages={messages} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default Chat;
