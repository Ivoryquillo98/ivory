/* =========================================================
   MONITOR DE SIGNOS VITALES
   Archivo: js/monitor.js

   Controla:
   - Valores numéricos tipo monitor (HR, SPD, etc.)
   - Cambios irregulares (humanos, no loop mecánico)
   - SOLO afecta al bloque del slogan

   ✅ Ahora:
   - Números a la derecha (alineados arriba)
   - Comportamiento más humano: micro variaciones + saltos ocasionales + pausas

   Requisitos en HTML:
   - .carousel-info (contenedor)
   - (opcional) .monitor-values (contenedor de números)
   ========================================================= */

(() => {
  "use strict";

  /* ===========================
     CONFIGURACIÓN BASE
     =========================== */
  const CONFIG = {
    updateInterval: [1700, 3400], // ms (rango aleatorio)
    transitionMs: 420,

    // "humanidad":
    microMoveChance: 0.72,   // prob de cambio pequeño
    spikeChance: 0.10,       // prob de salto ocasional
    holdChance: 0.18,        // prob de quedarse igual (estabilidad)
    holdExtraDelay: [1200, 2600], // ms extra cuando se "estabiliza"

    metrics: {
      HR:  { min: 68, max: 96, unit: "bpm" },
      SPD: { min: 0.9, max: 1.4, unit: "x" }
    }
  };

  /* ===========================
     HELPERS
     =========================== */
  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max + 1));
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  /* ===========================
     INICIALIZACIÓN
     =========================== */
  const container = document.querySelector(".carousel-info");
  if (!container) return;

  // Crear contenedor de valores si no existe
  let valuesEl = container.querySelector(".monitor-values");
  if (!valuesEl) {
    valuesEl = document.createElement("div");
    valuesEl.className = "monitor-values";
    container.appendChild(valuesEl);
  }

  /* ===========================
     CREAR MÉTRICAS
     =========================== */
  const metricEls = {};
  const lastValues = {}; // para comportamiento “humano”

  Object.keys(CONFIG.metrics).forEach((key) => {
    const span = document.createElement("span");
    span.className = "monitor-metric";
    span.dataset.metric = key;

    span.innerHTML = `
      <strong>${key}</strong>
      <em>--</em>
    `;

    valuesEl.appendChild(span);
    metricEls[key] = span.querySelector("em");

    // seed inicial aproximado al rango medio
    const cfg = CONFIG.metrics[key];
    lastValues[key] = (cfg.unit === "x")
      ? Number(((cfg.min + cfg.max) / 2).toFixed(2))
      : Math.round((cfg.min + cfg.max) / 2);
  });

  /* ===========================
     GENERADOR HUMANO
     =========================== */
  function nextHumanValue(key, cfg) {
    const prev = lastValues[key];

    // a veces se queda igual (estable)
    if (Math.random() < CONFIG.holdChance) {
      return prev;
    }

    // salto ocasional (espiga)
    if (Math.random() < CONFIG.spikeChance) {
      if (cfg.unit === "x") {
        const delta = pick([0.08, 0.10, 0.12, 0.14]) * (Math.random() < 0.5 ? -1 : 1);
        const v = clamp(prev + delta, cfg.min, cfg.max);
        return Number(v.toFixed(2));
      } else {
        const delta = pick([6, 7, 8, 9]) * (Math.random() < 0.5 ? -1 : 1);
        return clamp(prev + delta, cfg.min, cfg.max);
      }
    }

    // micro cambios frecuentes
    if (Math.random() < CONFIG.microMoveChance) {
      if (cfg.unit === "x") {
        const delta = pick([0.01, 0.02, 0.03, 0.04]) * (Math.random() < 0.5 ? -1 : 1);
        const v = clamp(prev + delta, cfg.min, cfg.max);
        return Number(v.toFixed(2));
      } else {
        const delta = pick([1, 2, 3]) * (Math.random() < 0.5 ? -1 : 1);
        return clamp(prev + delta, cfg.min, cfg.max);
      }
    }

    // fallback: valor aleatorio dentro del rango (raro)
    if (cfg.unit === "x") return Number(rand(cfg.min, cfg.max).toFixed(2));
    return randInt(cfg.min, cfg.max);
  }

  /* ===========================
     ACTUALIZACIÓN DE VALORES
     =========================== */
  async function updateLoop() {
    while (true) {
      // actualiza cada métrica
      Object.entries(CONFIG.metrics).forEach(([key, cfg]) => {
        const el = metricEls[key];
        if (!el) return;

        const newVal = nextHumanValue(key, cfg);
        lastValues[key] = newVal;

        const text = (cfg.unit === "x")
          ? `${Number(newVal).toFixed(2)}${cfg.unit}`
          : `${Math.round(newVal)}${cfg.unit}`;

        // Fade out -> update -> fade in
        el.style.opacity = "0";
        setTimeout(() => {
          el.textContent = text;
          el.style.opacity = "1";
        }, CONFIG.transitionMs);
      });

      // espera irregular
      let nextDelay = randInt(CONFIG.updateInterval[0], CONFIG.updateInterval[1]);

      // si justo estuvo “estable”, a veces agrega una pausa extra
      if (Math.random() < 0.22) {
        nextDelay += randInt(CONFIG.holdExtraDelay[0], CONFIG.holdExtraDelay[1]);
      }

      await wait(nextDelay);
    }
  }

  /* ===========================
     ESTILOS DINÁMICOS (INLINE)
     ✅ DERECHA: números
     =========================== */
  const style = document.createElement("style");
  style.textContent = `
    .monitor-values{
      position: absolute;
      top: 2px;              /* ✅ alineado a la franja del ECG */
      right: 14px;
      z-index: 3;
      display: flex;
      gap: 0.75rem;
      font-family: "Montserrat", sans-serif;
      font-size: 0.7rem;
      letter-spacing: 0.6px;
      pointer-events: none;
      opacity: 0.95;
      align-items: center;
      justify-content: flex-end;
    }

    .monitor-metric{
      display: flex;
      gap: 0.25rem;
      align-items: baseline;
      color: var(--slogan-monitor-line);
      text-shadow: 0 0 6px var(--slogan-monitor-glow);
      white-space: nowrap;
    }

    .monitor-metric strong{
      font-weight: 700;
      opacity: 0.8;
    }

    .monitor-metric em{
      font-style: normal;
      font-weight: 700;
      transition: opacity ${CONFIG.transitionMs}ms ease;
    }

    @media (max-width: 768px){
      .monitor-values{
        font-size: 0.65rem;
        top: 2px;
        right: 10px;
        gap: 0.6rem;
      }
    }

    @media (prefers-reduced-motion: reduce){
      .monitor-metric em{
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  /* ===========================
     ARRANQUE
     =========================== */
  updateLoop();

})();
