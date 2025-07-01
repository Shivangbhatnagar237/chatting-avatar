import React from "react";

const SpokenTextDisplay = ({ spokenText, textOpacity, textKey }) => {
  if (!spokenText) return null;
  return (
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
        fontWeight: 400,
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
  );
};

export default SpokenTextDisplay; 