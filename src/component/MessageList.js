import React, { forwardRef } from "react";
import MessageCard from "./MessageCard";
import { useGlobalContext } from "../context/GlobalContextProvider";

const MessageList = forwardRef(({ messages }, ref) => {
  const { user } = useGlobalContext();

  return (
    <div
      className="flex flex-col sm:mt-14 h-[785px] md:h-[740px] overflow-y-scroll pb-4"
      ref={ref}
    >
      {messages.map((item) => {
        return (
          <div
            key={item.message}
            className={
              item?.user === "system"
                ? "self-center mb-2"
                : user?.session?.email !== item?.user
                ? "self-start mb-2"
                : "self-end mb-2"
            }
          >
            <MessageCard message={item} />
          </div>
        );
      })}
    </div>
  );
});
MessageList.displayName = "MessageList";

export default MessageList;
