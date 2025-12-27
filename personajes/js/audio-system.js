/* js/audio-system.js */
(() => {
  const KEY = "boku_audio_enabled";

  const prefEnabled = () => localStorage.getItem(KEY) === "true";
  const setPref = (v) => localStorage.setItem(KEY, v ? "true" : "false");

  // ✅ Default: si nunca se guardó nada, parte OFF
  if (localStorage.getItem(KEY) === null) setPref(false);

  let bgm = null;         // <audio id="openingAudio">
  let voice = null;       // Audio() para voz
  let started = false;    // “ya se pudo arrancar audio con gesto o autoplay permitido”

  let audioFab, audioIcon, audioHint;

  function ensureBgm(){
    if (bgm) return bgm;
    bgm = document.getElementById("openingAudio");
    if (!bgm) return null;
    bgm.volume = 0.35;
    bgm.loop = true;
    // partimos muteado; luego intentaremos desmutear si pref está ON
    bgm.muted = true;
    return bgm;
  }

  function ensureVoice(){
    if (voice) return voice;
    voice = new Audio();
    voice.preload = "auto";
    voice.volume = 0.95;
    voice.loop = false;
    voice.muted = true;
    return voice;
  }

  async function safePlay(el){
    if (!el) return false;
    try { await el.play(); return true; } catch { return false; }
  }

  function stopVoice(){
    if (!voice) return;
    try{ voice.pause(); }catch{}
    try{ voice.currentTime = 0; }catch{}
  }

  function getVoiceOnThisPage(){
    // ✅ La voz de esta página viene desde el botón: data-voice=".../voces/xxx.mp3"
    const btn = document.getElementById("audioFab");
    return btn ? (btn.getAttribute("data-voice") || null) : null;
  }

  // ✅ UI depende SOLO de la preferencia (no de started)
  function setFabState(){
    if (!audioIcon || !audioHint) return;

    if (!prefEnabled()){
      audioIcon.textContent = "🔇";
      audioHint.textContent = "Click para activar";
    } else {
      audioIcon.textContent = "🔊";
      audioHint.textContent = "Click para silenciar";
    }
  }

  async function playVoice(src){
    if (!prefEnabled()) return false;

    // si todavía no arrancó por bloqueo de autoplay,
    // dejamos que suene recién cuando haya un gesto (click en título/carta/botón)
    if (!started) return false;

    ensureVoice();
    stopVoice();
    voice.muted = false;
    voice.src = src;
    voice.currentTime = 0;
    return await safePlay(voice);
  }

  async function startAudioNow({playVoiceSrc=null} = {}){
    ensureBgm();
    ensureVoice();

    // Gesto del usuario: intentamos con sonido real
    if (bgm){
      bgm.muted = false;
      const ok = await safePlay(bgm);
      if (!ok) bgm.muted = true;
      else started = true;
    }

    voice.muted = false;

    if (playVoiceSrc){
      await playVoice(playVoiceSrc);
    }

    setFabState();
  }

  async function stopAudioNow(){
    ensureBgm();
    ensureVoice();

    if (bgm){
      bgm.muted = true;
      try{ bgm.pause(); }catch{}
      try{ bgm.currentTime = 0; }catch{}
    }

    voice.muted = true;
    stopVoice();
    started = false;

    setFabState();
  }

  async function tryAutoplayIfEnabled(){
    ensureBgm();
    ensureVoice();

    if (!prefEnabled()) return;

    // intentamos arrancar en load (puede fallar en móviles / chrome)
    if (bgm){
      bgm.muted = false;
      const ok = await safePlay(bgm);
      if (!ok){
        // si falla, lo dejamos muteado y esperamos gesto
        bgm.muted = true;
        started = false;
      } else {
        started = true;
      }
    }
  }

  function bindFab(){
    audioFab = document.getElementById("audioFab");
    audioIcon = document.getElementById("audioIcon");
    audioHint = document.getElementById("audioHint");
    if (!audioFab) return;

    audioFab.addEventListener("click", async () => {
      const voiceOnEnable = getVoiceOnThisPage(); // ✅ se lee en el momento del click

      if (!prefEnabled()){
        setPref(true);
        await startAudioNow({ playVoiceSrc: voiceOnEnable });
      } else {
        setPref(false);
        await stopAudioNow();
      }
    });

    setFabState();
  }

  function bindFirstGestureReactivate(){
    // ✅ Si pref ON pero autoplay bloqueó, primer gesto arranca audio real
    // ✅ y AHORA también dispara la voz de la página actual (si existe)
    const firstGesture = async () => {
      if (prefEnabled() && !started){
        const voiceOnThisPage = getVoiceOnThisPage();
        await startAudioNow({ playVoiceSrc: voiceOnThisPage });
      }

      document.removeEventListener("click", firstGesture);
      document.removeEventListener("touchstart", firstGesture);
    };

    document.addEventListener("click", firstGesture, { once: true });
    document.addEventListener("touchstart", firstGesture, { once: true });
  }

  // API pública
  window.AudioSystem = {
    playVoice,
    isEnabled: () => prefEnabled(), // ✅ preferencia global real
  };

  window.addEventListener("load", async () => {
    ensureBgm();
    ensureVoice();

    bindFab();
    await tryAutoplayIfEnabled();   // ✅ intenta arrancar al entrar
    bindFirstGestureReactivate();   // ✅ fallback si lo bloquea (y dice nombre)
    setFabState();
  });
})();
