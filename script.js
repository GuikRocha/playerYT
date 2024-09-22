"use strict";

// Função para pegar o ID do vídeo da URL
function getVideoIDFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('video_id');
}

// Inicializa o player com as opções
function initPlayer(videoID) {
    const playerContainer = document.getElementById('player');
    playerContainer.classList.add('plyr__video-embed');

    // Cria o iframe do YouTube
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoID}?rel=0&showinfo=0&modestbranding=1&mute=1&autoplay=1`;
    iframe.allowFullscreen = true;
    iframe.allow = "autoplay; encrypted-media";

    // Cria o botão de ativar áudio
    const unmuteButton = document.createElement('button');
    unmuteButton.classList.add('unmute-button');
    unmuteButton.innerHTML = "&#128266; Ativar Áudio";

    // Insere o iframe e o botão de ativar áudio no container
    playerContainer.appendChild(iframe);
    playerContainer.appendChild(unmuteButton);

    // Ao clicar no botão, remove o mudo e esconde o botão
    unmuteButton.addEventListener('click', function () {
        const src = iframe.src;
        iframe.src = src.replace('mute=1', 'mute=0'); // Desmuta o vídeo
        unmuteButton.style.display = 'none'; // Esconde o botão
    });
}

// Função para iniciar o player
function startPlayer() {
    const videoID = getVideoIDFromURL();
    if (!videoID) {
        console.error('ID do vídeo não encontrado na URL.');
        return;
    }

    initPlayer(videoID);
}

// Iniciar o player ao carregar a página
document.addEventListener('DOMContentLoaded', startPlayer);
