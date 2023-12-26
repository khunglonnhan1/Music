const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const repeatBtn = $(".btn-repeat");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const progress = $("#progress");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,

  songs: [
    {
      name: "Anh sẽ ổn thôi",
      singer: "Vương Anh Tú",
      path: "./assets/music/song1.mp3",
      image: "./assets/img/song1.jpg",
    },
    {
      name: "Bên anh đêm nay",
      singer: "Binz",
      path: "./assets/music/song2.mp3",
      image: "./assets/img/song2.jpg",
    },
    {
      name: "Chạm khẽ tim anh",
      singer: "Noo Phước Thịnh",
      path: "./assets/music/song3.mp3",
      image: "./assets/img/song3.jpg",
    },
    {
      name: "Phía sau em",
      singer: "Kay Trần",
      path: "./assets/music/song4.mp3",
      image: "./assets/img/song4.jpg",
    },
    {
      name: "Phía sau một cô gái",
      singer: "Soobin Hoàng Sơn",
      path: "./assets/music/song5.mp3",
      image: "./assets/img/song5.png",
    },
  ],

  render: function () {
    const htmls = this.songs.map(function (song, index) {
      return `
        <div class="song ${
          index === app.currentIndex ? "active" : ""
        }" data-index="${index}">
          <div class="thumb" 
          style = "background-image: url(${song.image})">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
        `;
    });

    playlist.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },

  handleEvents: function () {
    const cdWidth = cd.offsetWidth;

    // Animate rotate CD
    const cdRotate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    // CD rotate default animation
    cdRotate.pause();

    // Xử lí khi cuộn trang website
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lí khi người dùng click nút play
    playBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi bài hát play
    audio.onplay = function () {
      app.isPlaying = true;
      $(".player").classList.add("playing");
      cdRotate.play();
    };

    // Khi bài hát pause
    audio.onpause = function () {
      app.isPlaying = false;
      $(".player").classList.remove("playing");
      cdRotate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;
      }
    };

    // Xử lí khi audio được tua
    progress.onchange = function () {
      audio.currentTime = (progress.value / 100) * audio.duration;
    };

    // Xử lí khi repeat audio
    repeatBtn.onclick = function () {
      app.isRepeat = !app.isRepeat;
      repeatBtn.classList.toggle("active", app.isRepeat);
    };

    // Xử lí khi qua bài
    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.randomSong();
      } else {
        app.nextSong();
      }
      audio.play();
      app.render();
      app.scrollIntoView();
    };

    // Xử lí khi trước bài
    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.randomSong();
      } else {
        app.prevSong();
      }
      audio.play();
      app.render();
      app.scrollIntoView();
    };

    // Xử lí khi random
    randomBtn.onclick = function () {
      app.isRandom = !app.isRandom;
      randomBtn.classList.toggle("active", app.isRandom);
    };

    // Xử lí khi ended song
    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Xử lí khi click vào song
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          app.currentIndex = Number(songNode.dataset.index);
          app.loadCurrentSong();
          audio.play();
          app.render();
        }
      }
    };
  },

  scrollIntoView: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },

  nextSong: function () {
    app.currentIndex++;
    if (app.currentIndex >= app.songs.length) {
      app.currentIndex = 0;
    }
    app.loadCurrentSong();
  },

  prevSong: function () {
    app.currentIndex--;
    if (app.currentIndex < 0) {
      app.currentIndex = app.songs.length - 1;
    }
    app.loadCurrentSong();
  },

  randomSong: function () {
    let randomSongNumber;

    do {
      randomSongNumber = Math.floor(Math.random() * app.songs.length);
    } while (randomSongNumber === app.currentIndex);

    this.currentIndex = randomSongNumber;
    app.loadCurrentSong();
  },

  start: function () {
    // Xử lí các sự kiện
    this.handleEvents();

    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Load bài hát hiện tại
    this.loadCurrentSong();

    // Render playlist
    this.render();
  },
};

app.start();
