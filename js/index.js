function Dot(t, i) {
  this.ctx = t,
    this.config = i,
    this.init()
}
function Slider(t, i) {
  this.container = t,
    this.options = i,
    this.init()
}

var detail = {
  $starry: document.querySelector(".starry"),
  $stars: document.querySelectorAll(".starry_stars .star"),
  $dt: document.querySelector(".detail"),
  $dtTxtMain: document.querySelector(".detail_main"),
  $dtTxtItems: document.querySelectorAll(".detail_item"),
  $dtMenu: document.querySelector(".detail_menu"),
  $dtMenuItems: document.querySelectorAll(".detail_menu .item"),
  $dtCloses: document.querySelectorAll(".detail_close"),
  $bg: document.querySelector(".bg"),
  len: 6,
  dthide: !0,
  first: !0,
  init: function () {
    this.starTouch(),
      this.detailMenuTouch(),
      this.detailClose()
  },
  starTouch: function () {
    for (var t, i = this, e = 0; e < i.len; e++)
      i.$stars[e].addEventListener("touchstart", function () {
        t = this.dataset.id - 1,
          i.detailShow(t)
      })
  },
  detailMenuTouch: function () {
    for (var t, i = this, e = 0; e < i.len; e++)
      i.$dtMenuItems[e].addEventListener("touchstart", function () {
        t = this.dataset.id - 1,
          i.dthide ? i.detailShow(t) : i.detailSlider(t)
      })
  },
  detailClose: function () {
    for (var t, i = this, e = 0; e < i.len; e++)
      i.$dtCloses[e].addEventListener("touchstart", function () {
        t = this.dataset.id - 1,
          i.detailHide(t)
      })
  },
  detailShow: function (t) {
    var i = this;
    i.$starry.className = "starry off",
      track.animateOut(),
      i.$bg.className = "bg on",
      i.$dt.className = "detail detail" + (t + 1) + " on",
      i.$dtMenu.className = "detail_menu detail_menu" + (t + 1),
      i.$dtTxtMain.style.webkitTransform = "translate3d(-" + 12.9186 * t + "rem,0,0)",
      setTimeout(function () {
        i.$dtTxtMain.style.webkitTransition = "all 1s"
      }, 0),
      i.detailClassAdd(t),
      i.$dtTxtItems[t].classList.add("act"),
      i.detailSlider(t),
      i.dthide = !1,
      i.slider.play(),
      pageslider.pause()
  },
  detailHide: function (t) {
    var i = this;
    i.dthide = !0,
      i.$starry.className = "starry on",
      track.animateIn(),
      i.$bg.className = "bg off",
      i.$dt.className = "detail off",
      i.$dtMenu.className = "detail_menu",
      i.$dtTxtMain.style.webkitTransition = "none",
      i.detailClassAdd(t),
      i.slider.pause(),
      pageslider.play()
  },
  detailClassAdd: function (t) {
    for (var i = this, e = function () {
      this.classList.remove("pre"),
        this.classList.remove("cur"),
        this.classList.remove("next")
    }
           , s = 0; s < i.len; s++)
      i.$dtTxtItems[s].addEventListener("webkitAnimationEnd", e);
    i.$dtTxtItems[t].classList.add("cur"),
      0 == t ? i.$dtTxtItems[t + 1].classList.add("next") : t == i.len - 1 ? i.$dtTxtItems[t - 1].classList.add("pre") : (i.$dtTxtItems[t - 1].classList.add("pre"),
        i.$dtTxtItems[t + 1].classList.add("next"))
  },
  detailSlider: function (t) {
    var i = this;
    detail.slider ? detail.slider.slide(t) : detail.slider = new Slider(document.querySelector(".detail_main"), {
      direction: "x",
      cur: t,
      onSlide: function () {
        i.$dt.className = "detail detail" + (this.current + 1) + " on",
          i.$dtMenu.className = "detail_menu detail_menu" + (this.current + 1);
        for (var t = function () {
          this.classList.remove("move")
        }
               , e = 0; e < i.len; e++)
          i.$dtTxtItems[e].classList.remove("act"),
          i.dthide && !i.first || i.$dtTxtItems[e].classList.add("move"),
            i.$dtTxtItems[e].addEventListener("webkitAnimationEnd", t);
        i.first = !1,
          i.$dtTxtItems[this.current].classList.add("act"),
          i.$dtTxtMain.style.webkitTransform = "translate3d(-" + 12.9186 * this.current + "rem,0,0)",
          setTimeout(function () {
            i.$dtTxtMain.style.webkitTransition = "all 1s"
          }, 0)
      }
    })
  }
};
Dot.prototype = {
  init: function () {
    var t = this.config;
    this._x = this.x = t.x,
      this._y = this.y = t.y,
      this.rad = t.rad,
      this.parent = t.parent
  },
  draw: function () {
    var t = this.ctx
      , i = this.config;
    t.save(),
      t.globalAlpha = this.parent.opacity,
      t.fillStyle = i.color || "rgba(255, 255, 255, 1)",
      t.beginPath(),
      t.arc(this.x, this.y, i.r, 0, 2 * Math.PI, !1),
      t.closePath(),
      t.fill(),
      t.restore()
  }
};
var Circle = function (t, i) {
    this.ctx = t,
      this.config = i,
      this.init()
  }
