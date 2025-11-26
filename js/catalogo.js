// ✅ Lista de personajes
const personajes = [
  { nombre: "hisoka", fondo: "hisoka_fondo.jfif", audio: "voces/hisoka.mp3" },
  { nombre: "itachi", fondo: "itachi_fondo.jfif", audio: "voces/itachi.mp3" },
  { nombre: "vegeta", fondo: "vegeta_fondo.png", audio: "voces/vegeta.mp3" },
  { nombre: "chrollo", fondo: "chrollo_fondo.jfif", audio: "voces/chrollo.mp3" },
  { nombre: "killua", fondo: "killua_fondo.png", audio: "voces/killua.mp3" },
  { nombre: "gon", fondo: "gon_fondo.png", audio: "voces/gon.mp3" },
  { nombre: "leorio", fondo: "leorio_fondo.png", audio: "voces/leorio.mp3" },
  { nombre: "shizuku", fondo: "shizuku_fondo.png", audio: "voces/shizuku.mp3" },
  { nombre: "kurapika", fondo: "kurapika_fondo.png", audio: "voces/kurapika.mp3" },
  { nombre: "sasuke", fondo: "sasuke_fondo.png", audio: "voces/sasuke.mp3" },
  { nombre: "naruto", fondo: "naruto_fondo.png", audio: "voces/naruto.mp3" },
  { nombre: "kakashi", fondo: "kakashi_fondo.png", audio: "voces/kakashi.mp3" },
  { nombre: "goku", fondo: "goku_fondo.png", audio: "voces/goku.mp3" },
  { nombre: "gohan", fondo: "gohan_fondo.png", audio: "voces/gohan.mp3" },
  { nombre: "trunks", fondo: "trunks_fondo.png", audio: "voces/trunks.mp3" },
  { nombre: "luffy", fondo: "luffy_fondo.png", audio: "voces/luffy.mp3" },
  { nombre: "zoro", fondo: "zoro_fondo.png", audio: "voces/zoro.mp3" },
  { nombre: "sanji", fondo: "sanji_fondo.png", audio: "voces/sanji.mp3" }
];

// 📦 Contenedor donde se generarán las tarjetas
const container = document.getElementById("cardContainer");

// 📱 Detectar si es dispositivo táctil
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// 🔊 Reproductor de audio único
const audioPlayer = new Audio();

// 💫 Variable para guardar la tarjeta activa
let activeCard = null;

personajes.forEach(p => {
  const a = document.createElement("a");
  a.href = `personajes/${p.nombre}.html`;
  a.target = "_blank";

  const card = document.createElement("div");
  card.className = `card ${p.nombre}-card`;

  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";

  const fondo = document.createElement("img");
  fondo.src = `images/${p.fondo}`;
  fondo.className = "cover-image";
  fondo.loading = "lazy";

  const title = document.createElement("img");
  title.src = `images/${p.nombre}_nombre.png`;
  title.className = "title";
  title.loading = "lazy";

  const personaje = document.createElement("img");
  personaje.src = `images/${p.nombre}.png`;
  personaje.className = "character";
  personaje.loading = "lazy";

  wrapper.appendChild(fondo);
  card.appendChild(wrapper);
  card.appendChild(title);
  card.appendChild(personaje);
  a.appendChild(card);
  container.appendChild(a);

  // 🔊 Función para reproducir voz y manejar animación
  function activarPersonaje() {
    if (activeCard && activeCard !== card) {
      // Volver el anterior a estado normal
      activeCard.classList.remove("active");
      const prevChar = activeCard.querySelector(".character");
      prevChar.style.opacity = "0";
    }

    if (activeCard === card) {
      // 🔁 Segundo toque → redirigir al personaje
      window.open(a.href, "_blank");
      return;
    }

    // Activar nuevo personaje
    personaje.style.opacity = "1";
    card.classList.add("active");
    activeCard = card;

    // Reproducir audio
    audioPlayer.src = p.audio;
    audioPlayer.play().catch(() => {});
  }

  if (isTouch) {
    // 📱 En móviles: primer toque activa, segundo abre link
    card.addEventListener("click", e => {
      e.preventDefault();
      activarPersonaje();
    });
  } else {
    // 💻 En PC: hover reproduce audio
    card.addEventListener("mouseenter", () => {
      audioPlayer.src = p.audio;
      audioPlayer.play().catch(() => {});
    });

    // 💻 Click normal → abrir página
    card.addEventListener("click", e => {
      e.preventDefault();
      window.open(a.href, "_blank");
    });
  }
});
