// 各行取得処理
window.renderRows = function (rows) {
  const root = document.getElementById("rows-root");
  root.innerHTML = "";

  rows.forEach(row => {
    const section = document.createElement("section");
    section.className = "video-row";

    const h2 = document.createElement("h2");
    h2.innerHTML = `${row.title} <span>${row.artist}</span>`;

    const list = document.createElement("div");
    list.className = "video-list";

    row.videos.forEach(video => {
      const btn = document.createElement("button");
      btn.className = "thumb";
      btn.type = "button";
      btn.dataset.videoId = video.id;

      const img = document.createElement("img");
      img.src = video.thumb;

      btn.appendChild(img);
      list.appendChild(btn);
    });

    section.appendChild(h2);
    section.appendChild(list);
    root.appendChild(section);
  });
};

// 各行呼び出し
window.loadRows = async function (url) {
  const res = await fetch(url);
  const data = await res.json();
  renderRows(data.rows);
};


// 共通：サムネクリック初期化
window.initThumbnailPlayer = function ({
  heroPlayerId = "heroPlayer",
  scrollTop = true,
  storageKey = "lastVideo"
} = {}) {

  const heroPlayer = document.getElementById(heroPlayerId);
  if (!heroPlayer) return;

  // ⭐ 初期動画復元をここでやる
  if (storageKey) {
    const lastVideo = localStorage.getItem(storageKey);
    if (lastVideo) {
      heroPlayer.src = `https://www.youtube.com/embed/${lastVideo}`;
    }
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".thumb");
    if (!btn) return;

    e.preventDefault();

    const videoId = btn.dataset.videoId;
    if (!videoId) return;

    // 保存
    if (storageKey) {
      localStorage.setItem(storageKey, videoId);
    }

    // active 切替
    document.querySelectorAll(".thumb.active")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // スクロール
    if (scrollTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // 再生
    heroPlayer.src = `https://www.youtube.com/embed/${videoId}`;
  });
};

// スクロールコントロール
window.initHorizontalScrollSpeed = function ({
  selector = ".video-list",
  speed = 1.2
} = {}) {

  document.querySelectorAll(selector).forEach(list => {
    list.addEventListener("wheel", (e) => {
      // 縦スクロールを横に変換
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      e.preventDefault();
      list.scrollLeft += e.deltaY * speed;
    }, { passive: false });
  });
};