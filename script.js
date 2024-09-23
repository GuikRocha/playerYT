"use strict";

let gInserted = false;

function globalInsert() {
    if (!gInserted) {
        const cssLink = document.createElement("link");
        cssLink.type = "text/css";
        cssLink.rel = "stylesheet";
        cssLink.href = "https://cdn.plyr.io/3.7.8/plyr.css";
        document.head.appendChild(cssLink);

        const script = document.createElement("script");
        script.src = "https://cdn.plyr.io/3.7.8/plyr.js";
        document.body.appendChild(script);

        gInserted = true;
    }
}

function instanceStyle(id, color, radius) {
    const style = document.createElement("style");
    style.innerHTML = `
        #${id} {
            --plyr-color-main: ${color || "#00b3ff"};
            border-radius: ${radius || "10"}px;
        }
    `;
    document.head.appendChild(style);
}

function init(options) {
    const {
        id,
        embed,
        loop = true,
        color,
        radius,
        controls = ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "pip", "airplay", "fullscreen"],
        settings = ["captions", "quality", "speed", "loop"],
        autoplay = false
    } = options;

    globalInsert();

    setupPlayer(id, embed, loop, color, radius, controls, settings, autoplay);
}

function setupPlayer(id, embed, loop, color, radius, controls, settings, autoplay) {
    instanceStyle(id, color, radius);

    const container = document.getElementById(id);
    container.classList.add("plyr__video-embed");

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${embed}?enablejsapi=1&rel=0&showinfo=0&controls=0&playsinline=1`; // Parâmetros para esconder info do YouTube
    iframe.allowFullscreen = true;
    iframe.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "0";

    container.appendChild(iframe);

    const player = new Plyr(`#${id}`, {
        loop: { active: loop },
        controls,
        settings,
        muted: true, // Inicia mudo
        keyboard: { focused: false, global: false }
    });

    player.on("ready", () => {
        player.muted = true; // Mantém mudo até interação
        if (!autoplay) {
            player.pause(); // Não reproduz automaticamente em mobile
        }
    });

    // Reproduz e desmuta ao clicar no player
    player.on("play", () => {
        if (player.muted) {
            player.muted = false;
        }
    });

    // Garante que o áudio seja ativado corretamente
    player.on("volumechange", () => {
        if (!player.muted) {
            player.muted = false;
        }
    });
}