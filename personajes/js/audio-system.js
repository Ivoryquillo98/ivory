/* js/audio-system.js */
(() => {
  const KEY = "boku_audio_enabled";

  // Preferencia guardada (entre páginas)
  const prefEnabled = () => localStorage.getItem(KEY) === "true";
  const setPref = (v) => localStorage.setItem(KEY, v ? "true" : "false");

  // ✅ Default: si nunca se guardó nada, parte OFF
  if (localStorage.getItem(KEY) === null) setPref(false);

  let bgm = null;         // <audio id="openingAudio">
  let voice = null;       // Audio() para voz
  let started = false;    // ✅ “ya arrancó en esta página” (por gesto del usuario)

  let audioFab, audioIcon, audioHint;

  function ensureBgm(){
    if (bgm) return bgm;
    bgm = document.getElementById("openingAudio");
    if (!bgm) return null;
    bgm.volume = 0.35;
    bgm.loop = true;
    // Importante: SIEMPRE parte muteado hasta gesto del usuario
    bgm.muted = true;
    return bgm;
  }

  function ensureVoice(){
    if (voice) return voice;
    voice = new Audio();
    voice.preload = "auto";
    voice.volume = 0.95;
    voice.loop = false;
    voice.muted = true; // parte muteado
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

  // 🔥 UI SIEMPRE parte en 🔇 hasta que realmente arranque
  function setFabState(){
    const pref = prefEnabled();
    const isOnNow = pref && started; // solo “ON real” cuando ya arrancó en esta página

    if (!audioIcon || !audioHint) return;

    if (!isOnNow){
      audioIcon.textContent = "🔇";
      audioHint.textContent = pref ? "Click para reactivar" : "Click para activar";
    } else {
      audioIcon.textContent = "🔊";
      audioHint.textContent = "Click para silenciar";
    }
  }

  async function startAudioNow({playVoiceSrc=null} = {}){
    ensureBgm();
    ensureVoice();

    // Ahora sí, por gesto del usuario, desmuteamos y arrancamos
    if (bgm){
      bgm.muted = false;
      const ok = await safePlay(bgm);
      if (!ok) bgm.muted = true;
    }

    voice.muted = false;
    started = true;

    // Si quieres disparar voz al activar
    if (playVoiceSrc){
      await playVoice(playVoiceSrc);
    }

    setFabState();
  }

  async function stopAudioNow(){
    ensureBgm();
    ensureVoice();

    // dejamos todo muteado (y opcionalmente pausamos bgm)
    if (bgm){
      bgm.muted = true;
      // si quieres que se detenga totalmente al apagar:
      try{ bgm.pause(); }catch{}
      try{ bgm.currentTime = 0; }catch{}
    }

    voice.muted = true;
    stopVoice();
    started = false;

    setFabState();
  }

  async function playVoice(src){
    if (!prefEnabled()) return false;

    // si aún no “arrancó” en esta página, no forzamos autoplay.
    // (la voz debe sonar tras gesto: botón/click)
    if (!started) return false;

    ensureVoice();
    stopVoice();
    voice.src = src;
    voice.currentTime = 0;
    return await safePlay(voice);
  }

  function bindFab(){
    audioFab = document.getElementById("audioFab");
    audioIcon = document.getElementById("audioIcon");
    audioHint = document.getElementById("audioHint");
    if (!audioFab) return;

    const voiceOnEnable = audioFab.getAttribute("data-voice") || null;

    audioFab.addEventListener("click", async () => {
      const pref = prefEnabled();

      if (!pref){
        // estaba OFF -> lo encendemos (preferencia ON) y arrancamos
        setPref(true);
        await startAudioNow({ playVoiceSrc: voiceOnEnable });
      } else {
        // estaba ON -> lo apagamos (preferencia OFF) y paramos todo
        setPref(false);
        await stopAudioNow();
      }
    });

    setFabState();
  }

  function bindAutoReactivateOnFirstGesture(){
    // ✅ Si la preferencia está ON (de otra página),
    // arrancamos al PRIMER click/touch del usuario (en cualquier parte),
    // pero el botón parte en 🔇 y dice "Click para reactivar".
    const firstGesture = async () => {
      if (prefEnabled() && !started){
        await startAudioNow(); // no dispara voz aquí (para que no sea molesto)
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
    isEnabled: () => prefEnabled() && started,
  };

  // init
  window.addEventListener("load", () => {
    ensureBgm();
    ensureVoice();
    bindFab();
    bindAutoReactivateOnFirstGesture();
    setFabState();
  });
})();
