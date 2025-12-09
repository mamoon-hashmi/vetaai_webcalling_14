// ====================== CREATE HTML & CSS DYNAMICALLY ======================
(function() {
  // Create HTML structure
  document.body.innerHTML = `
    <div class="container">
      <div class="card">
        <div class="voice-visual">
          <div class="voice-ring" id="voiceRing">
            <div class="ring-inner">
              <div class="ring-text">Voice Agent</div>
              <div class="eq-bars">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="control-buttons">
          <button id="connectBtn" class="icon-btn primary" title="Connect"><i class="fas fa-phone"></i></button>
          <button id="disconnectBtn" class="icon-btn danger" disabled title="Disconnect"><i class="fas fa-phone-slash"></i></button>
          <button id="muteBtn" class="icon-btn" disabled title="Mute"><i class="fas fa-microphone"></i></button>
          <button id="unmuteBtn" class="icon-btn" disabled title="Unmute"><i class="fas fa-microphone-slash"></i></button>
        </div>

        <div class="status-bar">
          <div class="status-badge"><span class="status-dot" id="rtcDot"></span><span id="rtcInfo">Disconnected</span></div>
          <div class="status-badge"><span class="status-dot" id="captionsDot"></span><span id="captionsInfo">Captions: None</span></div>
          <div class="status-badge"><span class="status-dot" id="agentDot"></span><span id="agentSpeakingBadge">Agent: Veta AI</span></div>
        </div>
      </div>

      <div class="card" style="display: none;">
        <div class="card-title">Live Transcript</div>
        <div class="transcript-box" style="margin-bottom: 1rem;">
          <div class="transcript-label">You</div>
          <div id="youLive" class="transcript-text placeholder">Awaiting input...</div>
        </div>
        <div class="transcript-box">
          <div class="transcript-label">Agent</div>
          <div id="agentLive" class="transcript-text placeholder">Awaiting response...</div>
        </div>
      </div>
    </div>
  `;

  // Add Google Fonts
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  // Add Font Awesome
  const faLink = document.createElement('link');
  faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  faLink.rel = 'stylesheet';
  document.head.appendChild(faLink);

  // Add CSS
  const style = document.createElement('style');
  style.textContent = `
    .voice-ring.ending {
      border-color: #ef4444 !important;
      animation: endingPulse 2.5s ease-out forwards;
      box-shadow: 0 0 30px rgba(239, 68, 68, 0.25);
    }

    @keyframes endingPulse {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(0.92); opacity: 0.5; }
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', sans-serif;
      background: white;
      color: #1f2937;
      min-height: 100vh;
      padding: 2rem;
    }

    .container { max-width: 800px; margin: 0 auto; }

    .header {
      text-align: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid #f3f4f6;
    }

    .header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #8B5CF6;
      margin-bottom: 0.5rem;
    }

    .header p { color: #6b7280; font-size: 0.95rem; }

    .card { padding: 2rem; margin-top: 2rem; }

    .card-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #8B5CF6;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .voice-visual {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem 1rem;
      position: relative;
    }

    .voice-ring {
      width: 220px;
      height: 220px;
      border: 3px solid #8B5CF6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.4s ease;
    }

    .voice-ring.connecting {
      animation: connectingPulse 1.5s ease-in-out infinite;
      border-color: #a78bfa;
    }

    .voice-ring.connected {
      border-color: #8B5CF6;
      box-shadow: 0 0 0 8px rgba(139, 92, 246, 0.1);
    }

    .voice-ring.active {
      animation: activePulse 2s ease-in-out infinite;
      border-color: #7c3aed;
      box-shadow: 0 0 25px rgba(139, 92, 246, 0.5);
    }

    @keyframes connectingPulse {
      0%, 100% { transform: scale(1) }
      50% { transform: scale(1.08) }
    }

    @keyframes activePulse {
      0%, 100% { transform: scale(1) }
      50% { transform: scale(1.1) }
    }

    .ring-inner {
      width: 180px;
      height: 180px;
      background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .ring-text {
      font-size: 0.875rem;
      font-weight: 600;
      color: #8B5CF6;
    }

    .eq-bars {
      display: flex;
      gap: 4px;
      align-items: flex-end;
      height: 40px;
      margin-top: 0.75rem;
    }

    .bar {
      width: 4px;
      background: #8B5CF6;
      border-radius: 2px;
      height: 8px;
      transition: height 0.1s;
    }

    .control-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin: 2rem 0 1.5rem;
      flex-wrap: wrap;
    }

    .icon-btn {
      width: 56px;
      height: 56px;
      border: 2px solid #8B5CF6;
      border-radius: 50%;
      background: white;
      color: #8B5CF6;
      font-size: 1.25rem;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-btn:hover:not(:disabled) {
      background: #f9fafb;
      transform: scale(1.05);
    }

    .icon-btn.primary {
      background: #8B5CF6;
      color: white;
    }

    .icon-btn.primary:hover:not(:disabled) {
      background: #7c3aed;
    }

    .icon-btn.danger {
      border-color: #ef4444;
      color: #ef4444;
    }

    .icon-btn.danger:hover:not(:disabled) {
      background: #fef2f2;
    }

    .icon-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .status-bar {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 8px;
      justify-content: center;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 0.813rem;
      font-weight: 500;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #d1d5db;
    }

    .status-dot.active {
      background: #8B5CF6;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1 }
      50% { opacity: 0.5 }
    }

    .transcript-box {
      background: #f9fafb;
      border-radius: 8px;
      padding: 1rem;
      min-height: 80px;
    }

    .transcript-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #8B5CF6;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
      letter-spacing: 0.5px;
    }

    .transcript-text {
      color: #1f2937;
      font-size: 0.95rem;
      line-height: 1.6;
      font-style: italic;
    }

    .transcript-text.placeholder {
      color: #9ca3af;
      font-style: normal;
    }

    @media (max-width: 640px) {
      body { padding: 1rem; }
      .voice-ring { width: 180px; height: 180px; }
      .ring-inner { width: 140px; height: 140px; }
    }
  `;
  document.head.appendChild(style);

  // Set title
  document.title = 'Voice Assistant';
})();

