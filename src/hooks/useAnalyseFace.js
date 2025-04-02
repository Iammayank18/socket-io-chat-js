import { useCallback, useEffect, useState } from "react";
import * as faceapi from "../face-api.min.js";

export const useAnalyseFace = () => {
  const [isValidFace, setIsValidFace] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [detection, setDetection] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Load models once when component mounts
  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      setMessage("Loading models...");
      setError("");

      try {
        await Promise.all([
          faceapi.nets.faceRecognitionNet.loadFromUri("/static/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/static/models"),
          faceapi.nets.ssdMobilenetv1.loadFromUri("/static/models"),
        ]);

        setMessage("Models loaded.");
        setModelsLoaded(true);
      } catch (err) {
        console.error("Error loading models:", err);
        setMessage("Error loading models.");
        setError("Error loading models.");
      } finally {
        setLoading(false);
      }
    };

    loadModels();
    return () => {
      setMessage("");
      setError("");
    };
  }, []); // Runs only once when the component mounts

  const analyzeFace = useCallback(async () => {
    if (!imageUrl || !modelsLoaded) return;

    setLoading(true);
    setMessage("Analyzing face...");
    setError("");

    try {
      const img = await faceapi.fetchImage(imageUrl);
      const detectionResult = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detectionResult) {
        setMessage("No face detected.");
        setError("No face detected.");
        setIsValidFace(false);
      } else {
        setMessage("Face detected.");
        setDetection(detectionResult);
        setIsValidFace(true);
      }
    } catch (err) {
      console.error("Error analyzing face:", err);
      setMessage("Face analysis failed.");
      setError("Face analysis failed.");
    } finally {
      setLoading(false);
    }
  }, [imageUrl, modelsLoaded]);

  // Run face analysis when a new image is set
  useEffect(() => {
    if (imageUrl && modelsLoaded) {
      analyzeFace();
    }

    return () => {
      setMessage("");
      setError("");
    };
  }, [imageUrl, modelsLoaded, analyzeFace]);

  return {
    isValidFace,
    loading,
    setImageUrl,
    message,
    detection,
    error,
    setError,
  };
};
