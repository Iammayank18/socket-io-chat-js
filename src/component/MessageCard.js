import React from "react";
import { formatTime } from "../functions/helper.function";

const MessageCard = ({ message }) => {
  return (
    <div className="flex items-center bg-gray-100 rounded-xl p-2">
      <div className="flex-1 min-w-0">
        <p className="text-xs bg-amber-200 p-1 rounded-full text-center">
          {message?.user?.split("@")[0]}
        </p>
        <p className="text-sm inline-flex items-center text-gray-900">
          {message?.message}
        </p>
        <p className="text-xs text-gray-500 truncate dark:text-gray-400">
          {formatTime(
            new Date(message?.timeStamp || message?.$createdAt).getTime()
          )}
        </p>
      </div>
    </div>
  );
};

export default MessageCard;
