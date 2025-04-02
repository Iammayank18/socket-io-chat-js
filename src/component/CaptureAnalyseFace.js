/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { base64ToFile } from "../functions/helper.function";
import { useAnalyseFace } from "../hooks/useAnalyseFace";
import Loader from "./Loader";

const CaptureAnalyseFace = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imagefile, setImageFile] = useState(null);
  const [opencam, setOpenCam] = useState(false);
  const { setImageUrl, isValidFace, error, loading, setError } =
    useAnalyseFace();

  const captureImage = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot(); // Capture as Base64 PNG
    const file = base64ToFile(webcamRef.current.getScreenshot()); // Capture as Base64 PNG

    setImageFile(file);
    setImage(imageSrc);
    setImageUrl(imageSrc);
  };

  const submitImage = () => {
    if (onCapture && image && isValidFace) {
      setOpenCam(!opencam);
      onCapture({ file: imagefile, base64: image });
    }
  };

  const openCamera = () => {
    setOpenCam(!opencam);
  };

  const onDecline = () => {
    setOpenCam(!opencam);
    setError("");
    setImage(null);
    setImageFile(null);
  };

  return (
    <div className=" overflow-y-scroll">
      {image && isValidFace ? (
        <div className="relative">
          <img
            src={image}
            alt="Captured Face"
            className="mt-4 w-40 h-40 rounded-lg"
          />
          <button
            type="button"
            className="absolute top-0 text-gray-100 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            data-modal-hide="default-modal"
            onClick={() => {
              setImage(null);
            }}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
      ) : (
        <button
          data-modal-target="default-modal"
          data-modal-toggle="default-modal"
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          type="button"
          onClick={openCamera}
        >
          Capture Image
        </button>
      )}

      {opencam && (
        <div
          id="default-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed flex top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full overflow-auto"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm ">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t  border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Capture your face
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                  data-modal-hide="default-modal"
                  onClick={onDecline}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-4 md:p-5 space-y-4">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/png"
                  videoConstraints={{ facingMode: "user" }}
                  className="rounded-lg shadow-md"
                  mirrored
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={captureImage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    {loading ? <Loader /> : " Capture Face"}
                  </button>
                  {error && !isValidFace && (
                    <p className="text-red-600 font-bold">{error}</p>
                  )}
                </div>
                {image && (
                  <img
                    src={image}
                    alt="Captured Face"
                    className="mt-4 w-40 h-40 rounded-lg"
                  />
                )}
              </div>

              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
                <button
                  data-modal-hide="default-modal"
                  type="button"
                  className={`text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                    !image || !isValidFace
                      ? "bg-gray-400"
                      : "bg-blue-700 hover:bg-blue-800"
                  }`}
                  onClick={submitImage}
                  disabled={!isValidFace || !image}
                >
                  Submit
                </button>
                <button
                  data-modal-hide="default-modal"
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                  onClick={onDecline}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptureAnalyseFace;
