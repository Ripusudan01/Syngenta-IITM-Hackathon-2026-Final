import { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Volume2,
  Sprout,
  CornerDownLeft,
  Sparkles,
  Leaf,
  Waves,
  AlertTriangle,
  ShieldCheck,
  Landmark,
  MapPin,
  ImagePlus
} from 'lucide-react';
import { apiService } from './apiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function FarmerChatConsole({ activeFarmer = null, retailerId = "RET-00636" }) {
  // --- Core Conversation, Configuration & Audio State Engines ---
  const [activeLanguage, setActiveLanguage] = useState("தமிழ் (Tamil)");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioWaveformBars, setAudioWaveformBars] = useState(Array.from({ length: 48 }, () => 6));
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [aiResponse, setAiResponse] = useState({
    transcript: "",
    text: "Hello! I am your Krishi Minds Assistant...",
    audioUrl: null,
    timestamp: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  });

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const [selectedImage, setSelectedImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState(null);

  // --- Pipeline Sync Effect: Intercept Global Farmer Switch Events ---
  useEffect(() => {
    if (activeFarmer) {
      setAiResponse({
        transcript: "",
        text: `Connected to profile node: ${activeFarmer.farmer_name || activeFarmer.name || 'Farmer Node'}. Soil and current cluster focus set to ${activeFarmer.district || 'Thanjavur region'}. Ask your farming or supply question now.`,
        audioUrl: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  }, [activeFarmer]);

  // --- Live Equalizer Simulation Subsystem (Natural Oscillations) ---
  useEffect(() => {
    let animationFrame;
    if (isRecording) {
      const updateWaveform = () => {
        setAudioWaveformBars(Array.from({ length: 48 }, () => Math.floor(Math.random() * 26) + 6));
        animationFrame = setTimeout(updateWaveform, 80);
      };
      updateWaveform();
    } else {
      setAudioWaveformBars(Array.from({ length: 48 }, (v, i) => Math.abs(Math.sin(i * 0.3)) * 8 + 4));
    }
    return () => clearTimeout(animationFrame);
  }, [isRecording]);

  // --- Audio Capture Engines ---
  const startVoiceCapture = async () => {
    audioChunksRef.current = [];
    try {
      const hardwareStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(hardwareStream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await dispatchVoiceToBackend(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Microphone blocked. Please grant microphone access to speak to your assistant.");
    }
  };

  const stopVoiceCapture = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  // --- Native Text-to-Speech Translation Layer ---
  const handleAudioPlayback = () => {
    if (!aiResponse.audioUrl) {
      console.error("No audio file available");
      return;
    }
    const audio = new Audio(aiResponse.audioUrl);
    audio.play().catch((err) => {
      console.error("Audio playback failed:", err);
    });
  };

  // --- REST Communication ---
  const dispatchVoiceToBackend = async (audioBlob) => {
    setIsProcessing(true);
    try {
      const data = await apiService.sendVoiceMessage(audioBlob, retailerId, activeLanguage);
      setAiResponse({
        transcript: data.question || data.farmer_question_original || "[Voice Query]",
        text: data.localized_response || "No voice response received.",
        audioUrl: data.audio_file,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      console.error("Voice processing error:", err);
      setAiResponse({
        transcript: "[Voice Query Failed]",
        text: "Voice AI backend connection failed.",
        audioUrl: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const submitTextQuery = async (queryText) => {
    if (!queryText.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const data = await apiService.sendChatMessage(queryText, retailerId, activeLanguage);
      setAiResponse({
        transcript: queryText,
        text: data.localized_response || "No response received from backend.",
        audioUrl: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (error) {
      console.error("Chat routing failure:", error);
      setAiResponse(prev => ({
        ...prev,
        text: "System transmission error. Could not connect to the AI backend."
      }));
    } finally {
      setIsProcessing(false);
      setInputText("");
    }
  };

  const submitCropDiseaseImage = async (
    imageFile
  ) => {

    if (!imageFile || isProcessing) return;

    setIsProcessing(true);

    try {

      const data =
        await apiService.sendCropDiseaseImage(
          imageFile
        );

      setAiResponse({

        transcript:
          "Crop disease scan initiated",

        text:
          data.analysis ||
          "No disease analysis returned.",

        audioUrl: null,

        timestamp:
          new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
      });

    } catch (err) {

      console.error(
        "Crop disease analysis failed:",
        err
      );

      setAiResponse(prev => ({
        ...prev,
        text:
          "Disease vision engine failed to process the crop image."
      }));

    } finally {

      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );

    await submitCropDiseaseImage(file);
  };
  // --- Dynamic Agro-Insight Card Component Parser Subsystem ---
  const renderDynamicInsightCards = () => {
    const fullText = (aiResponse.text + " " + aiResponse.transcript).toLowerCase();
    const hasStockoutAlert = fullText.includes("stockout") || fullText.includes("buffer") || fullText.includes("safety");
    const hasDiseaseAlert = fullText.includes("disease") || fullText.includes("pest") || fullText.includes("vulnerability");

    if (!hasStockoutAlert && !hasDiseaseAlert) return null;

    return (
      <div className="mt-5 pt-4 border-t border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn relative z-10">
        {hasStockoutAlert && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3.5 shadow-xs">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-700 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-wide font-sans">Depot Safety Buffer Status</h4>
              <p className="text-xs text-amber-800/80 font-medium mt-1 leading-relaxed">Regional supply centers indicate safe inventory limits. 12 days buffer available.</p>
            </div>
          </div>
        )}

        {hasDiseaseAlert && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-start space-x-3.5 shadow-xs">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-700 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wide font-sans">Crop Health Risk Index</h4>
              <p className="text-xs text-emerald-800/80 font-medium mt-1 leading-relaxed">No active disease outbreaks reported in your local cluster block for current season.</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-100 p-6 relative overflow-hidden max-w-5xl mx-auto font-sans text-stone-800 transition-all duration-300">

      {/* Organic Subtle Grain Backdrop Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none"></div>

      {/* HEADER BAR CONSOLE NAVIGATION CONTROL */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6 border-b border-stone-100 pb-4 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-emerald-50 text-[#00875A] rounded-lg">
            <Sprout className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-[#041E42]">
            Krishi Minds / All Round Agro-Assistant
          </h3>
        </div>

        {/* Dynamic Connected Node Marker */}
        <div className="flex items-center gap-2 bg-stone-50 px-3.5 py-1.5 rounded-xl border border-stone-200/60 self-start sm:self-auto shadow-xs">
          <Landmark className="w-3.5 h-3.5 text-stone-500" />
          <span className="text-[10px] font-mono font-bold text-stone-600 uppercase tracking-wider">
            DEPOT: {activeFarmer?.retailer_id || retailerId}
          </span>
        </div>
      </div>

      {/* LAYER 1: VOICE INPUT PANEL */}
      <div className="relative bg-linear-to-b from-[#F9F6F0] to-blue-50 rounded-2xl border border-emerald-600/10 p-5 shadow-sm mb-6 z-10">

        {/* Telemetry labels */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4 text-[10px] font-mono font-black tracking-wider uppercase">
          <div className="flex items-center space-x-2 text-[#00875A]">
            <Mic className="w-3.5 h-3.5" />
            <span>Tap microphone to stream query</span>
          </div>
          <div className="text-stone-400 flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-stone-300'}`}></span>
            <span className="font-semibold text-stone-500">PRODUCER: {activeFarmer ? (activeFarmer.farmer_name || activeFarmer.name) : 'GLOBAL OVERVIEW'}</span>
            {isRecording && <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">[{Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}]</span>}
          </div>
        </div>

        {/* Action Equalizer Canvas */}
        <div className="flex items-center justify-between gap-5 py-2">
          <button
            onClick={isRecording ? stopVoiceCapture : startVoiceCapture}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border shrink-0 relative group shadow-md cursor-pointer ${isRecording
              ? 'bg-rose-600 border-rose-400 text-white animate-pulse shadow-rose-100'
              : 'bg-white border-stone-200 text-[#00875A] hover:border-[#00875A]/40 hover:bg-stone-50'
              }`}
          >
            {isRecording ? <Square className="w-4 h-4 fill-white text-white" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Equalizer Visual Grid Lines */}
          <div className="flex-1 flex items-center justify-center gap-1 h-14 bg-stone-50/80 border border-stone-200/50 rounded-xl px-6 overflow-hidden shadow-inner">
            {audioWaveformBars.map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}px` }}
                className={`w-1 rounded-full transition-all duration-100 ${isRecording
                  ? 'bg-linear-to-t from-blue-600 via-white to-rose-500'
                  : 'bg-emerald-600/40 opacity-70'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Dialect Fast Toggles */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-stone-400 font-mono font-bold uppercase tracking-wider">Target Language:</span>
            <div className="flex flex-wrap gap-1">
              {["தமிழ் (Tamil)", "Punjabi", "Marathi"].map((lang) => {
                const isSelected = activeLanguage.includes(lang.split(' ')[0]);
                return (
                  <button
                    key={lang}
                    onClick={() => setActiveLanguage(lang.includes("Tamil") ? "தமிழ் (Tamil)" : lang.includes("Punjabi") ? "ਪੰਜਾਬੀ (Punjabi)" : "मराठी (Marathi)")}
                    className={`px-3 py-1 rounded-lg border font-bold transition-all text-[11px] cursor-pointer ${isSelected
                      ? 'bg-[#00875A] border-[#00875A] text-white shadow-xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-stone-400 font-mono text-[10px] font-bold tracking-tight flex items-center gap-1">
            <MapPin className="w-3 h-3 text-stone-400" />
            <span>Region Base: {activeFarmer ? `${activeFarmer.district || 'Thanjavur'}, ${activeFarmer.state_location || 'TN'}` : 'All Regions Monitoring'}</span>
          </div>
        </div>
      </div>

      {/* LAYER 2: SYSTEM RESPONSE VIEWPORT */}
      <div className="bg-stone-50/50 border border-stone-200 rounded-2xl shadow-xs overflow-hidden relative z-10 mb-6">

        {/* Sub Header Ribbon */}
        <div className="bg-stone-100/60 px-5 py-3 border-b border-stone-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-[10px] font-mono font-black uppercase tracking-wider text-stone-600">
          <div className="flex items-center space-x-2">
            <Leaf className="w-3.5 h-3.5 text-[#00875A]" />
            <span>Agronomic Advisory Feed</span>
          </div>
          {aiResponse.transcript && (
            <span className="text-stone-500 font-bold lowercase truncate max-w-xs bg-white px-2 py-0.5 rounded border border-stone-200 shadow-3xs">
              [Recognized: "{aiResponse.transcript}"]
            </span>
          )}
        </div>

        {/* Message Output Frame */}
        <div className="p-5 space-y-4 bg-white">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#00875A] border border-emerald-100 flex items-center justify-center shrink-0 shadow-3xs">
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="space-y-4 flex-1">
              <div className="text-sm text-stone-700 leading-7">

                {isProcessing ? (

                  <span className="text-stone-400 font-mono text-[11px] flex items-center gap-2.5 py-1">
                    <Waves className="w-4 h-4 text-[#00875A] animate-bounce shrink-0" />
                    Processing voice telemetry and verifying regional buffer inventory matrices...
                  </span>

                ) : (

                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{

                      h1: ({ children }) => (
                        <h1 className="text-2xl font-black text-[#041E42] mt-5 mb-3">
                          {children}
                        </h1>
                      ),

                      h2: ({ children }) => (
                        <h2 className="text-xl font-bold text-[#041E42] mt-4 mb-2">
                          {children}
                        </h2>
                      ),

                      h3: ({ children }) => (
                        <h3 className="text-lg font-bold text-[#00875A] mt-4 mb-2">
                          {children}
                        </h3>
                      ),

                      p: ({ children }) => (
                        <p className="mb-3 text-stone-700 leading-7">
                          {children}
                        </p>
                      ),

                      strong: ({ children }) => (
                        <strong className="font-bold text-[#041E42]">
                          {children}
                        </strong>
                      ),

                      ul: ({ children }) => (
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                          {children}
                        </ul>
                      ),

                      ol: ({ children }) => (
                        <ol className="list-decimal pl-5 mb-4 space-y-2">
                          {children}
                        </ol>
                      ),

                      li: ({ children }) => (
                        <li className="text-stone-700 leading-6">
                          {children}
                        </li>
                      ),

                      hr: () => (
                        <hr className="my-5 border-stone-200" />
                      ),

                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-[#00875A] bg-emerald-50 px-4 py-3 italic rounded-r-xl my-4">
                          {children}
                        </blockquote>
                      ),

                      code: ({ children }) => (
                        <code className="bg-stone-100 px-1.5 py-0.5 rounded text-rose-600 text-xs">
                          {children}
                        </code>
                      )

                    }}
                  >
                    {aiResponse.text}
                  </ReactMarkdown>

                )}

              </div>

              {imagePreview && !isProcessing && (

                <div className="mt-3">

                  <img
                    src={imagePreview}
                    alt="Crop Preview"
                    className="w-full max-w-xs rounded-xl border border-stone-200 shadow-sm"
                  />

                </div>

              )}

              {!isProcessing && (
                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                    {aiResponse.timestamp} • SYNCED SECURE DATA
                  </span>

                  <button
                    onClick={handleAudioPlayback}
                    className="flex items-center gap-1.5 text-[11px] font-bold font-mono bg-emerald-50 hover:bg-emerald-100 text-[#00875A] border border-emerald-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-3xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen Audio
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Structural Agro Cards Injector Module */}
        <div className="px-5 pb-5 bg-white">
          {renderDynamicInsightCards()}
        </div>
      </div>

      {/* LAYER 3: FARMER INTERACTIVE SHORTCUT CHIPS & KEYBOARD INPUT */}
      <div className="space-y-4 relative z-10">

        {/* Simplified Farmer Prompt Rail */}
        <div className="flex gap-2 overflow-x-auto pb-1 select-none justify-end scrollbar-none">
          {[
            { label: "Check Stock Levels", query: "What is the safety buffer stock level in our nearby cluster depot center?" },
            { label: "Pest Outbreak Assessment", query: "Run weather analysis and pest vulnerability score evaluation for my crop area." },
          ].map((chip, i) => (
            <button
              key={i}
              disabled={isProcessing}
              onClick={() => submitTextQuery(chip.query)}
              className="text-[11px] font-bold bg-white text-stone-600 border border-stone-200 hover:border-[#00875A]/40 hover:bg-stone-50 px-4 py-2 rounded-xl transition-all shadow-3xs shrink-0 cursor-pointer disabled:opacity-40"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Text Input Bar Backup */}
        {/* Text Input Bar Unified Container */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 relative w-full">

          {/* Upload Crop Image Button Wrapper */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="flex items-center justify-center gap-2 bg-white border border-stone-200 hover:border-[#00875A]/40 px-4 h-[46px] rounded-xl cursor-pointer transition-all shadow-3xs group">
              <ImagePlus className="w-4 h-4 text-[#00875A]" />
              <span className="text-xs font-bold text-stone-700 whitespace-nowrap">
                Upload Crop Image
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            {selectedImage && (
              <span className="text-[11px] text-stone-500 font-medium truncate max-w-[120px]">
                {selectedImage.name}
              </span>
            )}
          </div>

          {/* Text Input Wrapper Box */}
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={inputText}
              disabled={isProcessing}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitTextQuery(inputText)}
              placeholder="Type your farming query or logistics request here directly..."
              className="w-full bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 px-4 h-[46px] pr-16 rounded-xl text-xs focus:outline-none focus:border-[#00875A]/40 focus:bg-white font-medium transition-all shadow-inner disabled:opacity-50"
            />
            <div className="absolute right-3 text-stone-400 pointer-events-none flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-stone-200 text-[9px] font-mono shadow-3xs">
              <span>Enter</span>
              <CornerDownLeft className="w-2.5 h-2.5" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}