import * as faceapi from "../face-api.min.js";
import React, { FC, useCallback, useEffect, useState } from "react";
import { getAllUsers } from "../appwrite/appwrite.config";

const FaceRecognition = ({ imageUrl, setResult }) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Loading models...");
  const [matchResult, setMatchResult] = useState(null);

  const analyzeFace = useCallback(async () => {
    if (!imageUrl) return;

    // Reset states before analyzing a new image
    setMatchResult(null);
    setMessage("Analyzing face...");
    setLoading(true);

    try {
      const img = await faceapi.fetchImage(imageUrl);
      const labeledFaceDescriptors = await loadLabeledImages();

      if (labeledFaceDescriptors.length === 0) {
        setMessage("No labeled faces found.");
        setLoading(false);
        return;
      }

      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        setMessage("No face detected.");
        setLoading(false);
        return;
      }

      const bestMatch = faceMatcher.findBestMatch(detections.descriptor);

      if (bestMatch) {
        setMatchResult(bestMatch.toString());
        setResult(bestMatch.toString());
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
  }, [imageUrl, setResult]);

  const loadModels = useCallback(async () => {
    try {
      setMessage("Loading models...");
      setLoading(true);

      await Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri("/static/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/static/models"),
        faceapi.nets.ssdMobilenetv1.loadFromUri("/static/models"),
      ]);

      setMessage("Models loaded. Analyzing face...");
      analyzeFace();
    } catch (error) {
      console.error("Error loading models:", error);
      setMessage("Error loading models.");
    }
  }, [analyzeFace]);

  useEffect(() => {
    loadModels();
  }, [imageUrl, loadModels, setResult]);

  return (
    <div className="text-center p-4">
      {(loading || message) && <p>{message}</p>}
      {matchResult && <p>Match Result: {matchResult}</p>}
    </div>
  );
};

export default FaceRecognition;

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
