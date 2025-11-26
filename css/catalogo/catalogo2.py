:root {
  --card-height: 300px;
  --card-width: calc(var(--card-height) / 1.5);
}

* {
  box-sizing: border-box;
}

body {
  width: 100vw;
  min-height: 100vh;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #191c29;
  padding-top: 150px; /* desplazamos las tarjetas hacia abajo */
  padding-bottom: 50px;
}

.grid {
  display: flex;
  gap: 50px;
  justify-content: center;
  flex-wrap: wrap; /* permite varias filas si es necesario */
}

.card {
  width: var(--card-width);
  height: var(--card-height);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0 36px;
  perspective: 2500px;
  margin: 0 50px;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wrapper {
  transition: all 0.5s;
  position: absolute;
  width: 100%;
  z-index: -1;
  top: 0; /* asegurar que no se corte por arriba */
}

.card:hover .wrapper {
  transform: perspective(900px) translateY(-5%) rotateX(25deg) translateZ(0);
  box-shadow: 2px 35px 32px -8px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 2px 35px 32px -8px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 2px 35px 32px -8px rgba(0, 0, 0, 0.75);
}

.wrapper::before,
.wrapper::after {
  content: "";
  opacity: 0;
  width: 100%;
  height: 80px;
  transition: all 0.5s;
  position: absolute;
  left: 0;
}

.wrapper::before {
  top: 0;
  height: 100%;
  background-image: linear-gradient(
    to top,
    transparent 46%,
    rgba(12, 13, 19, 0.5) 68%,
    rgba(12, 13, 19) 97%
  );
}

.wrapper::after {
  bottom: 0;
  opacity: 1;
  background-image: linear-gradient(
    to bottom,
    transparent 46%,
    rgba(12, 13, 19, 0.5) 68%,
    rgba(12, 13, 19) 97%
  );
}

.card:hover .wrapper::before,
.wrapper::after {
  opacity: 1;
}

.card:hover .wrapper::after {
  height: 120px;
}

.title {
  width: 100%;
  transition: transform 0.5s;
}

.card:hover .title {
  transform: translate3d(0%, -50px, 100px);
}

.character {
  width: 100%;
  opacity: 0;
  transition: all 0.5s;
  position: absolute;
  z-index: -1;
}

.card:hover .character {
  opacity: 1;
  transform: translate3d(0%, -30%, 100px);
}

/* Hacer el título de Hisoka más grande y mantener el efecto hover */
.hisoka-card .title {
  transform: scale(1.3);
  transition: transform 0.5s;
}

.hisoka-card:hover .title {
  transform: scale(1.3) translate3d(0%, -50px, 100px);
}

/* Hacer el título de Itachi más grande y mantener el efecto hover */
.itachi-card .title {
  transform: scale(1.3);
  transition: transform 0.5s;
}

.itachi-card:hover .title {
  transform: scale(1.2) translate3d(0%, -50px, 100px);
}

/* 🔥 Efecto especial para Vegeta */
.vegeta-card .title {
  transform: scale(1.3);
  transition: transform 0.5s, filter 0.5s;
}

/* Al pasar el mouse: el título sube un poco y brilla */
.vegeta-card:hover .title {
  transform: scale(1.3) translate3d(0%, -50px, 100px);
  filter: drop-shadow(0 0 15px rgba(150, 0, 255, 0.8)) brightness(1.3);
}

/* Efecto opcional para el aura o fondo */
.vegeta-card:hover .cover-image {
  filter: brightness(1.2) saturate(1.2);
  transition: filter 0.5s ease;
}

/* 🔥 Efecto base para Killua */
.killua-card .title {
  transform: scale(1.3); /* tamaño inicial */
  transition: transform 0.5s, filter 0.5s;
}

/* Al pasar el mouse: el título sube y brilla */
.killua-card:hover .title {
  transform: scale(1.3) translate3d(0%, -50px, 100px);
  filter: drop-shadow(0 0 15px rgba(150, 0, 255, 0.8)) brightness(1.3);
}

/* Efecto para el fondo/cover */
.killua-card:hover .cover-image {
  filter: brightness(1.2) saturate(1.2);
  transition: filter 0.5s ease;
}

/* 🔥 Efecto base para Chrollo */
.chrollo-card .title {
  transform: scale(1.3); /* tamaño inicial */
  transition: transform 0.5s, filter 0.5s;
}

/* Al pasar el mouse: el título sube y brilla */
.chrollo-card:hover .title {
  transform: scale(1.3) translate3d(0%, -50px, 100px);
  filter: drop-shadow(0 0 15px rgba(150, 0, 255, 0.8)) brightness(1.3);
}

/* Efecto para el fondo/cover */
.chrollo-card:hover .cover-image {
  filter: brightness(1.2) saturate(1.2);
  transition: filter 0.5s ease;
}

/* 🔥 Efecto base para Gon */
.gon-card .title {
  transform: scale(0.8); /* un poco más pequeño que los otros */
  transition: transform 0.5s, filter 0.5s;
}

/* Al pasar el mouse: el título sube un poco y brilla */
.gon-card:hover .title {
  transform: scale(1.2) translate3d(0%, -30px, 100px); /* menos desplazamiento */
  filter: drop-shadow(0 0 15px rgba(150, 0, 255, 0.8)) brightness(1.3);
}

/* Efecto para el fondo/cover */
.gon-card:hover .cover-image {
  filter: brightness(1.2) saturate(1.2);
  transition: filter 0.5s ease;
}

/* 🔥 Efecto base para Leorio */
.leorio-card .title {
  transform: scale(1.6); /* mismo tamaño que Gon */
  transition: transform 0.5s, filter 0.5s;
}

/* Al pasar el mouse: el título sube un poco y brilla */
.leorio-card:hover .title {
  transform: scale(1.7) translate3d(0%, -30px, 100px); /* mismo desplazamiento que Gon */
  filter: drop-shadow(0 0 15px rgba(150, 0, 255, 0.8)) brightness(1.3);
}

/* Efecto para el fondo/cover */
.leorio-card:hover .cover-image {
  filter: brightness(1.2) saturate(1.2);
  transition: filter 0.5s ease;
}

/* 🔥 Efecto base para Shizuku */
.shizuku-card .title {
  transform: scale(1.7); /* mismo tamaño que Gon */
  transition: transform 0.5s, filter 0.5s;
}

/* Al pasar el mouse: el título sube un poco y brilla */
.shizuku-card:hover .title {
  transform: scale(1.7) translate3d(0%, -30px, 100px); /* mismo desplazamiento que Gon */
  filter: drop-shadow(0 0 15px rgba(132, 6, 222, 0.929)) brightness(1.3);
}

/* Efecto para el fondo/cover */
.shizuku-card:hover .cover-image {
  filter: brightness(1.2) saturate(1.2);
  transition: filter 0.5s ease;
}

/* 🔥 Efecto base para Kurapika */
.kurapika-card .title {
  transform: scale(1.2);
  transition: transform 0.5s, filter 0.5s;
}

/* Al pasar el mouse: el título sube y brilla dorado */
.kurapika-card:hover .title {
  transform: scale(1.5) translate3d(0%, -30px, 100px);
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.9)) brightness(1.3);
}