// ====================== VOICE ASSISTANT LOGIC ======================
const rtcInfoEl = document.getElementById("rtcInfo");
const rtcDot = document.getElementById("rtcDot");
const captionsInfoEl = document.getElementById("captionsInfo");
const captionsDot = document.getElementById("captionsDot");
const agentDot = document.getElementById("agentDot");
const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const muteBtn = document.getElementById("muteBtn");
const unmuteBtn = document.getElementById("unmuteBtn");
const youLive = document.getElementById("youLive");
const agentLive = document.getElementById("agentLive");
const agentSpeakingBadge = document.getElementById("agentSpeakingBadge");
const voiceRing = document.getElementById("voiceRing");
const eqBars = document.querySelectorAll(".bar");

// State
let pc = null;
let localStream = null;
let connected = false;
let rec = null;
let audioCtx = null, analyser = null, rafId = null;
let agentRec = null, sttAbort = null;
let captionsSource = "none";
let receivedDataChannelCaption = false;

// Natural goodbye state
let isEndingCall = false;
let waitingForAgentGoodbye = false;
let goodbyeFallback = null;

// Helper
function setYouText(text){
  youLive.textContent = text || "Awaiting input...";
  youLive.classList.toggle("placeholder", !text);
  if (text && connected && !isEndingCall) checkEndIntent(text);
}

function setAgentText(text){
  agentLive.textContent = text || "Awaiting response...";
  agentLive.classList.toggle("placeholder", !text);

  if (waitingForAgentGoodbye && text) {
    const t = text.toLowerCase().trim();
    const hasGoodbye = /(bye|goodbye|take care|have a (great|nice|wonderful|good) day|talk later|see you|stay safe|thank you|thanks)/i.test(t);
    const complete = /[.!?]$/.test(text.trim()) || t.split(' ').length >= 6;
    if (hasGoodbye && complete) {
      setTimeout(() => { if (connected) disconnect(); }, 1200);
      waitingForAgentGoodbye = false;
      if (goodbyeFallback) clearTimeout(goodbyeFallback);
    }
  }
}

function setAgentSpeaking(on){
  agentSpeakingBadge.textContent = `Agent: ${on ? "Speaking" : "Idle"}`;
  agentDot.classList.toggle("active", on);
  if (connected && !isEndingCall) voiceRing.classList.toggle("active", on);
}

function setCaptionsBadge(){
  captionsInfoEl.textContent = `Captions: ${captionsSource}`;
  captionsDot.classList.toggle("active", captionsSource !== "none");
}

function checkEndIntent(text){
  const lower = text.toLowerCase();
  const phrases = ['bye','goodbye','good bye','bye bye','end call','disconnect','hang up','gotta go','have to go','talk later','thanks bye','thank you','take care','see you','not interested','no thanks'];
  if (phrases.some(p => lower.includes(p))) startGracefulEnd();
}

function startGracefulEnd(){
  if (isEndingCall) return;
  isEndingCall = true;
  waitingForAgentGoodbye = true;

  voiceRing.classList.remove('active','connected');
  voiceRing.classList.add('ending');

  goodbyeFallback = setTimeout(() => { if (connected) disconnect(); }, 7000);
}

function animateEQ(){
  if (!analyser) return;
  const data = new Uint8Array(analyser.frequencyBinCount);
  const loop = () => {
    analyser.getByteFrequencyData(data);
    let energy = 0;
    eqBars.forEach((bar,i) => {
      const v = data[i*4] / 255;
      bar.style.height = `${Math.max(8, 8 + v*36)}px`;
      energy += v;
    });
    const speaking = energy/eqBars.length > 0.12;
    setAgentSpeaking(speaking);
    rafId = requestAnimationFrame(loop);
  };
  loop();
}

// User STT
function startUserSTT(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return setYouText("Speech recognition not supported");
  rec = new SR();
  rec.lang = "en-US";
  rec.continuous = true;
  rec.interimResults = true;
  rec.onresult = e => {
    let transcript = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      transcript = e.results[i][0].transcript.trim();
    }
    setYouText(transcript);
  };
  rec.onend = () => { if (connected && !isEndingCall) rec.start(); };
  rec.start();
}

