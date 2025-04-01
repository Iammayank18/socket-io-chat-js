import React, { FC, FormEvent, useEffect, useState } from "react";
import { useSpeechToText } from "../hooks/useSpeechToText";
import Loader from "./Loader";

const MessageInput = ({ onSend }) => {
  const [mgs, setMsg] = useState("");
  const { setSpeaking, speakig, speech } = useSpeechToText();

  const handleSend = (e) => {
    e.preventDefault();
    onSend(mgs);
    setMsg("");
  };

  useEffect(() => {
    setMsg(speech);
  }, [speech]);
  return (
    <form className="flex items-center max-w-lg mx-auto" onSubmit={handleSend}>
      <label htmlFor="message-box" className="sr-only">
        Message
      </label>
      <div className="relative w-full">
        <input
          type="text"
          id="message-box"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="write message.."
          required
          value={mgs}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        />
        <button
          type="button"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
          onClick={() => {
            setSpeaking(true);
          }}
          disabled={speakig}
        >
          {speakig ? (
            <Loader />
          ) : (
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z"
              />
            </svg>
          )}
        </button>
      </div>
      <button
        type="submit"
        className="inline-flex gap-2 items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
      >
        Send
        <svg
          className="w-4 h-4 rotate-90 rtl:-rotate-90"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 18 20"
        >
          <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
        </svg>
      </button>
    </form>
  );
};

export default MessageInput;
