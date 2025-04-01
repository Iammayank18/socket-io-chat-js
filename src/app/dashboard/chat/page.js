"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import useSocket from "../../../hooks/useSocket";
import { useGlobalContext } from "../../../context/GlobalContextProvider";
import LabeledInput from "../../../component/LabeledInput";

const Chat = () => {
  const router = useRouter();
  const socket = useSocket();
  const { user } = useGlobalContext();
  const [room, setRoom] = useState("");

  const createChatRoom = () => {
    if (socket && room) {
      socket.emit("create-room", { room, user: user.session.email });
      socket.emit("rooms");
      router.push(`/dashboard/chat/${room}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
            Create Chat Room
          </h1>
          <div className="space-y-4 md:space-y-6">
            <div>
              <LabeledInput
                label="Room Name"
                id="email"
                type="text"
                placeholder="the hooders"
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>

            <button
              onClick={createChatRoom}
              className="w-full text-black bg-primary-600 border border-gray-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Create Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
