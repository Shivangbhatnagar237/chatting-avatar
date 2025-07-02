export const playAudioBuffer = async (audioBuffer) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
    return new Promise(resolve => {
        source.onended = resolve;
    });
};