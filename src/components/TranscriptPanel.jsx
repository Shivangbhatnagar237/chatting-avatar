import React from "react";

const TranscriptPanel = ({ transcript, showTranscript, setShowTranscript }) => (
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
);

export default TranscriptPanel; 