function stopUserSTT(){ rec && rec.stop(); rec = null; }

// DataChannel captions
function setupDataChannel(pc){
  pc.ondatachannel = e => {
    const ch = e.channel;
    ch.onmessage = m => {
      try {
        const data = typeof m.data === "string" ? m.data : JSON.parse(m.data);
        const text = data.text || data.caption || data.message || "";
        if (text) {
          receivedDataChannelCaption = true;
          captionsSource = "datachannel";
          setCaptionsBadge();
          setAgentText(text);
        }
      } catch { if (typeof m.data === "string") setAgentText(m.data); }
    };
  };
  pc.createDataChannel("client");
}

// Fallback agent STT
function startAgentSTT(stream){
  if (!MediaRecorder || !MediaRecorder.isTypeSupported("audio/webm")) return;
  try {
    agentRec = new MediaRecorder(stream, {mimeType:"audio/webm"});
  } catch { return; }
  sttAbort = new AbortController();
  agentRec.ondataavailable = async e => {
    if (receivedDataChannelCaption || !e.data.size) return;
    const form = new FormData();
    form.append("file", e.data, "audio.webm");
    try {
      const res = await fetch("https://webcall.vetaai.com/v1/stt/agent", {method:"POST", body:form, signal:sttAbort.signal});
      if (res.ok) {
        const json = await res.json();
        if (json.text) {
          captionsSource = "stt";
          setCaptionsBadge();
          setAgentText(json.text);
        }
      }
    } catch{}
  };
  agentRec.start(800);
}

function stopAgentSTT(){
  agentRec && agentRec.stop();
  sttAbort && sttAbort.abort();
}

// Connect
async function connect(){
  if (connected) return;
  voiceRing.classList.add('connecting');
  rtcInfoEl.textContent = "Connecting...";

  try {
    const resp = await fetch("https://webcall.vetaai.com/v1/voice/session", {method:"POST", headers:{"Content-Type":"application/json"}, body:"{}"});
    const data = await resp.json();
    const token = data.client_secret?.value || data.client_secret || data.token;
    const url = data.rtc_url || data.url || data.webrtc_url || data.web_rtc_url;

    pc = new RTCPeerConnection();
    setupDataChannel(pc);

    const audio = new Audio();
    audio.autoplay = true;
    pc.ontrack = e => {
      audio.srcObject = e.streams[0];
      audioCtx = new (AudioContext || webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(e.streams[0]);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      animateEQ();
      startAgentSTT(e.streams[0]);
    };

    localStream = await navigator.mediaDevices.getUserMedia({audio:true});
    localStream.getTracks().forEach(t => pc.addTrack(t, localStream));

    const offer = await pc.createOffer({offerToReceiveAudio:true});
    await pc.setLocalDescription(offer);

    const sdpRes = await fetch(url, {method:"POST", headers:{ "Content-Type":"application/sdp", Authorization:`Bearer ${token}` }, body:offer.sdp});
    const answer = await sdpRes.text();
    await pc.setRemoteDescription({type:"answer", sdp:answer});

    voiceRing.classList.remove('connecting');
    voiceRing.classList.add('connected');
    connected = true;
    connectBtn.disabled = true;
    disconnectBtn.disabled = false;
    muteBtn.disabled = false;
    unmuteBtn.disabled = true;
    rtcInfoEl.textContent = "Connected";
    rtcDot.classList.add("active");
    startUserSTT();

  } catch (err) {
    voiceRing.classList.remove('connecting');
    rtcInfoEl.textContent = "Error: "+err.message;
  }
}

// Disconnect
async function disconnect(){
  if (!connected) return;

  voiceRing.classList.remove('connected','active','connecting','ending');
  pc && pc.close();
  pc = null;
  localStream && localStream.getTracks().forEach(t=>t.stop());
  localStream = null;
  if (rafId) cancelAnimationFrame(rafId);
  audioCtx && audioCtx.close();
  stopUserSTT();
  stopAgentSTT();
  if (goodbyeFallback) clearTimeout(goodbyeFallback);

  connected = false;
  isEndingCall = false;
  waitingForAgentGoodbye = false;

  connectBtn.disabled = false;
  disconnectBtn.disabled = true;
  muteBtn.disabled = true;
  unmuteBtn.disabled = true;
  rtcInfoEl.textContent = "Disconnected";
  rtcDot.classList.remove("active");
  setYouText("");
  setAgentText("");
  captionsSource = "none";
  setCaptionsBadge();
}

function mute(){ localStream.getAudioTracks().forEach(t=>t.enabled=false); muteBtn.disabled=true; unmuteBtn.disabled=false; }
function unmute(){ localStream.getAudioTracks().forEach(t=>t.enabled=true); muteBtn.disabled=false; unmuteBtn.disabled=true; }

// Buttons
connectBtn.onclick = connect;
disconnectBtn.onclick = disconnect;
muteBtn.onclick = mute;
unmuteBtn.onclick = unmute;

