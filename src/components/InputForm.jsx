import React from "react";

const InputForm = ({ input, setInput, handleSubmit, cooldown, wiggle, setWiggle }) => (
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
    />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        animation: wiggle ? "wiggle 0.4s" : "none",
      }}
    //   onAnimationEnd={() => setWiggle(false)}
    >
      <button
        type="submit"
        disabled={cooldown}
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
          transition: "background 0.3s, color 0.3s",
        }}
      >
        Speak
      </button>
    </div>
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
  </form>
);

export default InputForm; 