/* Efecto para el fondo/cover */
.kurapika-card:hover .cover-image {
  filter: brightness(1.2) saturate(1.3);
  transition: filter 0.5s ease;
}

/* 🔥 Efecto base para Sasuke */
.sasuke-card .title {
  transform: scale(1.7);
  transition: transform 0.5s, filter 0.5s;
}

/* Al pasar el mouse: el título sube y brilla azul eléctrico */
.sasuke-card:hover .title {
  transform: scale(1.7) translate3d(0%, -30px, 100px);
  filter: drop-shadow(0 0 15px rgba(0, 100, 255, 0.9)) brightness(1.3);
}

/* Efecto para el fondo/cover */
.sasuke-card:hover .cover-image {
  filter: brightness(1.2) saturate(1.3);
  transition: filter 0.5s ease;
}

/* 🔥 Efecto base para Naruto */
.naruto-card .title {
  transform: scale(1.8);
  transition: transform 0.5s, filter 0.5s;
}

/* Al pasar el mouse: el título sube y brilla naranja */
.naruto-card:hover .title {
  transform: scale(1.7) translate3d(0%, -30px, 100px);
  filter: drop-shadow(0 0 15px rgba(255, 140, 0, 0.9)) brightness(1.3);
}

/* Efecto para el fondo/cover */
.naruto-card:hover .cover-image {
  filter: brightness(1.2) saturate(1.3);
  transition: filter 0.5s ease;
}

