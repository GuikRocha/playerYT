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
    iframe.src = `https://www.youtube.com/embed/${embed}?enablejsapi=1&controls=1&rel=0`; // Removido autoplay e mute para evitar problemas
    iframe.allowFullscreen = true;
    iframe.allowtransparency = true;
    iframe.setAttribute("allow", "autoplay; encrypted-media; fullscreen; picture-in-picture");
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "0";

    const unmuteButton = document.createElement("button");
    unmuteButton.className = `${id}-unmute unmute-button`;
    unmuteButton.innerHTML = "&#128266; Ativar Áudio";
    unmuteButton.style.display = "none"; // Inicia escondido, só mostra se necessário

    container.appendChild(iframe);

    const player = new Plyr(`#${id}`, {
        loop: { active: loop },
        controls,
        settings,
        muted: true, // Inicia mudo
        keyboard: { focused: false, global: false }
    });

    player.on("ready", function () {
        document.querySelector(`#${id}`).style.filter = "blur(0)";

        if (!autoplay) {
            // Não reproduz automaticamente, requer interação
            player.pause();

            // Exibe o botão de desmutar
            unmuteButton.style.display = "block";
            container.appendChild(unmuteButton);

            unmuteButton.addEventListener("click", function () {
                player.muted = false;  // Desmuta o player
                player.play();  // Garante que o vídeo seja reproduzido
                unmuteButton.style.display = "none";  // Esconde o botão
                unmute = true;  // Marca que o vídeo foi desmutado manualmente
            });

            // Também desmuta se o vídeo for clicado
            player.on("play", function () {
                if (player.muted) {
                    player.muted = false;
                }
                unmuteButton.style.display = "none"; // Esconde o botão quando o vídeo começar a tocar
            });
        }
    });

    // Verifica se o volume foi alterado e esconde o botão de desmutar
    player.on("volumechange", function () {
        if (!player.muted) {
            unmuteButton.style.display = "none";
        }
    });
}

