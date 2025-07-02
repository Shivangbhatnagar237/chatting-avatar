import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import InputForm from "./components/InputForm";
import SpokenTextDisplay from "./components/SpokenTextDisplay";
import TranscriptPanel from "./components/TranscriptPanel";
import { synthesizeSpeech } from "./utils/tts";
import { playAudioBuffer } from "./utils/audio";

const interFont = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap';

function App() {
  // UI state
  const [input, setInput] = useState("");
  const [spokenText, setSpokenText] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [textOpacity, setTextOpacity] = useState(1);
  const [textKey, setTextKey] = useState(0); // for remounting
  const [cooldown, setCooldown] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Lip sync state
  const [visemeSequence, setVisemeSequence] = useState(null);
  const [audioStartTime, setAudioStartTime] = useState(null);

  // Font loading
  useEffect(() => {
    const link = document.createElement('link');
    link.href = interFont;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Spoken text fade out
  useEffect(() => {
    if (!spokenText) return;
    setTextOpacity(1);
    setTextKey((k) => k + 1); // force remount
    const fadeTimeout = setTimeout(() => setTextOpacity(0), 3000);
    const clearTextTimeout = setTimeout(() => setSpokenText(""), 5050);
    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(clearTextTimeout);
    };
  }, [spokenText]);

  // Text fade animation
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

  // Cooldown for submit button
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => {
      setCooldown(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Handle text submit: TTS, audio, visemes
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cooldown) {
      setWiggle(false);
      setTimeout(() => setWiggle(true), 0);
      return;
    }
    if (input.trim() === "") return;
    setSpokenText(input);
    setTranscript((prev) => [...prev, input]);
    setInput("");
    setCooldown(true);

    let messages;
    try {
      messages = await synthesizeSpeech(input);
    } catch (err) {
      alert("TTS failed: " + err.message);
      setVisemeSequence(null);
      setAudioStartTime(null);
      return;
    }
    const audioMsg = messages.find(msg => msg.type === "audio");
    const visemes = audioMsg?.data?.visemes;
    const vtimes = audioMsg?.data?.vtimes;
    const vdurations = audioMsg?.data?.vdurations;
    const audioBuffer = audioMsg?.data?.audio;

    if (!audioBuffer || !visemes || !vtimes || !vdurations) {
      alert("TTS did not return audio or visemes.");
      setVisemeSequence(null);
      setAudioStartTime(null);
      return;
    }
    const visemeSequence = visemes.map((v, i) => ({
      value: v,
      time: vtimes[i] / 1000,      // convert ms to seconds
      duration: vdurations[i] / 1000
    }));
    // Set viseme sequence and start time BEFORE playing audio
    setVisemeSequence(visemeSequence);
    const startTime = performance.now() / 1000;
    setAudioStartTime(startTime);
    // Play audio
    setIsSpeaking(true);
    await playAudioBuffer(audioMsg.data?.audio);
    setIsSpeaking(false);
    // Clear viseme sequence after audio finishes
    setVisemeSequence(null);
    setAudioStartTime(null);
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
          <Experience
            spokenText={spokenText}
            visemeSequence={visemeSequence}
            audioStartTime={audioStartTime}
            isSpeaking={isSpeaking}
            
          />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
