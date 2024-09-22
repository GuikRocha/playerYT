"use strict";

let gInserted = false;
let gInsertedScript = false;
let unmute = false;

function getVideoIDFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('video_id');  // Pega o ID do vídeo da URL
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
        document.body.appendChild(script);

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
        loop = false,
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
    iframe.src = `https://www.youtube.com/embed/${videoID}?enablejsapi=1&autoplay=1&mute=1`;
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
        muted: true,  // Vídeo sempre começa mutado
        keyboard: { focused: false, global: false }
    });

    player.on("ready", function () {
        const overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100vh";

        const videoWrapper = document.querySelector(`#${id} > div.plyr__video-wrapper`);
        videoWrapper.appendChild(overlay);

        document.querySelector(`#${id}`).style.filter = "blur(0)";

        container.appendChild(unmuteButton);
        unmuteButton.addEventListener("click", function () {
            player.muted = false;
            unmuteButton.style.display = "none";
            player.play().catch(() => {
                console.error("Erro ao tentar reproduzir o vídeo.");
            });
            unmute = true;
        });

        player.play().catch(() => {
            console.error("Erro ao tentar reproduzir o vídeo automaticamente.");
        });
    });

    player.on("volumechange", function () {
        if (!player.muted) {
            unmuteButton.style.display = "none";
        }
    });
}

function start() {
    const videoID = getVideoIDFromURL(); // Pega o ID do vídeo da URL
    if (!videoID) {
        console.error("ID do vídeo não encontrado na URL.");
        return;
    }

    globalInsert();
    if (gInsertedScript) {
        gInsertedScript.addEventListener("load", function () {
            init({
                id: 'player',
                videoID: videoID, // Passa o ID do vídeo
                loop: false,
                color: 'red',
                radius: '10',
                controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
                settings: ['captions', 'quality', 'speed', 'loop'],
                autoplay: false
            });
        });
    } else {
        init({
            id: 'player',
            videoID: videoID, // Passa o ID do vídeo
            loop: false,
            color: 'red',
            radius: '10',
            controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
            settings: ['captions', 'quality', 'speed', 'loop'],
            autoplay: false
        });
    }
}

start(); // Inicia o player quando o script for carregado
