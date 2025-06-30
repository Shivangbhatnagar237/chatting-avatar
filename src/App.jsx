import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";

function App() {
  const [input, setInput] = useState("");
  const [spokenText, setSpokenText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setSpokenText(input);
    // Speech synthesis
    const utterance = new window.SpeechSynthesisUtterance(input);
    window.speechSynthesis.speak(utterance);
    setInput("");
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <form
        onSubmit={handleSubmit}
        style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type something to speak..."
          style={{ padding: "8px", fontSize: "16px", width: "300px" }}
        />
        <button type="submit" style={{ padding: "8px 16px", marginLeft: "8px", fontSize: "16px" }}>
          Speak
        </button>
      </form>
      {spokenText && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.9)",
            padding: "12px 24px",
            borderRadius: "8px",
            zIndex: 10,
            fontSize: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {spokenText}
        </div>
      )}
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 30 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience spokenText={spokenText} />
      </Canvas>
    </div>
  );
}

export default App;
