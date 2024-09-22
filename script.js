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
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

function getEmbedParam() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('embed') || 'bPh9MQNQOa0'; // Default video if no param
}

function initPlayer(options) {
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

    instanceStyle(id, color, radius);

    const container = document.getElementById(id);
    container.classList.add("plyr__video-embed");

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${embed}?rel=0&showinfo=0`;
    iframe.allowFullscreen = true;
    iframe.allowtransparency = true;
    iframe.setAttribute("allow", "autoplay; fullscreen");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    container.appendChild(iframe);

    const player = new Plyr(`#${id}`, {
        loop: { active: loop },
        controls,
        settings,
        keyboard: { focused: false, global: false }
    });

    player.on("ready", function () {
        document.querySelector(`#${id}`).style.filter = "blur(0)";
        
        if (autoplay) {
            player.play();
        }
    });
}

function startPlayer() {
    globalInsert();
    const embedParam = getEmbedParam();
    const options = {
        id: 'player',
        embed: embedParam,
        loop: false,
        color: 'red',
        radius: '10',
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
        settings: ['captions', 'quality', 'speed', 'loop'],
        autoplay: false,
    };

    if (gInsertedScript) {
        gInsertedScript.addEventListener("load", function () {
            initPlayer(options);
        });
    } else {
        initPlayer(options);
    }
}

startPlayer();
