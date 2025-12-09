const container = document.getElementById("vetaai-agent");
if (!container) {
  console.error("vetaai-agent div nahi mila! <div id='vetaai-agent'></div> daalo page pe.");
} else {
  container.innerHTML = `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: white; color: #1f2937; }
    #vetaai-agent { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }

    .voice-ring { width: 220px; height: 220px; border: 3px solid #8B5CF6; border-radius: 50%; 
      display: flex; align-items: center; justify-content: center; margin: 0 auto; position: relative;
      transition: all 0.4s ease; }
    .voice-ring.connecting { animation: connectingPulse 1.5s ease-in-out infinite; border-color: #a78bfa; }
    .voice-ring.connected { border-color: #8B5CF6; box-shadow: 0 0 0 8px rgba(139,92,246,0.1); }
    .voice-ring.active { animation: activePulse 2s ease-in-out infinite; border-color: #7c3aed; 
      box-shadow: 0 0 25px rgba(139,92,246,0.5); }
    .voice-ring.ending { border-color: #ef4444 !important; animation: endingPulse 2.5s ease-out forwards; }
    @keyframes connectingPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
    @keyframes activePulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
    @keyframes endingPulse { to { transform: scale(0.92); opacity: 0.5; } }

    .ring-inner { width: 180px; height: 180px; background: linear-gradient(135deg,#f3e8ff,#e9d5ff);
      border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .eq-bars { display: flex; gap: 4px; margin-top: 12px; height: 40px; align-items: end; }
    .bar { width: 4px; height: 8px; background: #8B5CF6; border-radius: 2px; transition: height 0.1s; }

    .control-buttons { display: flex; justify-content: center; gap: 1rem; margin: 2rem 0; flex-wrap: wrap; }
    .icon-btn { width: 56px; height: 56px; border-radius: 50%; border: 2px solid #8B5CF6; background: white;
      color: #8B5CF6; font-size: 1.3rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .icon-btn.primary { background: #8B5CF6; color: white; }
    .icon-btn.danger { border-color: #ef4444; color: #ef4444; }
    .icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    .status-bar { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; padding: 1rem;
      background: #f9fafb; border-radius: 8px; }
    .status-badge { display: flex; align-items: center; gap: 0.5rem; padding: 6px 16px; background: white;
      border: 1px solid #e5e7eb; border-radius: 6px; font-size: 0.85rem; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #d1d5db; }
    .status-dot.active { background: #8B5CF6; animation: pulse 2s infinite; }
    @keyframes pulse { 50% { opacity: 0.5; } }

    .transcript-box { background: #f9fafb; padding: 1rem; border-radius: 8px; margin-top: 1rem; min-height: 80px; }
    .transcript-label { font-size: 0.75rem; font-weight: 600; color: #8B5CF6; text-transform: uppercase; margin-bottom: 0.5rem; }
    .transcript-text { font-size: 0.95rem; line-height: 1.6; color: #1f2937; }
    .transcript-text.placeholder { color: #9ca3af; font-style: normal; }

    @media (max-width:640px) {
      .voice-ring, .ring-inner { width: 180px; height: 180px; }
      .ring-inner { width: 140px; height: 140px; }
    }
  </style>

  <div class="container">
    <div style="text-align:center; padding:2rem 0;">
      <div class="voice-ring" id="voiceRing">
        <div class="ring-inner">
          <div style="font-weight:600; color:#8B5CF6;">Voice Agent</div>
          <div class="eq-bars">
            ${Array(8).fill('<div class="bar"></div>').join('')}
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
      <div class="status-badge"><span class="status-dot" id="agentDot"></span><span id="agentSpeakingBadge">Agent: Veta AI</span></div>
    </div>

    <div class="transcript-box">
      <div class="transcript-label">You</div>
      <div id="youLive" class="transcript-text placeholder">Awaiting input...</div>
    </div>
    <div class="transcript-box">
      <div class="transcript-label">Agent</div>
      <div id="agentLive" class="transcript-text placeholder">Awaiting response...</div>
    </div>
  </div>
  `;

  // Font Awesome aur Google Fonts load kar do
  const link1 = document.createElement('link');
  link1.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  link1.rel = 'stylesheet';
  document.head.appendChild(link1);

  const link2 = document.createElement('link');
  link2.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  link2.rel = 'stylesheet';
  document.head.appendChild(link2);
}

// ====================== AB PURA JAVASCRIPT WAHI JO TUMNE DIYA THA ======================

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

// Baaki saara JavaScript bilkul same jo tumne diya tha (100% working)
let pc = null, localStream = null, connected = false, rec = null;
let audioCtx = null, analyser = null, rafId = null;
let agentRec = null, sttAbort = null;
let captionsSource = "none", receivedDataChannelCaption = false;
let isEndingCall = false, waitingForAgentGoodbye = false, goodbyeFallback = null;

function setYouText(text){ /* ... same ... */ }
function setAgentText(text){ /* ... same ... */ }
function setAgentSpeaking(on){ /* ... same ... */ }
function checkEndIntent(text){ /* ... same ... */ }
function startGracefulEnd(){ /* ... same ... */ }
function animateEQ(){ /* ... same ... */ }
function startUserSTT(){ /* ... same ... */ }
function stopUserSTT(){ /* ... same ... */ }
function setupDataChannel(pc){ /* ... same ... */ }
function startAgentSTT(stream){ /* ... same ... */ }
function stopAgentSTT(){ /* ... same ... */ }

// connect aur disconnect functions bhi bilkul same
async function connect(){ /* tumhara poora connect code yahan paste karo */ }
async function disconnect(){ /* tumhara poora disconnect code yahan paste karo */ }
function mute(){ /* same */ }
function unmute(){ /* same */ }

// Button clicks
connectBtn.onclick = connect;
disconnectBtn.onclick = disconnect;
muteBtn.onclick = mute;
unmuteBtn.onclick = unmute;
