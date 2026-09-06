import { useCallback, useEffect, useRef, useState } from "react";

type SpeechResultEvent = { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> };
type Recognition = { lang: string; continuous: boolean; interimResults: boolean; start: () => void; stop: () => void; onresult: ((event: SpeechResultEvent) => void) | null; onerror: ((event: { error: string }) => void) | null; onend: (() => void) | null };

function getRecognitionCtor(): (new () => Recognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeech(lang = "hi-IN") {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const ref = useRef<Recognition | null>(null);

  useEffect(() => { setSupported(getRecognitionCtor() !== null); return () => { ref.current?.stop(); }; }, []);

  const stop = useCallback(() => { ref.current?.stop(); setListening(false); }, []);

  const start = useCallback(() => {
    setError(null);
    const Ctor = getRecognitionCtor();
    if (!Ctor) { setSupported(false); setError("Voice input isn’t supported in this browser. Please type your description."); return; }
    const recognition = new Ctor();
    ref.current = recognition;
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i += 1) text += `${event.results[i]![0]!.transcript} `;
      setTranscript(text.trim());
    };
    recognition.onerror = (event) => {
      setError(event.error === "not-allowed" ? "Microphone permission was blocked. Allow mic access and try again." : "Could not hear clearly. Please try again.");
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
  }, [lang]);

  return { listening, transcript, setTranscript, error, supported, start, stop };
}
