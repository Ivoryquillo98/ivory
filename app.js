const DB_URL = "https://chat-d975a-default-rtdb.firebaseio.com/";

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginBox = document.getElementById("loginBox");
const chatBox = document.getElementById("chatBox");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let currentUser = null;
let currentPassword = null;

// 🧠 Obtener IP y país
async function getIpData() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    return await res.json();
  } catch {
    return { ip: "unknown", country_name: "unknown" };
  }
}

// 🟢 Iniciar sesión o crear usuario
loginBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Completa usuario y contraseña");
    return;
  }

  const res = await fetch(`${DB_URL}/users/${username}.json`);
  const data = await res.json();

  // 🧠 Datos extra del usuario
  const ipData = await getIpData();
  const device = navigator.userAgent;

  if (data) {
    if (data.password === password) {
      // Usuario correcto → actualizar estado a online
      await fetch(`${DB_URL}/users/${username}.json`, {
        method: "PATCH",
        body: JSON.stringify({ status: "online", lastLogin: new Date().toISOString() })
      });
      currentUser = username;
      currentPassword = password;
      startChat();
    } else {
      alert("Contraseña incorrecta");
    }
  } else {
    // Crear nuevo usuario con datos completos
    const userData = {
      password,
      createdAt: new Date().toISOString(),
      ip: ipData.ip,
      country: ipData.country_name,
      device,
      status: "online",
      messageCount: 0
    };

    await fetch(`${DB_URL}/users/${username}.json`, {
      method: "PUT",
      body: JSON.stringify(userData)
    });

    currentUser = username;
    currentPassword = password;
    startChat();
  }
});

function startChat() {
  loginBox.classList.add("hidden");
  chatBox.classList.remove("hidden");
  loadMessages();
  listenForMessages();
}

// 🟢 Enviar mensaje
sendBtn.addEventListener("click", async () => {
  const text = messageInput.value.trim();
  if (!text) return;

  const message = {
    username: currentUser,
    text,
    timestamp: Date.now()
  };

  await fetch(`${DB_URL}/messages.json`, {
    method: "POST",
    body: JSON.stringify(message)
  });

  // 🔢 Aumentar contador de mensajes del usuario
  const userRes = await fetch(`${DB_URL}/users/${currentUser}.json`);
  const userData = await userRes.json();
  const newCount = (userData.messageCount || 0) + 1;

  await fetch(`${DB_URL}/users/${currentUser}.json`, {
    method: "PATCH",
    body: JSON.stringify({ messageCount: newCount })
  });

  messageInput.value = "";
});

// 🟢 Cargar mensajes iniciales
async function loadMessages() {
  const res = await fetch(`${DB_URL}/messages.json`);
  const data = await res.json();
  messagesDiv.innerHTML = "";
  if (data) {
    Object.values(data).forEach((msg) => addMessage(msg));
  }
}

// 🟢 Escucha pseudo “tiempo real”
function listenForMessages() {
  setInterval(async () => {
    const res = await fetch(`${DB_URL}/messages.json`);
    const data = await res.json();
    if (data) {
      messagesDiv.innerHTML = "";
      Object.values(data).forEach((msg) => addMessage(msg));
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  }, 2000);
}

// 🟢 Mostrar mensaje
function addMessage(msg) {
  const el = document.createElement("div");
  el.classList.add("message");
  el.innerHTML = `<b>${msg.username}:</b> ${msg.text}`;
  messagesDiv.appendChild(el);
}


// ============================
// 🎵 RADIO / MÚSICA
// ============================

// 🎶 Lista real de canciones (asegúrate que los nombres coincidan exactamente)
const songs = [
  { title: "Peace of Mind", artist: "Boston", file: "musica/Boston - Peace of Mind (Official Audio).mp3" },
  { title: "Wheel in the Sky", artist: "Journey", file: "musica/Journey - Wheel in the Sky (Official HD Video - 1978).mp3" },
  { title: "Little Dark Age", artist: "MGMT", file: "musica/MGMT - Little Dark Age (Official Video).mp3" },
  { title: "More Than a Feeling", artist: "Boston", file: "musica/More Than a Feeling.mp3" },
  { title: "After Dark", artist: "Mr.Kitty", file: "musica/Mr.Kitty - After Dark.mp3" },
  { title: "Until I Found You", artist: "Stephen Sanchez", file: "musica/Stephen Sanchez - Until I Found You.mp3" },
  { title: "Shot At The Night", artist: "The Killers", file: "musica/The Killers - Shot At The Night.mp3" },
  { title: "Sweater Weather", artist: "The Neighbourhood", file: "musica/The Neighbourhood - Sweater Weather (Official Video).mp3" },
  { title: "After Hours", artist: "The Weeknd", file: "musica/The Weeknd - After Hours (Audio).mp3" },
  { title: "In Your Eyes", artist: "The Weeknd", file: "musica/The Weeknd - In Your Eyes (Official Audio).mp3" }
];

let currentSongIndex = 0;
const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");

// 🔹 Función para cargar canción
function loadSong(index) {
  const song = songs[index];
  audioPlayer.src = song.file;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
}

// 🔹 Función para reproducir/pausar
function togglePlayPause() {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseBtn.innerHTML = `
      <path d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm4.448-10.448-3.6-3.6a1.2 1.2 0 0 0-1.696 1.696l1.551 1.552H8.4a1.2 1.2 0 1 0 0 2.4h4.303l-1.551 1.552a1.2 1.2 0 1 0 1.696 1.696l3.6-3.6a1.2 1.2 0 0 0 0-1.696Z"/>`;
  } else {
    audioPlayer.pause();
    playPauseBtn.innerHTML = `
      <path d="M8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z"/>`;
  }
}

// 🔹 Función para siguiente canción
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audioPlayer.play();
}

// 🔹 Función para anterior canción
function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  audioPlayer.play();
}

// 🔹 Cambiar canción al terminar
audioPlayer.addEventListener("ended", nextSong);

// 🔹 Eventos de botones
playPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// 🔹 Cargar la primera canción al iniciar
loadSong(currentSongIndex);
