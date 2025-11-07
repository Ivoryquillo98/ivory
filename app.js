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

  if (data) {
    if (data.password === password) {
      currentUser = username;
      currentPassword = password;
      startChat();
    } else {
      alert("Contraseña incorrecta");
    }
  } else {
    // Crear nuevo usuario
    await fetch(`${DB_URL}/users/${username}.json`, {
      method: "PUT",
      body: JSON.stringify({
        password,
        createdAt: new Date().toISOString()
      })
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
  }, 2000); // actualiza cada 2 segundos
}

// 🟢 Mostrar mensaje
function addMessage(msg) {
  const el = document.createElement("div");
  el.classList.add("message");
  el.innerHTML = `<b>${msg.username}:</b> ${msg.text}`;
  messagesDiv.appendChild(el);
}
