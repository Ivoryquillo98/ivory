/* =========================================================
   page-ui.js (GLOBAL)
   Controla: Slider + Dueños + Rotación "Diseñada para" +
            Planes + WhatsApp + Voz del personaje +
            ✅ Voz al cambiar de personaje (flecha)
   Requiere: window.PAGE_CONFIG definido antes de cargar este script
   ========================================================= */

(() => {
  "use strict";

  const cfg = window.PAGE_CONFIG || null;
  if (!cfg) {
    console.warn("[page-ui] Falta window.PAGE_CONFIG");
    return;
  }

  const byId = (id) => document.getElementById(id);

  // ===========================
  // Elementos esperados en el HTML
  // ===========================
  const sliderImage = byId("sliderImage");
  const sliderButtons = document.querySelectorAll(".slider > a");

  const ownerLabel = byId("ownerLabel");
  const ownerNameEl = byId("ownerName"); // id="ownerName"

  const characterCard = byId("characterCard");
  const characterTitle = byId("characterTitle");
  const carouselTitle = byId("carouselTitle");

  const planName = byId("planName");
  const planPrice = byId("planPrice");
  const planFeatures = byId("planFeatures");
  const wspBtn = byId("wspBtn");

  const radioSilver = byId("glass-silver");
  const radioGold = byId("glass-gold");
  const radioPlatinum = byId("glass-platinum");

  const nextLink = document.querySelector(".go-character");

  if (!sliderImage) console.warn("[page-ui] Falta #sliderImage");
  if (!ownerLabel) console.warn("[page-ui] Falta #ownerLabel");
  if (!ownerNameEl) console.warn("[page-ui] Falta #ownerName (pon id='ownerName' en el span del nombre)");
  if (!wspBtn) console.warn("[page-ui] Falta #wspBtn");

  // ===========================
  // 1) SLIDER
  // ===========================
  const images = Array.isArray(cfg.images) ? cfg.images : [];

  function setOwner(name) {
    if (!ownerNameEl) return;
    ownerNameEl.textContent = name || "";
  }

  function showSlide(index) {
    if (!sliderImage) return;
    if (index < 0 || index >= images.length) return;

    sliderImage.classList.remove("show");

    setTimeout(() => {
      const item = images[index];
      sliderImage.src = item.src;
      setOwner(item.owner);
      sliderImage.classList.add("show");
    }, 150);
  }

  function applyHash() {
    const hash = window.location.hash;
    const match = hash.match(/^#slide-(\d+)$/);
    if (!match) return;

    const num = Number(match[1]);
    const index = num - 1;
    showSlide(index);
  }

  sliderButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => showSlide(index));
  });

  window.addEventListener("hashchange", applyHash);

  if (window.location.hash) applyHash();
  else if (images.length) showSlide(0);

  // ===========================
  // 2) ROTACIÓN "Diseñada para" (cada 5s)
  // ===========================
  const ownerLabelTexts = [
    "Diseñada para",
    "Designed for",
    "Conçu pour",
    "Progettata per",
    "Entworfen für",
    "Desenhada para",
    "デザインされた",
    "디자인됨",
    "为…设计"
  ];

  let labelIndex = 0;
  let labelTimer = null;

  function startOwnerLabelRotation() {
    if (!ownerLabel) return;
    if (labelTimer) return;

    ownerLabel.textContent = ownerLabelTexts[labelIndex];

    labelTimer = setInterval(() => {
      if (!ownerLabel) return;
      labelIndex = (labelIndex + 1) % ownerLabelTexts.length;
      ownerLabel.textContent = ownerLabelTexts[labelIndex];
    }, 5000);
  }

  startOwnerLabelRotation();

  // ===========================
  // 3) PLANES + WhatsApp
  // ===========================
  const plans = {
    silver: {
      label: "Plan Silver",
      price: "$12.990 CLP",
      features: [
        "Camiseta personalizada con tu diseño",
        "Estampado en 1 área (frente)",
        "1 ajuste de color/contraste",
        "Tu diseño puede aparecer en el catálogo",
        "Entrega estándar"
      ]
    },
    gold: {
      label: "Plan Gold",
      price: "$17.990 CLP",
      features: [
        "Camiseta personalizada (mejor calidad de tela)",
        "Estampado más nítido + mejor durabilidad",
        "Estampado en 2 áreas (frente + espalda o manga)",
        "Hasta 2 revisiones del diseño",
        "Tu diseño puede aparecer en el catálogo",
        "Entrega prioritaria"
      ]
    },
    platinum: {
      label: "Plan Platinum",
      price: "$24.990 CLP",
      features: [
        "Camiseta premium + opción oversize",
        "Estampado full color (máxima calidad)",
        "Estampado en 3 áreas (frente + espalda + manga)",
        "Hasta 4 revisiones + retoque pro del diseño",
        "Tu diseño puede aparecer en el catálogo",
        "Empaque premium + entrega prioritaria"
      ]
    }
  };

  function setPlan(planKey) {
    const p = plans[planKey];
    if (!p) return;

    if (planName) planName.textContent = p.label;
    if (planPrice) planPrice.textContent = p.price;

    if (planFeatures) {
      planFeatures.innerHTML = "";
      p.features.forEach((f) => {
        const li = document.createElement("li");
        li.textContent = f;
        planFeatures.appendChild(li);
      });
    }

    if (wspBtn) {
      const character = cfg.characterName || "Camiseta";
      const phone = cfg.phoneNumber || "";

      const msg =
        `Hola! Quiero comprar una camiseta personalizada (Camisetas Únicas).\n` +
        `Diseño inspirado en: ${character}\n` +
        `Plan elegido: ${p.label}\n` +
        `Precio: ${p.price}\n` +
        `¿Qué tallas y colores tienes disponibles?`;

      wspBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    }
  }

  setPlan("silver");
  if (radioSilver) radioSilver.addEventListener("change", () => setPlan("silver"));
  if (radioGold) radioGold.addEventListener("change", () => setPlan("gold"));
  if (radioPlatinum) radioPlatinum.addEventListener("change", () => setPlan("platinum"));

  // ===========================
  // 4) VOZ del personaje (click en card/títulos)
  // ===========================
  const voiceSrc = cfg.voiceSrc || "";

  function playVoice(src = voiceSrc) {
    if (!src) return;
    if (window.AudioSystem && typeof window.AudioSystem.playVoice === "function") {
      window.AudioSystem.playVoice(src);
    }
  }

  if (characterCard) characterCard.addEventListener("click", () => playVoice());
  if (characterTitle) characterTitle.addEventListener("click", (e) => { e.stopPropagation(); playVoice(); });
  if (carouselTitle) carouselTitle.addEventListener("click", (e) => { e.stopPropagation(); playVoice(); });

  // ===========================
  // 5) ✅ VOZ AL CAMBIAR DE PERSONAJE (click en flecha)
  // ===========================
  let navigating = false;

  async function handleGoCharacterClick(e) {
    const href = e.currentTarget.getAttribute("href");
    if (!href) return;

    e.preventDefault();
    if (navigating) return;
    navigating = true;

    const nextVoice = e.currentTarget.getAttribute("data-voice-next") || cfg.nextVoiceSrc || "";
    const AS = window.AudioSystem;

    // Si audio está apagado → navega al toque
    if (!AS || typeof AS.isEnabled !== "function" || !AS.isEnabled()) {
      window.location.href = href;
      return;
    }

    // ✅ Si está ON pero aún no arrancó por autoplay, forzamos startNow con este gesto
    if (typeof AS.startNow === "function") {
      try { await AS.startNow(); } catch {}
    }

    // Intentar reproducir voz del siguiente (si existe)
    let played = false;
    if (nextVoice && typeof AS.playVoice === "function") {
      try {
        played = await AS.playVoice(nextVoice);
      } catch {
        played = false;
      }
    }

    // Si alcanzó a sonar, esperamos un poco; si no, navegamos igual
    const delay = played ? 1200 : 0;
    setTimeout(() => {
      window.location.href = href;
    }, delay);
  }

  if (nextLink) {
    nextLink.addEventListener("click", handleGoCharacterClick);
  }

})();



