// State
let playlists = ["Lo-Fi Vibes", "Workout Hits"];
let PlaylistFilter = null;

const initialSongs = [
  {
    id: 1,
    title: "Tujhko Cocktail 2",
    artist: "Arjit Sing",
    duration: "--:--",
    cover: "resorce/tujhko-cocktail-2.jpg",
    src: "resorce/Tujhko Cocktail 2 .mp3",
    isFavourite: true,
    isRecent: true,
    playlist: "Lo-Fi Vibes"
  },
  {
    id: 2,
    title: "Yeh Awarapan Awarapan 2",
    artist: "Arjit Sing",
    duration: "--:--",
    cover: "resorce/yeh-awarapan-awarapan-2.jpg",
    src: "resorce/Yeh Awarapan Awarapan 2 .mp3",
    isFavourite: false,
    isRecent: true,
    playlist: "Workout Hits"
  },
  {
    id: 3,
    title: "Your-Power",
    artist: "Billie-Eilish",
    duration: "--:--",
    cover: "resorce/Your-Power-Billie-Eilish.jpg",
    src: "resorce/Your Power Billie Eilish .mp3",
    isFavourite: false,
    isRecent: false,
    playlist: "Lo-Fi Vibes"
  },
  {
    id: 4,
    title: "Udaarian",
    artist: "Satinder Sartaaj",
    duration: "--:--",
    cover: "resorce/udaariya.jpeg",
    src: "resorce/Udaarian (Badi lambi hai kahani mere pyaar di) - Satinder Sartaaj  Love Songs  New Punjabi Songs.mp3",
    isFavourite: true,
    isRecent: false,
    playlist: "Lo-Fi Vibes"
  }
];

let songs = [...initialSongs];
let currentSongIndex = 0;
let isPlaying = false;
let activeTab = "all";

// Player Mode States
let isShuffle = false;
let repeatMode = 0; // 0 = Off, 1 = Repeat All, 2 = Repeat One

// DOM Elements
const audio = document.getElementById("audio-element");
const songListContainer = document.getElementById("song-list");
const playlistChipsContainer = document.getElementById("playlist-chips");
const playlistSelect = document.getElementById("song-playlist-select");
const playPauseBtn = document.getElementById("play-pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const repeatBtn = document.getElementById("repeat-btn");

const progressBar = document.getElementById("progress-bar");
const volumeBar = document.getElementById("volume-bar");
const currentTimeEl = document.getElementById("current-time");
const durationTimeEl = document.getElementById("duration-time");
const currentTitle = document.getElementById("current-title");
const currentArtist = document.getElementById("current-artist");
const currentCover = document.getElementById("current-cover");
const mainHeartBtn = document.getElementById("main-heart-btn");

// Modals
const addSongBtn = document.getElementById("add-song-btn");
const addModal = document.getElementById("add-modal");
const closeModal = document.getElementById("close-modal");
const addSongForm = document.getElementById("add-song-form");
const addPlaylistBtn = document.getElementById("add-playlist-btn");
const playlistModal = document.getElementById("playlist-modal");
const closePlaylistModal = document.getElementById("close-playlist-modal");
const createPlaylistForm = document.getElementById("create-playlist-form");

// SHUFFLE & REPEAT CONTROLS
shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active-control", isShuffle);
});

repeatBtn.addEventListener("click", () => {
    repeatMode = (repeatMode + 1) % 3;

    if (repeatMode === 0) {
        repeatBtn.classList.remove("active-control");
        repeatBtn.removeAttribute("data-repeat");
        repeatBtn.innerHTML = `<i class="fa-solid fa-repeat"></i>`;
    } else if (repeatMode === 1) {
        repeatBtn.classList.add("active-control");
        repeatBtn.removeAttribute("data-repeat");
        repeatBtn.innerHTML = `<i class="fa-solid fa-repeat"></i>`;
    } else if (repeatMode === 2) {
        repeatBtn.classList.add("active-control");
        repeatBtn.setAttribute("data-repeat", "1");
        repeatBtn.innerHTML = `<i class="fa-solid fa-repeat"></i>`;
    }
});

