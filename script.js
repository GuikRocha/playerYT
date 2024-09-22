"use strict";

// Função para obter parâmetros da URL
function getUrlParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function globalInsert() {
    const style = document.createElement("style");
    style.innerHTML = `
        .plyr iframe[id^=youtube] {
            top: -100%!important;
            min-height: 300%!important;
        }
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
}

// Função de inicialização do player
function initPlayer(embedId) {
    const container = document.getElementById('player');
    container.classList.add('plyr__video-embed');

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${embedId}`;
    iframe.allowFullscreen = true;
    iframe.allowtransparency = true;
    iframe.setAttribute('allow', 'autoplay');

    const unmuteButton = document.createElement('button');
    unmuteButton.className = 'unmute-button';
    unmuteButton.innerHTML = "&#128266; Ativar Áudio";

    container.appendChild(iframe);

    const player = new Plyr('#player', {
        loop: { active: false },
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
        settings: ['captions', 'quality', 'speed', 'loop'],
        muted: true,
        keyboard: { focused: false, global: false }
    });

    player.on('ready', function () {
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100vh';

        const videoWrapper = document.querySelector('#player > div.plyr__video-wrapper');
        videoWrapper.appendChild(overlay);

        document.querySelector('#player').style.filter = 'blur(0)';

        container.appendChild(unmuteButton);

        unmuteButton.addEventListener('click', function () {
            player.muted = false;
            unmuteButton.style.display = 'none';
            player.currentTime = 0;
        });
    });
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    globalInsert();
    const embedId = getUrlParameter('embed');
    
    if (embedId) {
        initPlayer(embedId);
    } else {
        console.error("Nenhum parâmetro 'embed' foi fornecido na URL.");
    }
});
