"use strict";

let gInserted = false;
let gInsertedScript = false;
let unmute = false;

// Pega o ID do vídeo da URL
function getVideoIDFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('video_id');
}

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
        videoID,
        loop = true,
        color,
        radius,
        controls = ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "pip", "airplay", "fullscreen"],
        settings = ["captions", "quality", "speed", "loop"],
        autoplay = false
    } = options;

    instanceStyle(id, color, radius);

    const container = document.getElementById(id);
    container.classList.add("plyr__video-embed");

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoID}?rel=0&showinfo=0&modestbranding=1&autoplay=${autoplay ? 1 : 0}&mute=1`; 
    iframe.allowFullscreen = true;
    iframe.allowtransparency = true;
    iframe.setAttribute("allow", "autoplay");

    const unmuteButton = document.createElement("button");
    unmuteButton.className = `${id}-unmute unmute-button`;
    unmuteButton.innerHTML = "&#128266; Ativar Áudio";

    container.appendChild(iframe);

    const player = new Plyr(`#${id}`, {
        loop: { active: loop },
        controls,
        settings,
        muted: true,  // Sempre começa mutado
        keyboard: { focused: false, global: false }
    });

    player.on("ready", function () {
        container.appendChild(unmuteButton);
        unmuteButton.addEventListener("click", function () {
            player.muted = false;
            unmuteButton.style.display = "none";
            player.currentTime = 0;
            unmute = true;
            player.play();  // Garantir que o vídeo continue rodando
        });

        player.on("click", function () {
            if (player.muted && !unmute) {
                player.muted = false;
                unmuteButton.style.display = "none";
                player.play();
                unmute = true;
            }
        });
    });
}

function start() {
    const videoID = getVideoIDFromURL();
    if (!videoID) {
        console.error("ID do vídeo não encontrado na URL.");
        return;
    }

    globalInsert();
    if (gInsertedScript) {
        gInsertedScript.addEventListener("load", function () {
            init({
                id: 'player',
                videoID: videoID,
                loop: false,
                color: 'red',
                radius: '10',
                controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
                settings: ['captions', 'quality', 'speed', 'loop'],
                autoplay: false,  // Desativar autoplay no mobile
            });
        });
    } else {
        init({
            id: 'player',
            videoID: videoID,
            loop: false,
            color: 'red',
            radius: '10',
            controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
            settings: ['captions', 'quality', 'speed', 'loop'],
            autoplay: false,
        });
    }
}

start();
