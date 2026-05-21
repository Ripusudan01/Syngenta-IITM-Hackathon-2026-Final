import { useState, useRef } from 'react';
import { Sparkles, Mic, Send, Volume2 } from 'lucide-react';
// 1. IMPORT YOUR EXISTING API SERVICE
import { apiService } from './apiService';

export default function RegionalVoiceAssistant({ nodeProfile }) {
  const [isAudioStreaming, setIsAudioStreaming] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // New state to manage loaders

  // Refs for real hardware browser microphone stream capturing
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Dynamic initialization dictionary mirroring backend mapping parameters
  const generateLinguisticWelcomeText = () => {
    switch (nodeProfile?.preferred_language) {
      case 'Punjabi':
        return "🌾 ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ VAANI AI ਸਹਾਇਕ ਹਾਂ। ਆਪਣੇ ਪਿੰਡ ਦੀ ਫਸਲ ਸੁਰੱਖਿਆ ਬਾਰੇ ਪੁੱਛੋ।";
      case 'Marathi':
        return "🌾 नमस्कार! मी आपला VAANI AI सहाय्यक आहे. आपल्या पिकाच्या आरोग्याबद्दल विचारा.";
      case 'Tamil':
        return "🌾 வணக்கம்! நான் உங்கள் VAANI AI உதவியாளர். உங்கள் பயிரின் பாதுகாப்பு பற்றி கேளுங்கள்.";
      default:
        return "🌾 नमस्ते! मैं आपका वाणी AI सहायक हूँ। अपनी फसल के स्वास्थ्य के बारे में पूछें।";
    }
  };

  // Chat log now stores text along with its corresponding backend synthesized audio URL
  const [chatLog, setChatLog] = useState([
    { source: 'system', output: generateLinguisticWelcomeText(), audioUrl: null }
  ]);

  // 2. LIVE TEXT QUERY RESOLUTION VIA BACKEND
  const handleMessageDispatch = async (e) => {
    e.preventDefault();
    if (!textInput.trim() || isProcessing) return;

    const currentQuery = textInput;
    setChatLog(prev => [...prev, { source: 'user', output: currentQuery }]);
    setTextInput('');
    setIsProcessing(true);

    try {
      // Connects to your FastAPI @app.post("/api/chat") through your configured apiService
      const data = await apiService.sendChatMessage(
        currentQuery,
        nodeProfile?.retailer_id || "RTL_00001",
        nodeProfile?.preferred_language || "Hindi"
      );

      setChatLog(prev => [...prev, {
        source: 'system',
        output:
          data.localized_response,
        audioUrl: data.audio_file ? `http://localhost:8000/${data.audio_file}` : null
      }]);
    } catch (error) {
      console.error("Failed to fetch response from Krishi Minds API Backend:", error);
      setChatLog(prev => [...prev, {
        source: 'system',
        output: "Error: Could not reach the language processing server. Please verify connections."
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. LIVE VOICE STREAM CAPTURING & BACKEND PIPELINE RESOLUTION
  const toggleVoiceRecordingStream = async () => {
    if (isAudioStreaming) {
      // Stop ongoing recording hardware stream loop
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsAudioStreaming(false);
    } else {
      audioChunksRef.current = [];
      try {
        // Access raw user hardware microphone input parameters securely
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          // Construct real compliant binary audio blob element mapping directly against multi-part requirements
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          setIsProcessing(true);

          setChatLog(prev => [...prev, { source: 'user', output: "🎙️ [Sending voice recording payload...]" }]);

          try {
            // Dispatches to your FastAPI @app.post("/api/voice-chat") payload handler 
            const data = await apiService.sendVoiceMessage(
              audioBlob,
              nodeProfile?.retailer_id || "RTL_00001",
              nodeProfile?.preferred_language || "Hindi"
            );

            setChatLog(prev => [...prev, {
              source: 'system',
              output: data.localized_response || data.response_english,
              audioUrl: data.audio_file ? `http://localhost:8000/${data.audio_file}` : null
            }]);
          } catch (err) {
            console.error("Failed processing voice chat parameters:", err);
            setChatLog(prev => [...prev, { source: 'system', output: "Voice parsing pipeline failed. Please try again." }]);
          } finally {
            setIsProcessing(false);
          }

          // Kill micro tracks immediately to dismiss active browser tab recording UI alerts
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsAudioStreaming(true);
      } catch (err) {
        console.error("Microphone hardware configuration access denied:", err);
        alert("Please enable mic access permission to send voice inquiries.");
      }
    }
  };

  // 4. TEXT-TO-SPEECH (TTS) AUDIO STREAM PLAYBACK ENGINE
  const playVoiceFeed = (audioUrl) => {
    if (!audioUrl) {
      alert("No speech output audio generated for this specific advisory message frame.");
      return;
    }
    const audio = new Audio(audioUrl);
    audio.play().catch(err => console.error("Audio element context playback stream failed:", err));
  };

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-4 text-left font-sans">

      <div className="space-y-1 border-b border-[#ede7dc] pb-3">
        <div className="flex items-center space-x-2 text-[#2a7040]">
          <Sparkles className="w-4 h-4 fill-current" />
          <h4 className="text-xs font-bold font-serif text-[#1a1208] uppercase tracking-wider">VAANI AI Language Processing Panel</h4>
        </div>
        <p className="text-[11px] text-[#8a7860] leading-normal">
          Active Preferred Communication Vector Base Language Mode: <strong>{nodeProfile?.preferred_language || 'Hindi'} Core</strong>.
        </p>
      </div>

      {/* LIVE INTERACTIVE STREAM DISPLAY FEED CHAT CONTAINER */}
      <div className="flex-1 overflow-y-auto bg-[#f6f1e9]/40 rounded-xl border border-[#cfc4b0] p-3 space-y-3 min-h-[300px]">
        {chatLog.map((chat, idx) => (
          <div key={idx} className={`flex flex-col max-w-[85%] space-y-1 ${chat.source === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
            <div className={`p-2.5 rounded-xl text-xs font-medium shadow-sm leading-relaxed ${chat.source === 'user'
              ? 'bg-[#2a7040] text-white rounded-br-none'
              : 'bg-white text-[#1a1208] border border-[#cfc4b0]/40 rounded-bl-none'
              }`}>
              <p>{chat.output}</p>
            </div>
            {chat.source === 'system' && (
              <button
                type="button"
                onClick={() => playVoiceFeed(chat.audioUrl)}
                className="text-[#2a7040] hover:text-[#164028] font-mono text-[9px] font-bold flex items-center gap-1 px-1 transition-all"
              >
                <Volume2 className="w-3 h-3" /> Play Local Voice Feed
              </button>
            )}
          </div>
        ))}
        {isProcessing && (
          <div className="text-[10px] text-emerald-700/60 font-mono italic animate-pulse">
            VAANI AI Engine compiling localized translation lookup layers...
          </div>
        )}
      </div>

      {/* OPERATIONAL INTERACTION POD FORM CONTROLS */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={toggleVoiceRecordingStream}
          disabled={isProcessing}
          className={`w-full p-3 text-xs font-bold font-mono border rounded-xl transition-all flex items-center justify-center gap-2 ${isAudioStreaming
            ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
            : 'bg-[#f6f1e9] hover:bg-[#ede7dc] border-[#cfc4b0] text-[#1a1208]'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Mic className="w-4 h-4 text-[#2a7040]" />
          <span>{isAudioStreaming ? "Recording audio... tap again to process query" : `Stream Voice Feedback Loop`}</span>
        </button>

        <form onSubmit={handleMessageDispatch} className="flex gap-2 items-center">
          <input
            type="text"
            value={textInput}
            disabled={isProcessing || isAudioStreaming}
            onChange={e => setTextInput(e.target.value)}
            placeholder="Type query to resolve translation lookups..."
            className="flex-1 text-xs p-2.5 bg-[#f6f1e9]/50 border border-[#cfc4b0] rounded-xl focus:bg-white focus:outline-none focus:border-[#2a7040] transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isProcessing || isAudioStreaming || !textInput.trim()}
            className="bg-[#1a1208] hover:bg-[#2a7040] text-white p-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}