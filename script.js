"use strict";

let gInserted = false;
let gInsertedScript = false;
let unmute = false;

function globalInsert() {
    if (!gInserted) {
        const cssLink = document.createElement("link");
        cssLink.type = "text/css";
        cssLink.rel = "stylesheet";
        cssLink.href = "https://cdn.plyr.io/3.7.8/plyr.css";
        document.head.appendChild(cssLink);

        const script = document.createElement("script");
        script.src = "https://cdn.plyr.io/3.7.8/plyr.js";
        const existingScript = document.body.getElementsByTagName("script")[0];
        if (existingScript) {
            document.body.insertBefore(script, existingScript);
        } else {
            document.body.appendChild(script);
        }

        gInserted = true;
        gInsertedScript = script;
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

    if (gInsertedScript) {
        gInsertedScript.addEventListener("load", function () {
            setupPlayer(id, embed, loop, color, radius, controls, settings, autoplay);
        });
    } else {
        setupPlayer(id, embed, loop, color, radius, controls, settings, autoplay);
    }
}

function setupPlayer(id, embed, loop, color, radius, controls, settings, autoplay) {
    instanceStyle(id, color, radius);

    const container = document.getElementById(id);
    container.classList.add("plyr__video-embed");

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${embed}?enablejsapi=1&controls=0&rel=0&autoplay=${autoplay ? 1 : 0}&mute=1`;
    iframe.allowFullscreen = true;
    iframe.allowtransparency = true;
    iframe.setAttribute("allow", "autoplay; fullscreen");
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "0";

    const unmuteButton = document.createElement("button");
    unmuteButton.className = `${id}-unmute unmute-button`;
    unmuteButton.innerHTML = "&#128266; Ativar Áudio";

    container.appendChild(iframe);

    const player = new Plyr(`#${id}`, {
        loop: { active: loop },
        controls,
        settings,
        muted: true,
        keyboard: { focused: false, global: false }
    });

    // Aguardando o player estar pronto
    player.on("ready", function () {
        document.querySelector(`#${id}`).style.filter = "blur(0)";

        if (!autoplay) {
            // Exibe o botão de desmutar se não houver autoplay
            container.appendChild(unmuteButton);

            // Ação ao clicar no botão de desmutar
            unmuteButton.addEventListener("click", function () {
                player.muted = false;  // Desmuta o player
                unmuteButton.style.display = "none";  // Esconde o botão
                player.play();  // Garante que o vídeo seja reproduzido
            });

            player.on("click", function () {
                if (player.muted) {
                    player.muted = false;  // Desmuta o player
                    unmuteButton.style.display = "none";  // Esconde o botão
                    player.play();  // Garante que o vídeo seja reproduzido
                }
            });
        }
    });

    // Ação quando o volume é ajustado
    player.on("volumechange", function () {
        if (!player.muted) {
            unmuteButton.style.display = "none";  // Esconde o botão quando o volume for ajustado
        }
    });
}
