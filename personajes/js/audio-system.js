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
    bgm.muted = true; // partimos muteado
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

  // ✅ EXPUESTO: arranca audio "de verdad" en un gesto
  async function startNow({playVoiceSrc=null} = {}){
    ensureBgm();
    ensureVoice();

    // Intentamos arrancar BGM con sonido real
    if (bgm){
      bgm.muted = false;
      const ok = await safePlay(bgm);
      if (!ok) bgm.muted = true;
      else started = true;
    }

    // Voz desbloqueada (pero igual depende de started para sonar)
    voice.muted = false;

    if (playVoiceSrc){
      await playVoice(playVoiceSrc);
    }

    setFabState();
    return started;
  }

  // ✅ EXPUESTO: detiene TODO
  async function stopNow(){
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
    return true;
  }

  async function tryAutoplayIfEnabled(){
    ensureBgm();
    ensureVoice();

    if (!prefEnabled()) return;

    if (bgm){
      bgm.muted = false;
      const ok = await safePlay(bgm);
      if (!ok){
        bgm.muted = true;
        started = false;
      } else {
        started = true;
      }
    }
  }

  async function playVoice(src){
    if (!prefEnabled()) return false;

    // Si todavía no arrancó por bloqueo de autoplay,
    // solo sonará después de un gesto que llame startNow()
    if (!started) return false;

    ensureVoice();
    stopVoice();

    try{
      voice.muted = false;
      voice.src = src;
      voice.currentTime = 0;
    }catch{
      return false;
    }

    return await safePlay(voice);
  }

  function bindFab(){
    audioFab = document.getElementById("audioFab");
    audioIcon = document.getElementById("audioIcon");
    audioHint = document.getElementById("audioHint");
    if (!audioFab) return;

    const voiceOnEnable = audioFab.getAttribute("data-voice") || null;

    audioFab.addEventListener("click", async () => {
      if (!prefEnabled()){
        setPref(true);
        await startNow({ playVoiceSrc: voiceOnEnable });
      } else {
        setPref(false);
        await stopNow();
      }
    });

    setFabState();
  }

  function bindFirstGestureReactivate(){
    // Si pref ON pero autoplay bloqueó, primer gesto arranca audio real
    const firstGesture = async () => {
      if (prefEnabled() && !started){
        await startNow(); // no forzamos voz aquí
      }
      document.removeEventListener("click", firstGesture);
      document.removeEventListener("touchstart", firstGesture);
    };
    document.addEventListener("click", firstGesture, { once: true });
    document.addEventListener("touchstart", firstGesture, { once: true });
  }

  // ✅ API pública
  window.AudioSystem = {
    playVoice,
    isEnabled: () => prefEnabled(),
    startNow,   // ✅ nuevo
    stopNow,    // ✅ nuevo
  };

  window.addEventListener("load", async () => {
    ensureBgm();
    ensureVoice();

    bindFab();
    await tryAutoplayIfEnabled();
    bindFirstGestureReactivate();
    setFabState();
  });
})();
