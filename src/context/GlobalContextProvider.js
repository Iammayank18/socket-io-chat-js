"use client";

import React, { useContext, useEffect, useState, createContext } from "react";

import useSocket from "../hooks/useSocket";
import { useValidateUser } from "../hooks/useValidateUser";
import { useRouter } from "next/navigation";
import Loader from "../component/Loader";

const GlobalContext = createContext({
  user: null,
  setUser: (usr) => usr,
  isLoading: false,
  isLoggedIn: false,
  setIsLoggedIn: (bool) => bool,
  rooms: [],
  setRooms: (rooms) => rooms,
});
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const { user, loading, setUser } = useValidateUser();
  const socket = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (!socket) return;
    socket.emit("rooms");
    setTimeout(() => {
      socket.on("roomList", (roomlist) => {
        setChatRooms(roomlist.documents);
      });
    });
    return () => {
      socket.off("rooms");
    };
  }, [socket, user]);

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard/chat");
      } else {
        router.push("/auth/login");
      }
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader label={"Validating user..."} size={8} />
      </div>
    );
  }

  return (
    <GlobalContext.Provider
      value={{
        user: user,
        setUser,
        isLoading: loading,
        isLoggedIn,
        setIsLoggedIn,
        rooms: chatRooms,
        setRooms: setChatRooms,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
