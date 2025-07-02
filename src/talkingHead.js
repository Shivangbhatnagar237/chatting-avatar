import { TalkingHead } from "@met4citizen/talkinghead";
import { HeadTTS } from "../headtts.mjs";

let headInstance = null;

// Use correct endpoint:

export const initTalkingHead = async (canvas, gltfScene) => {
  headInstance = new TalkingHead(canvas, {
    tts, // Pass the instance!
    gltf: gltfScene,
    lipsyncModules: ["en"],
  });
  await headInstance.ready;
}

export const speak = (text) => {
  if (!headInstance) throw new Error("TalkingHead not initialized");
  return headInstance.speakText(text);
}