function getNextSongIndex() {
    if (isShuffle && songs.length > 1) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === currentSongIndex);
    return randomIndex;
    }
    return (currentSongIndex + 1) % songs.length;
}

function getPrevSongIndex() {
    if (isShuffle && songs.length > 1) {
        let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === currentSongIndex);
    return randomIndex;
    }
    return (currentSongIndex - 1 + songs.length) % songs.length;
}

function calculateAudioDuration(song) {
    const tempAudio = new Audio();
    tempAudio.src = song.src;
    tempAudio.addEventListener("loadedmetadata", () => {
    if (tempAudio.duration && tempAudio.duration !== Infinity) {
        song.duration = formatTime(tempAudio.duration);
        renderSongList();
        }
    });
}

function preloadTrackDurations() {
    songs.forEach(song => {
        if (song.duration === "--:--") {
            calculateAudioDuration(song);
        }
    });
}

function renderPlaylists() {
    playlistChipsContainer.innerHTML = "";
    playlistSelect.innerHTML = `<option value="">None (All Songs Only)</option>`;

        playlists.forEach(pl => {
        const chip = document.createElement("div");
        chip.className = `playlist-chip ${PlaylistFilter === pl ? "active" : ""}`;
        chip.textContent = pl;
        chip.addEventListener("click", () => {
        PlaylistFilter = PlaylistFilter === pl ? null : pl;
        renderPlaylists();
        renderSongList();
    });
    playlistChipsContainer.appendChild(chip);

        const option = document.createElement("option");
        option.value = pl;
        option.textContent = pl;
        playlistSelect.appendChild(option);
    });
}

function renderSongList() {
    songListContainer.innerHTML = "";

    const filteredSongs = songs.filter(song => {
        if (PlaylistFilter && song.playlist !== PlaylistFilter) return false;
        if (activeTab === "favourite") return song.isFavourite;
        if (activeTab === "recent") return song.isRecent;
        return true;
    });

    if (filteredSongs.length === 0) {
        songListContainer.innerHTML = `<p style="color:var(--text-secondary); font-size:0.8rem; margin-top:10px;">No tracks found.</p>`;
        return;
    }

    filteredSongs.forEach((song) => {
        const originalIndex = songs.findIndex(s => s.id === song.id);
        const item = document.createElement("div");
        item.classList.add("song-item");
    if (originalIndex === currentSongIndex) item.classList.add("active");

    item.innerHTML = `
        <img src="${song.cover}" alt="cover" />
        <div class="song-item-info">
            <h4>${song.title}</h4>
            <p>${song.artist} ${song.playlist ? `• <i>${song.playlist}</i>` : ''}</p>
        </div>
        <div class="song-item-actions">
        <button class="heart-btn ${song.isFavourite ? 'active' : ''}" onclick="toggleFav(event, ${song.id})">
            <i class="${song.isFavourite ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
        <span>${song.duration}</span>
        </div>
    `;

    item.addEventListener("click", () => {
        loadSong(originalIndex);
        playSong();
    });

        songListContainer.appendChild(item);
    });
}

function loadSong(index) {
    currentSongIndex = index;
    const song = songs[currentSongIndex];

    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;
    currentCover.src = song.cover;
    audio.src = song.src;
    song.isRecent = true;

    updateHeartIcon();
    renderSongList();
}

audio.addEventListener("loadedmetadata", () => {
    durationTimeEl.textContent = formatTime(audio.duration);
    progressBar.max = audio.duration;

    if (songs[currentSongIndex] && songs[currentSongIndex].duration === "--:--") {
        songs[currentSongIndex].duration = formatTime(audio.duration);
        renderSongList();
    }
});

