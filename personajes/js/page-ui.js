/* =========================================================
   page-ui.js (GLOBAL)
   Controla: Slider + Dueños + Rotación "Diseñada para" +
            Planes + WhatsApp + Voz del personaje +
            ✅ Voz al cambiar de personaje (flecha)
            ✅ Tier visual (silver / gold / platinum) por imagen
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
  const slidesEl = byId("slides");
  const sliderButtons = document.querySelectorAll(".slider > a");

  const ownerLabel = byId("ownerLabel");
  const ownerNameEl = byId("ownerName");

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
  if (!slidesEl) console.warn("[page-ui] Falta #slides");
  if (!ownerLabel) console.warn("[page-ui] Falta #ownerLabel");
  if (!ownerNameEl) console.warn("[page-ui] Falta #ownerName");
  if (!wspBtn) console.warn("[page-ui] Falta #wspBtn");

  // ===========================
  // 1) SLIDER + TIER VISUAL
  // ===========================
  const images = Array.isArray(cfg.images) ? cfg.images : [];

  function setOwner(name) {
    if (ownerNameEl) ownerNameEl.textContent = name || "";
  }

  function setTier(tier) {
    if (!slidesEl) return;
    slidesEl.setAttribute("data-tier", tier || "silver");
  }

  function showSlide(index) {
    if (!sliderImage) return;
    if (index < 0 || index >= images.length) return;

    sliderImage.classList.remove("show");

    setTimeout(() => {
      const item = images[index];

      sliderImage.src = item.src;
      setOwner(item.owner);
      setTier(item.tier);

      sliderImage.classList.add("show");
    }, 150);
  }

  function applyHash() {
    const match = window.location.hash.match(/^#slide-(\d+)$/);
    if (!match) return;
    showSlide(Number(match[1]) - 1);
  }

  sliderButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => showSlide(index));
  });

  window.addEventListener("hashchange", applyHash);

  if (window.location.hash) applyHash();
  else if (images.length) showSlide(0);

  // ===========================
  // 2) ROTACIÓN "Diseñada para"
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
    if (!ownerLabel || labelTimer) return;

    ownerLabel.textContent = ownerLabelTexts[labelIndex];

    labelTimer = setInterval(() => {
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
        "Estampado en 2 áreas",
        "Hasta 2 revisiones del diseño",
        "Entrega prioritaria"
      ]
    },
    platinum: {
      label: "Plan Platinum",
      price: "$24.990 CLP",
      features: [
        "Camiseta premium + oversize opcional",
        "Estampado full color",
        "Estampado en 3 áreas",
        "Hasta 4 revisiones + retoque pro",
        "Empaque premium"
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
      p.features.forEach(f => {
        const li = document.createElement("li");
        li.textContent = f;
        planFeatures.appendChild(li);
      });
    }

    if (wspBtn) {
      const msg =
        `Hola! Quiero comprar una camiseta personalizada (Camisetas Únicas).\n` +
        `Diseño inspirado en: ${cfg.characterName || "Camiseta"}\n` +
        `Plan elegido: ${p.label}\n` +
        `Precio: ${p.price}\n` +
        `¿Qué tallas y colores tienes disponibles?`;

      wspBtn.href = `https://wa.me/${cfg.phoneNumber || ""}?text=${encodeURIComponent(msg)}`;
    }
  }

  setPlan("silver");
  radioSilver?.addEventListener("change", () => setPlan("silver"));
  radioGold?.addEventListener("change", () => setPlan("gold"));
  radioPlatinum?.addEventListener("change", () => setPlan("platinum"));

  // ===========================
  // 4) VOZ del personaje
  // ===========================
  const voiceSrc = cfg.voiceSrc || "";

  function playVoice(src = voiceSrc) {
    if (!src) return;
    window.AudioSystem?.playVoice?.(src);
  }

  characterCard?.addEventListener("click", playVoice);
  characterTitle?.addEventListener("click", e => { e.stopPropagation(); playVoice(); });
  carouselTitle?.addEventListener("click", e => { e.stopPropagation(); playVoice(); });

  // ===========================
  // 5) VOZ AL CAMBIAR DE PERSONAJE
  // ===========================
  let navigating = false;

  async function handleGoCharacterClick(e) {
    e.preventDefault();
    if (navigating) return;
    navigating = true;

    const href = e.currentTarget.getAttribute("href");
    const nextVoice = e.currentTarget.getAttribute("data-voice-next") || cfg.nextVoiceSrc || "";
    const AS = window.AudioSystem;

    if (!AS?.isEnabled?.()) {
      window.location.href = href;
      return;
    }

    try { await AS.startNow?.(); } catch {}

    const played = nextVoice ? await AS.playVoice?.(nextVoice) : false;
    const delay = played ? 1500 : 0;

    setTimeout(() => {
      window.location.href = href;
    }, delay);
  }

  nextLink?.addEventListener("click", handleGoCharacterClick);

})();
