import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSocket from "./useSocket";
import { useGlobalContext } from "../context/GlobalContextProvider";

const useChatSocket = () => {
  const params = useParams();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const { user } = useGlobalContext();
  const messageListRef = useRef(null);

  useEffect(() => {
    if (!socket || !params?.id || !user?.session?.email) return;

    if (user.session.email && params?.id) {
      socket.emit("join-room", {
        room: params?.id,
        user: user.session.email,
      });
    }

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user_joined", (message) => {
      const systemMessage = {
        room: params.id,
        message,
        user: "system",
        timeStamp: new Date(),
      };

      setMessages((prev) => [...prev, systemMessage]);
    });

    socket.emit("debug-rooms");

    return () => {
      socket.off("message");
      socket.off("user_joined");
      socket.off("debug-rooms");
      socket.off("join-room");
    };
  }, [socket, params?.id, user]);

  useEffect(() => {
    if (!socket || !params?.id) return;

    socket.emit("messages", { room: params?.id });

    socket.on("messageList", (data) => {
      setMessages((prev) => [...prev, ...data.documents]);
    });

    return () => {
      socket.off("messages");
      socket.off("messageList");
    };
  }, [socket, params?.id]);

  const sendMessage = (msg) => {
    if (!socket || !msg || !params?.id) return;

    const msgData = {
      room: params?.id,
      message: msg,
      user: user.session.email,
      timeStamp: new Date(),
    };

    socket.emit("message", msgData);

    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top:
          messageListRef.current.scrollHeight -
          messageListRef.current.clientHeight,
        behavior: "smooth",
      });
    }
  };

  return { messages, sendMessage, messageListRef };
};

export default useChatSocket;
