(() => {
  "use strict";

  // Busca el ECG visible (solo hay uno)
  const ecg = document.querySelector(".ecg-pro");
  if (!ecg) return;

  const trace = ecg.querySelector(".ecg-trace");
  if (!trace) return;

  const D =
    "M0 45.486" +
    "H38.514L44.595 33.324L50.676 45.486H57.771L62.838 55.622L71.959 9L80.067 63.729L84.122 45.486H97.297L103.379 40.419L110.473 45.486H150" +
    "H188.514L194.595 33.324L200.676 45.486H207.771L212.838 55.622L221.959 9L230.067 63.729L234.122 45.486H247.297L253.379 40.419L260.473 45.486H300" +
    "H338.514L344.595 33.324L350.676 45.486H357.771L362.838 55.622L371.959 9L380.067 63.729L384.122 45.486H397.297L403.379 40.419L410.473 45.486H450";

  trace.setAttribute("d", D);

  const length = trace.getTotalLength();

  trace.style.strokeDasharray = length;
  trace.style.strokeDashoffset = length;

  // fuerza reflow
  trace.getBoundingClientRect();

  const CONFIG = {
    drawMs: 3300,
    holdMs: 450,
    resetMs: 180,
    loop: true
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  (async function animate(){
    while (true){
      trace.style.transition = `stroke-dashoffset ${CONFIG.drawMs}ms linear`;
      trace.style.strokeDashoffset = "0";
      await sleep(CONFIG.drawMs);

      await sleep(CONFIG.holdMs);

      trace.style.transition = `stroke-dashoffset ${CONFIG.resetMs}ms linear`;
      trace.style.strokeDashoffset = length;
      await sleep(CONFIG.resetMs);

      if (!CONFIG.loop) break;
    }
  })();

})();