/* 🔥 Efecto base para Goku */
.goku-card .title {
  transform: scale(0.8);
  transition: transform 0.5s, filter 0.5s;
}

.goku-card:hover .title {
  transform: scale(1.7) translate3d(0%, -30px, 100px);
  filter: drop-shadow(0 0 15px rgba(0, 170, 255, 0.9)) brightness(1.3);
}

.goku-card:hover .cover-image {
  filter: brightness(1.2) saturate(1.3);
  transition: filter 0.5s ease;
}

/* 🔥 Efecto base para Gohan */
.gohan-card .title {
  transform: scale(1.2);
  transition: transform 0.5s, filter 0.5s;
}

.gohan-card:hover .title {
  transform: scale(1.7) translate3d(0%, -30px, 100px);
  filter: drop-shadow(0 0 15px rgba(128, 0, 255, 0.9)) brightness(1.3); /* brillo violeta */
}

.gohan-card:hover .cover-image {
  filter: brightness(1.2) saturate(1.3);
  transition: filter 0.5s ease;
}

/* 🔥 Efecto base para Trunks */
.trunks-card .title {
  transform: scale(1.2);
  transition: transform 0.5s, filter 0.5s;
}

.trunks-card:hover .title {
  transform: scale(1.7) translate3d(0%, -30px, 100px);
  filter: drop-shadow(0 0 15px rgba(0, 200, 255, 0.9)) brightness(1.3); /* brillo celeste */
}

.trunks-card:hover .cover-image {
  filter: brightness(1.2) saturate(1.3);
  transition: filter 0.5s ease;
}

/* 🔥 Efecto base para Luffy */
.luffy-card .title {
  transform: scale(1.2);
  transition: transform 0.5s, filter 0.5s;
}

.luffy-card:hover .title {
  transform: scale(1.7) translate3d(0%, -30px, 100px);
  filter: drop-shadow(0 0 15px rgba(255, 80, 0, 0.9)) brightness(1.3); /* rojo estilo Luffy */
}

.luffy-card:hover .cover-image {
  filter: brightness(1.2) saturate(1.3);
  transition: filter 0.5s ease;
}

/* 🔥 Efecto base para Zoro */
.zoro-card .title {
  transform: scale(1.2);
  transition: transform 0.5s, filter 0.5s;
}

.zoro-card:hover .title {
  transform: scale(1.7) translate3d(0%, -30px, 100px);
  filter: drop-shadow(0 0 15px rgba(0, 255, 80, 0.9)) brightness(1.3); /* verde estilo Zoro */
}

.zoro-card:hover .cover-image {
  filter: brightness(1.2) saturate(1.3);
  transition: filter 0.5s ease;
}

/* 🔥 Efecto base para Sanji */
.sanji-card .title {
  transform: scale(1.2);
  transition: transform 0.5s, filter 0.5s;
}

.sanji-card:hover .title {
  transform: scale(1.7) translate3d(0%, -30px, 100px);
  filter: drop-shadow(0 0 15px rgba(255, 200, 0, 0.9)) brightness(1.3); /* amarillo estilo Sanji */
}

.sanji-card:hover .cover-image {
  filter: brightness(1.2) saturate(1.3);
  transition: filter 0.5s ease;
}
