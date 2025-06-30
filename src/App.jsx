import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";

// Inter font import
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

  // Load Inter font for spoken text
  useEffect(() => {
    const link = document.createElement('link');
    link.href = interFont;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Load voices for speech synthesis
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
    // Animate opacity to 0 over 5 seconds
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

  // Cooldown logic
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => {
      setCooldown(false);
      setWiggle(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cooldown) {
      setWiggle(true);
      return;
    }
    if (input.trim() === "") return;
    setSpokenText(input);
    setTranscript((prev) => [...prev, input]);
    // Speech synthesis with en-IN voice
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
      {/* Inter font link */}
      <link href={interFont} rel="stylesheet" />

      {/* Input form at bottom center */}
      <form
        onSubmit={handleSubmit}
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          gap: 8,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type something to speak..."
          style={{
            padding: "10px 16px",
            fontSize: "18px",
            width: "340px",
            borderRadius: "6px",
            border: "none",
            outline: "none",
            fontFamily: 'Inter, sans-serif',
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          disabled={cooldown}
        />
        <button
          type="submit"
          disabled={cooldown}
          onAnimationEnd={() => setWiggle(false)}
          style={{
            padding: "10px 24px",
            fontSize: "18px",
            borderRadius: "6px",
            border: "none",
            background: cooldown ? "#888" : "#1976d2",
            color: "#fff",
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            cursor: cooldown ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            animation: wiggle ? "wiggle 0.4s" : "none",
            transition: "background 0.3s, color 0.3s",
          }}
        >
          Speak
        </button>
      </form>
      {/* Wiggle keyframes */}
      <style>{`
        @keyframes wiggle {
          0% { transform: translateX(0); }
          15% { transform: translateX(-8px) rotate(-3deg); }
          30% { transform: translateX(8px) rotate(3deg); }
          45% { transform: translateX(-6px) rotate(-2deg); }
          60% { transform: translateX(6px) rotate(2deg); }
          75% { transform: translateX(-4px) rotate(-1deg); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* Spoken text at top center with fade-out */}
      {spokenText && (
        <div
          key={textKey}
          style={{
            position: "absolute",
            top: 30,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(30,30,30,0.85)",
            padding: "16px 32px",
            borderRadius: "10px",
            zIndex: 15,
            fontSize: "2rem",
            fontWeight: 700,
            color: "#fff",
            fontFamily: 'Inter, sans-serif',
            letterSpacing: 1,
            boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
            opacity: textOpacity,
            transition: "opacity 0.3s linear",
            pointerEvents: "none",
          }}
        >
          {spokenText}
        </div>
      )}

      {/* Transcript history panel */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          zIndex: 30,
          width: showTranscript ? 340 : 60,
          height: showTranscript ? 400 : 60,
          background: "rgba(30,30,30,0.95)",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
          overflow: "hidden",
          transition: "width 0.3s, height 0.3s",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button
          onClick={() => setShowTranscript((v) => !v)}
          style={{
            width: 60,
            height: 60,
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 32,
            cursor: "pointer",
            alignSelf: "flex-end",
            fontFamily: 'Inter, sans-serif',
          }}
          title={showTranscript ? "Collapse" : "Expand"}
        >
          {showTranscript ? "→" : "≡"}
        </button>
        {showTranscript && (
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 20px 16px 16px",
              color: "#fff",
              fontFamily: 'Inter, sans-serif',
              fontSize: "1.1rem",
              fontWeight: 400,
              display: "flex",
              flexDirection: "column-reverse",
              gap: 12,
            }}
          >
            {transcript.length === 0 ? (
              <span style={{ color: "#aaa" }}>No transcript yet.</span>
            ) : (
              transcript.map((t, i) => (
                <div key={i} style={{ wordBreak: "break-word" }}>{t}</div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 3D Canvas in bottom right overlay */}
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
