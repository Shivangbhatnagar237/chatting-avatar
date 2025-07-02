import { HeadTTS } from "../../headtts.mjs";

export function speakText(text, { onStart, onEnd } = {}) {
  if (!window.speechSynthesis) {
    alert("Speech Synthesis not supported in this browser.");
    return;
  }
  const utter = new window.SpeechSynthesisUtterance(text);
  if (onStart) utter.onstart = onStart;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
  return utter;
}

let isConnected = false;

const headtts = new HeadTTS({
  endpoints: ["ws://127.0.0.1:8882", "webgpu"],
  languages: ["en-us"],
  voices: ["af_bella", "am_fenrir"],
});

export async function connectHeadTTS() {
  if (!isConnected) {
    await headtts.connect();
    isConnected = true;
  }
}

export async function synthesizeSpeech(text, options = {}) {
  await connectHeadTTS();
  // options: { voice, language, speed, audioEncoding }
  await headtts.setup({
    voice: options.voice || "af_bella",
    language: options.language || "en-us",
    speed: options.speed || 1,
    audioEncoding: options.audioEncoding || "wav",
  });
  // Returns an array of messages: [{type: 'audio', data: ...}, {type: 'viseme', data: ...}, ...]
  return await headtts.synthesize({ input: text });
}