;
Circle.prototype = {
  init: function () {
    this._r = this.config.r,
      this.r = 0,
      this.rotation = 0,
      this.opacity = 0,
      this.createDots()
  },
  animateIn: function () {
    var t = this;
    TweenLite.to(t, .3, {
      delay: .5,
      r: this._r,
      opacity: .7,
      rotation: -40,
      onCompleteScope: t,
      onUpdate: function () {
        t.update(.005)
      },
      onComplete: function () {
        t.explode()
      }
    })
  },
  animateOut: function (t) {
    var i = this;
    TweenLite.to(i, .5, {
      r: 0,
      opacity: .3,
      rotation: 40,
      onStart: i.stop,
      callbackScope: i,
      onUpdate: function () {
        i.update(.005)
      },
      ease: Linear.easeNone
    })
  },
  stop: function () {
    for (var t = this.dots, i = t.length, e = 0; e < i; e++) {
      var s = t[e];
      TweenLite.killTweensOf(s)
    }
  },
  explode: function () {
    var t = this;
    this.obj;
    TweenLite.to(t, 1, {
      r: t._r + 10,
      onComplete: function () {
        t.implode()
      },
      onUpdate: function () {
        t.update()
      }
    })
  },
  implode: function () {
    var t = this;
    this.obj;
    TweenLite.to(t, 1, {
      r: t._r - 10,
      onComplete: function () {
        t.explode()
      },
      onUpdate: function () {
        t.update()
      }
    })
  },
  update: function (t) {
    for (var t = isNaN(t) ? .05 : t, i = this.dots, e = this.config.origin, s = this.r, n = 0, a = i.length; n < a; n++) {
      var o = i[n]
        , r = o.rad + this.rotation * Math.PI / 180;
      TweenLite.to(o, 1, {
        delay: n * t,
        x: Math.round(e.x + s * Math.cos(r)),
        y: Math.round(e.y + s * Math.sin(r)),
        onUpdateScope: o
      })
    }
  },
  reDraw: function () {
    for (var t = this.dots, i = 0, e = t.length; i < e; i++)
      t[i].draw()
  },
  createDots: function () {
    var t, i, e, s = this.config, n = this.config.origin, a = s.count, o = this.r;
    this.dots = [];
    for (var r = 0; r < a; r++) {
      e = 2 * r * Math.PI / a + this.rotation * Math.PI / 180,
        t = Math.round(n.x + o * Math.cos(e)),
        i = Math.round(n.y + o * Math.sin(e));
      var c = new Dot(this.ctx, {
        x: t,
        y: i,
        rad: e,
        r: 1.5,
        parent: this,
        color: "#4d4e72"
      });
      this.dots.push(c)
    }
  }
};
var track = {
  count: 3,
  circles: [],
  init: function () {
    var t, i = document.documentElement.clientWidth, e = document.documentElement.clientHeight,
      s = document.querySelector("#canvas");
    s.width = i,
      s.height = e,
      this.ctx = t = s.getContext("2d"),
      this.stage = s,
      this.inited = !0;
    if (this.circles.length == 0) {
      for (var n = 1, a = this.count; n <= a; n++) {
        var o = new Circle(t, {
          origin: {
            x: i / 2,
            y: e / 2
          },
          r: 70 * n,
          count: 12 * n
        });
        this.circles.push(o)
      }
    }
    this.animateIn()
  },
  animateIn: function () {
    var t = this.circles
      , i = this;
    this.isPlaying = !0;
    for (var e = 0, s = this.circles.length; e < s; e++)
      t[e].animateIn();
    TweenLite.ticker.addEventListener("tick", this.tick = function () {
        i.update()
      }
    )
  },
  animateOut: function () {
    var t = this.circles;
    this.isPlaying = !1;
    for (var i = 0, e = this.circles.length; i < e; i++)
      t[i].animateOut()
  },
  update: function () {
    this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);
    for (var t = 0, i = this.circles.length; t < i; t++)
      this.circles[t].reDraw()
  }
};

