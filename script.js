"use strict";

let gInserted = false;
let unmute = false;

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function globalInsert() {
    if (!gInserted) {
        const style = document.createElement("style");
        style.innerHTML = `
            .plyr {
                filter: blur(1.5rem);
                transition: filter 1.3s;
                box-shadow: 0 2px 5px rgba(0, 0, 0, .2);
            }
            .unmute-button {
                border: none!important;
                text-align: center!important;
                position: absolute!important;
                top: 50%!important;
                left: 50%!important;
                transform: translate(-50%, -50%)!important;
                background: #ff3c3c!important;
                padding: 15px!important;
                border-radius: 5px!important;
                width: 50%!important;
                box-shadow: 0px 3px 10px #00000077!important;
                cursor: pointer!important;
                z-index: 9999999999!important;
                color: #fff!important;
                font-weight: bold!important;
                font-size: 1rem!important;
                transition: transform 0.3s ease!important;
            }
            .unmute-button:hover {
                transform: translate(-50%, -50%) scale(1.1)!important;
            }
        `;
        document.head.appendChild(style);
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

    instanceStyle(id, color, radius);

    const container = document.getElementById(id);
    container.classList.add("plyr__video-embed");

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${embed}?autoplay=0&mute=1&enablejsapi=1&controls=0&rel=0`;
    iframe.allowFullscreen = true;
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
        muted: autoplay ? false : true,
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

        if (autoplay) {
            container.appendChild(unmuteButton);
            unmuteButton.addEventListener("click", function () {
                player.muted = false;
                unmuteButton.style.display = "none";
                player.currentTime = 0;
                unmute = true;
            });

            player.on("click", function () {
                if (player.muted && !unmute) {
                    player.muted = false;
                    unmuteButton.style.display = "none";
                    player.currentTime = 0;
                    player.play();
                    unmute = true;
                } else if (!player.muted) {
                    unmuteButton.style.display = "none";
                }
            });

            player.play();
        }
    });
}

function start(options) {
    globalInsert();
    init(options);
}

const embed = getQueryParam('embed'); // Obtém o parâmetro 'embed' da URL

if (embed) {
    start({
        id: 'player',
        embed: embed, // Usa o embed fornecido pela URL
        loop: false,
        color: 'red',
        radius: '10',
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
        settings: ['captions', 'quality', 'speed', 'loop'],
        autoplay: false,
    });
} else {
    console.error('Parâmetro "embed" não foi encontrado na URL.');
}