function playSong() {
    isPlaying = true;
    audio.play();
    playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
}

function pauseSong() {
    isPlaying = false;
    audio.pause();
    playPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
}

playPauseBtn.addEventListener("click", () => {
    isPlaying ? pauseSong() : playSong();
});

prevBtn.addEventListener("click", () => {
    currentSongIndex = getPrevSongIndex();
    loadSong(currentSongIndex);
    playSong();
});

nextBtn.addEventListener("click", () => {
    currentSongIndex = getNextSongIndex();
    loadSong(currentSongIndex);
    playSong();
});

audio.addEventListener("ended", () => {
    if (repeatMode === 2) {
        audio.currentTime = 0;
        playSong();
    } else if (repeatMode === 1 || currentSongIndex < songs.length - 1 || isShuffle) {
    currentSongIndex = getNextSongIndex();
        loadSong(currentSongIndex);
        playSong();
    } else {
        pauseSong();
    }
});

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        progressBar.value = audio.currentTime;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
});

progressBar.addEventListener("input", () => {
    audio.currentTime = progressBar.value;
});

volumeBar.addEventListener("input", (e) => {
    audio.volume = e.target.value;
});

// Tabs
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        const target = e.currentTarget;
        target.classList.add("active");
        activeTab = target.dataset.tab;
        renderSongList();
    });
});

function toggleFav(e, id) {
    e.stopPropagation();
    const targetSong = songs.find(s => s.id === id);
    if (targetSong) {
    targetSong.isFavourite = !targetSong.isFavourite;
    if (songs[currentSongIndex].id === id) {
        updateHeartIcon();
    }
    renderSongList();
    }
}

function updateHeartIcon() {
    const currentSong = songs[currentSongIndex];
    if (!currentSong) return;

    if (currentSong.isFavourite) {
    mainHeartBtn.innerHTML = `<i class="fa-solid fa-heart active-heart"></i>`;
    } else {
    mainHeartBtn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
    }
}

mainHeartBtn.addEventListener("click", () => {
    songs[currentSongIndex].isFavourite = !songs[currentSongIndex].isFavourite;
    updateHeartIcon();
    renderSongList();
});

// Modals
addSongBtn.addEventListener("click", () => addModal.style.display = "flex");
closeModal.addEventListener("click", () => addModal.style.display = "none");

addPlaylistBtn.addEventListener("click", () => playlistModal.style.display = "flex");
closePlaylistModal.addEventListener("click", () => playlistModal.style.display = "none");

createPlaylistForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const playlistName = document.getElementById("playlist-name-input").value.trim();
    if (playlistName && !playlists.includes(playlistName)) {
    playlists.push(playlistName);
    renderPlaylists();
    }
    createPlaylistForm.reset();
    playlistModal.style.display = "none";
});

addSongForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("song-title-input").value;
    const artist = document.getElementById("song-artist-input").value;
    const selectedPlaylist = document.getElementById("song-playlist-select").value;
    const audioFile = document.getElementById("song-file-input").files[0];
    const coverFile = document.getElementById("song-cover-input").files[0];


    if (!audioFile) return;
    const songUrl = URL.createObjectURL(audioFile);
    const coverUrl = coverFile 
    ? URL.createObjectURL(coverFile) 
    : "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80";

const newSong = {
    id: Date.now(),
    title: title,
    artist: artist,
    duration: "--:--",
    cover: coverUrl,
    src: songUrl,
    isFavourite: false,
    isRecent: true,
    playlist: selectedPlaylist || null
};

    calculateAudioDuration(newSong);
    songs.push(newSong);
    renderSongList();
    loadSong(songs.length - 1);
    playSong();
    addSongForm.reset();
    addModal.style.display = "none";
});

function formatTime(secs) {
    if (isNaN(secs) || secs === Infinity) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// Initial Launch
renderPlaylists();
preloadTrackDurations();
loadSong(0);