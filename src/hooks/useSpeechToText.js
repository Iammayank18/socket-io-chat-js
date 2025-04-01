import { useEffect, useState } from "react";

export const useSpeechToText = () => {
  const [speakig, setSpeaking] = useState(false);
  const [speech, setSpeech] = useState("");

  const startListening = () => {
    // Support both standard and webkit prefix
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setSpeech(spokenText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setSpeaking(false);
    };

    recognition.start();
    setSpeaking(true);
  };

  useEffect(() => {
    if (speakig) {
      startListening();
    }
  }, [speakig, speech]);

  return {
    speakig,
    speech,
    setSpeaking,
  };
};
