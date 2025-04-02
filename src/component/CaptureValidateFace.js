/* eslint-disable @next/next/no-img-element */
import * as faceapi from "../face-api.min.js";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { base64ToFile } from "../functions/helper.function";
import { useAnalyseFace } from "../hooks/useAnalyseFace";
import Loader from "./Loader";
import { getAllUsers } from "../appwrite/appwrite.config";

const CaptureValidateFace = ({ setResult }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [opencam, setOpenCam] = useState(false);
  const [message, setMessage] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    setImageUrl,
    isValidFace,
    error,
    loading: analysisLoading,
    detection,
    setError,
  } = useAnalyseFace();

  const captureImage = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot(); // Capture as Base64 PNG
    const file = base64ToFile(webcamRef.current.getScreenshot()); // Capture as PNG

    setImage(imageSrc);
    setImageUrl(imageSrc);
  };

  const analyzeFace = useCallback(async () => {
    if (!detection) return;

    setResult(null);
    setMessage("Analyzing face...");
    setMatchResult(null);
    setLoading(true);

    try {
      const labeledFaceDescriptors = await loadLabeledImages();
      if (!labeledFaceDescriptors.length) {
        setMessage("No labeled faces found.");
        return;
      }

      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
      const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

      if (bestMatch) {
        const resultText = bestMatch.toString();
        setMatchResult(resultText);
        setResult(resultText);
        setMessage("Face analysis complete.");
      } else {
        setMessage("No match found.");
      }
    } catch (error) {
      console.error("Error analyzing face:", error);
      setMessage("Face analysis failed.");
    } finally {
      setLoading(false);
    }
  }, [detection]);

  const submitImage = () => {
    if (image && isValidFace && detection) {
      setOpenCam(!opencam);
      analyzeFace();
    }
  };

  const onDecline = () => {
    setOpenCam(!opencam);
    setResult(null);
    setMessage("");
    setError("");
    setMatchResult(null);
    setImage(null);
  };

  const openCamera = () => {
    setOpenCam(!opencam);
  };

  return (
    <div className="flex justify-between">
      <div className="w-full">
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
            className="mx-auto block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
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

        {
          <div className="text-center p-4">
            {(loading || analysisLoading) && <Loader />}
            {message && <p>{message}</p>}
            {matchResult && <p>Match Result: {matchResult}</p>}
            {error && <p className="text-red-500">{error}</p>}
          </div>
        }
      </div>
    </div>
  );
};

export default CaptureValidateFace;

export async function loadLabeledImages() {
  try {
    const users = await getAllUsers(); // Fetch stored images
    return Promise.all(
      users.documents.map(async (user) => {
        const descriptions = [];
        const img = await faceapi.fetchImage(user.avatar);
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detections) {
          descriptions.push(detections.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(user.email, descriptions);
      })
    );
  } catch (error) {}
}
