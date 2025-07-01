import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import InputForm from "./components/InputForm";
import SpokenTextDisplay from "./components/SpokenTextDisplay";
import TranscriptPanel from "./components/TranscriptPanel";

const interFont = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap';

function App() {
  const [input, setInput] = useState("");
  const [spokenText, setSpokenText] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [textOpacity, setTextOpacity] = useState(1);
  const [textKey, setTextKey] = useState(0); // for remounting
  const [cooldown, setCooldown] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const voicesRef = useRef([]);
  const [voiceReady, setVoiceReady] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = interFont;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    function loadVoices() {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        voicesRef.current = voices;
        setVoiceReady(true);
      } else {
        setTimeout(loadVoices, 100);
      }
    }
    loadVoices();
  }, []);

  useEffect(() => {
    if (!spokenText) return;
    setTextOpacity(1);
    setTextKey((k) => k + 1); // force remount
    const fadeTimeout = setTimeout(() => setTextOpacity(0), 3000); // Start fade after render
    const clearTextTimeout = setTimeout(() => setSpokenText(""), 5050);
    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(clearTextTimeout);
    };
  }, [spokenText]);

  useEffect(() => {
    if (textOpacity === 1) return;
    let frame;
    let start;
    function animate(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const newOpacity = Math.max(1 - elapsed / 5000, 0);
      setTextOpacity(newOpacity);
      if (elapsed < 5000) {
        frame = requestAnimationFrame(animate);
      }
    }
    if (textOpacity > 0) {
      frame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(frame);
  }, [textOpacity, textKey]);

  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => {
      setCooldown(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cooldown) {
      setWiggle(false);
      setTimeout(() => setWiggle(true), 0);
      return;
    }
    if (input.trim() === "") return;
    setSpokenText(input);
    setTranscript((prev) => [...prev, input]);
    if (window.speechSynthesis) {
      const utterance = new window.SpeechSynthesisUtterance(input);
      let selectedVoice = null;
      if (voicesRef.current.length) {
        selectedVoice = voicesRef.current.find(v => v.lang === 'en-IN');
      }
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = 'en-IN';
      } else {
        utterance.lang = 'en-IN'; // fallback, browser may pick best
      }
      window.speechSynthesis.speak(utterance);
    }
    setInput("");
    setCooldown(true);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "#000",
        fontFamily: 'Inter, sans-serif',
        overflow: "hidden",
      }}
    >
      <link href={interFont} rel="stylesheet" />
      <InputForm
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        cooldown={cooldown}
        wiggle={wiggle}
        setWiggle={setWiggle}
      />
      <SpokenTextDisplay
        spokenText={spokenText}
        textOpacity={textOpacity}
        textKey={textKey}
      />
      <TranscriptPanel
        transcript={transcript}
        showTranscript={showTranscript}
        setShowTranscript={setShowTranscript}
      />
      <div
        style={{
          position: "absolute",
          right: 40,
          bottom: 40,
          width: 340,
          height: 420,
          zIndex: 10,
          background: "rgba(0,0,0,0.0)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <Canvas shadows camera={{ position: [0, 2, 5], fov: 30 }} style={{ background: "#000" }}>
          <color attach="background" args={["#000"]} />
          <Experience spokenText={spokenText} />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