var AudioPlayer = function () {
}, AP = {
  conf: {},
  extend: function (t, i) {
    var t = t
      , i = i;
    for (var e in i)
      t[e] = i[e];
    return t
  },
  PAUSED: 0,
  PLAYING: 1,
  construct: function (t) {
    this.conf = this.extend({
      src: null,
      loop: "loop",
      type: "audio/mpeg",
      autoplay: !0,
      preload: !0
    }, t),
      this.init()
  },
  init: function () {
    var t = this.conf;
    this.audio || (this.audio = new Audio);
    for (key in t)
      this.audio[key] = t[key];
    this.audio.autoplay ? this.status = this.PLAYING : (this.status = this.PAUSED,
      this.paused())
  },
  togglePlay: function () {
    this.status === this.PLAYING ? this.paused() : this.play()
  },
  play: function () {
    this.status = this.PLAYING,
    this.audio && this.audio.pause(),
    this.audio && this.audio.play()
  },
  paused: function () {
    this.status = this.PAUSED,
    this.audio && this.audio.pause()
  },
  stop: function () {
    this.status = this.PAUSED,
      this.audio.currentTime = 0,
      this.paused()
  },
  setSrc: function (t, i) {
    this.audio && (this.stop(),
      this.audio.src = t,
    i && (this.audio.type = i))
  },
  getStatus: function () {
    return this.status
  },
  destroy: function () {
    this.audio.pause(),
      this.audio = null
  }
};
var isPlay=false;
for (var key in AP)
  AudioPlayer.prototype[key] = AP[key];
var bgm = new AudioPlayer;
bgm.construct({
  src: "images/music.mp3",
  autoplay: !0
});
var music = {
  music: document.querySelector(".music"),
  musicOn: "music",
  musicOff: "music music_off",
  init: function () {
    var t = this;
    t.musicToggle(),
      t.music.addEventListener("touchstart", function () {
        bgm.togglePlay(),
          t.musicToggle()
      })
  },
  musicToggle: function () {
    var t = bgm.getStatus()
      , i = this;
    t ? i.music.setAttribute("class", i.musicOn) : i.music.setAttribute("class", i.musicOff)
  }
};
music.init();
document.body.addEventListener("touchstart",bodyPlay)
function bodyPlay() {
  if(!isPlay){
    bgm.play()
    isPlay=true;
  }else{
    document.body.removeEventListener("touchstart",bodyPlay)
  }
}