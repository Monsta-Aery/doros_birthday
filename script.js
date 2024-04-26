const NUM_CONFETTI = 350;
const COLORS = [[85, 71, 106], [174, 61, 99], [219, 56, 83], [244, 92, 68], [248, 182, 70]];
const PI_2 = 2 * Math.PI;

const resizeWindow = () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
};

const range = (a, b) => (b - a) * Math.random() + a;

const drawCircle = (x, y, r, style) => {
  context.beginPath();
  context.arc(x, y, r, 0, PI_2, false);
  context.fillStyle = style;
  context.fill();
};

document.onmousemove = (e) => {
  xpos = e.pageX / w;
};

const Confetti = class {
  constructor() {
    this.style = COLORS[~~range(0, 5)];
    this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
    this.r = ~~range(2, 6);
    this.r2 = 2 * this.r;
    this.replace();
  }

  replace() {
    this.opacity = 0;
    this.dop = 0.03 * range(1, 4);
    this.x = range(-this.r2, w - this.r2);
    this.y = range(-20, h - this.r2);
    this.xmax = w - this.r;
    this.ymax = h - this.r;
    this.vx = range(0, 2) + 8 * xpos - 5;
    this.vy = 0.7 * this.r + range(-1, 1);
  }

  draw() {
    this.x += this.vx;
    this.y += this.vy;
    this.opacity += this.dop;
    if (this.opacity > 1) {
      this.opacity = 1;
      this.dop *= -1;
    }
    if (this.opacity < 0 || this.y > this.ymax) {
      this.replace();
    }
    if (!(0 < this.x < this.xmax)) {
      this.x = (this.x + this.xmax) % this.xmax;
    }
    drawCircle(~~this.x, ~~this.y, this.r, `${this.rgb},${this.opacity})`);
  }
};

let confetti = [];
let w = 0;
let h = 0;
let xpos = 0.5;
let requestId;

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
canvas.id = "world";
document.body.appendChild(canvas);

const step = () => {
  requestId = requestAnimationFrame(step);
  context.clearRect(0, 0, w, h);
  confetti.forEach(c => c.draw());
};

// Cake Animation
const present = document.querySelector('.present');
const cake = document.querySelector('.cake');
const background = document.querySelector('.background');

present.onclick = function() {
  if (!confetti.length) {
    confetti = Array.from({ length: NUM_CONFETTI }, () => new Confetti());
    resizeWindow();
    step();
  }
  present.classList.toggle('open');
  cake.style.opacity = present.classList.contains('open') ? 1 : 0;
  if (present.classList.contains('open')) {
    background.classList.add('bright');
    startSnowfall();
  } else {
    background.classList.remove('bright');
    stopSnowfall();
  }
};

// Snowflake Animation
(function() {
  'use strict';

  var width, height, lastNow;
  var snowflakes;
  var maxSnowflakes = 100;
  var snowfallActive = false;
  var snowflakeRequestId;

  function init() {
    snowflakes = [];
    resize();
    render(lastNow = performance.now());
  }

  function render(now) {
    snowflakeRequestId = requestAnimationFrame(render);

    var elapsed = now - lastNow;
    lastNow = now;

    snowflakes.forEach(function(snowflake) {
      snowflake.update(elapsed, now);
    });
  }

  function pause() {
    cancelAnimationFrame(snowflakeRequestId);
  }

  function resume() {
    lastNow = performance.now();
    requestAnimationFrame(render);
  }

  function startSnowfall() {
    if (!snowfallActive) {
      snowfallActive = true;
      resume();
    }
  }

  function stopSnowfall() {
    if (snowfallActive) {
      snowfallActive = false;
      pause();
    }
  }

  function Snowflake() {
    this.spawn();
  }

  Snowflake.prototype.spawn = function(anyY) {
    this.x = rand(0, width);
    this.y = anyY === true ? rand(-50, height + 50) : rand(-50, -10);
    this.xVel = rand(-0.05, 0.05);
    this.yVel = rand(0.02, 0.1);
    this.angle = rand(0, Math.PI * 2);
    this.angleVel = rand(-0.001, 0.001);
    this.size = rand(7, 12);
    this.sizeOsc = rand(0.01, 0.5);
  };

  Snowflake.prototype.update = function(elapsed, now) {
    var xForce = rand(-0.001, 0.001);

    if (Math.abs(this.xVel + xForce) < 0.075) {
      this.xVel += xForce;
    }

    this.x += this.xVel * elapsed;
    this.y += this.yVel * elapsed;
    this.angle += this.xVel * 0.05 * elapsed;

    if (
      this.y - this.size > height ||
      this.x + this.size < 0 ||
      this.x - this.size > width
    ) {
      this.spawn();
    }

    this.render();
  };

  Snowflake.prototype.render = function() {
    context.save();
    var x = this.x,
      y = this.y,
      size = this.size;
    context.beginPath();
    context.arc(x, y, size * 0.2, 0, Math.PI * 2, false);
    context.fill();
    context.restore();
  };

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    maxSnowflakes = Math.max(width / 10, 100);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('blur', pause);
  window.addEventListener('focus', resume);
  init();
})();
