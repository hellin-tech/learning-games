const Cloudhelden = (() => {
  function assetPath(path) {
    const depth = document.body.dataset.depth || "../..";
    return `${depth}/assets/${path}`;
  }

  function renderHeader({ kicker = "Cloudhelden Lernspiel", title, subtitle }) {
    const mount = document.querySelector("[data-ch-header]");
    if (!mount) return;

    mount.innerHTML = `
      <div class="ch-header">
        <img class="ch-logo" src="${assetPath("images/cloudhelden-logo.png")}" alt="Cloudhelden Logo">
        <div>
          <span class="ch-kicker">${kicker}</span>
          <h1>${title}</h1>
          ${subtitle ? `<p>${subtitle}</p>` : ""}
        </div>
      </div>
    `;
  }

  function renderFooter() {
    const mount = document.querySelector("[data-ch-footer]");
    if (!mount) return;
    mount.innerHTML = `<div class="ch-footer">Cloudhelden · Interaktive Lernaufgabe</div>`;
  }

  function setProgress(current, total) {
    const bar = document.querySelector(".progress-bar");
    if (!bar) return;
    const percent = total <= 0 ? 0 : Math.round((current / total) * 100);
    bar.style.width = `${percent}%`;
  }

  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  return {
    renderHeader,
    renderFooter,
    setProgress,
    shuffle,
    assetPath
  };
})();
