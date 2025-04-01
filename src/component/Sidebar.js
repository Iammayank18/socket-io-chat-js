"use client";
import React, { useState } from "react";
import Image from "next/image";
import useSocket from "../hooks/useSocket";
import { useParams, useRouter } from "next/navigation";
import { logoutUser } from "../appwrite/appwrite.config";
import { useGlobalContext } from "../context/GlobalContextProvider";
import Logo from "./Logo";
import { useDevice } from "../hooks/useDevice";

const Sidebar = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(true);
  const { isDesktop } = useDevice();
  const socket = useSocket();
  const router = useRouter();
  const params = useParams();
  const { user, rooms, setIsLoggedIn, setUser } = useGlobalContext();

  const handleJoinRoom = (room) => {
    if (socket && room) {
      socket.emit("join-room", { room, user: user.session.email });
      router.push(`/dashboard/chat/${room}`);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setIsLoggedIn(false);
      setUser(null);
      setLoading(false);
      router.push("/auth/login");
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                type="button"
                onClick={() => setOpenSidebar(!openSidebar)}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <Logo />
            </div>
            <div className="flex items-center">
              <div className="items-center ms-3 relative">
                <div>
                  <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                    onClick={() => setOpenMenu(!openMenu)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <Image
                      className="w-8 h-8 rounded-full"
                      src={
                        user?.db?.documents[0]?.avatar ||
                        "https://ui-avatars.com/api/?name=John+Doe&background=random"
                      }
                      alt="user photo"
                      width={10}
                      height={10}
                    />
                  </button>
                </div>
                {openMenu && (
                  <div className="absolute right-0 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm">
                    <div className="px-4 py-3" role="none">
                      <p className="text-sm text-gray-900 " role="none">
                        {user?.session?.email?.split("@")[0]}
                      </p>
                      <p
                        className="text-sm font-medium text-gray-900 truncate "
                        role="none"
                      >
                        {user?.session?.email}
                      </p>
                    </div>
                    <ul className="py-1" role="none">
                      <li onClick={logout}>
                        <a
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          role="menuitem"
                        >
                          {loading ? "Signing out...." : " Sign out"}
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {(isDesktop ? isDesktop : openSidebar) && (
        <aside
          className="fixed z-40 w-64 h-screen pt-20  bg-white border-r border-gray-200 overflow-y-hidden"
          aria-label="Sidebar"
        >
          <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
            <h1 className="text-lg text-gray-600">Availabel Rooms 🏠</h1>
            <ul className="space-y-2 font-medium mt-4">
              {!rooms?.length && <h2>There is no room found</h2>}
              {rooms?.length &&
                rooms?.map((item) => (
                  <li
                    key={item.name}
                    onClick={(e) => {
                      e.preventDefault();
                      handleJoinRoom(item.name);
                    }}
                  >
                    <p
                      className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group cursor-pointer ${
                        item.name === params.id && "border"
                      }`}
                    >
                      <svg
                        className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 21"
                      >
                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                      </svg>
                      <span className="ms-3">{item.name}</span>
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      )}
      <div className="p-4 sm:ml-64">{children}</div>
    </div>
  );
};

export default Sidebar;
