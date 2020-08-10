//selecting canvas element
let canvas2 = document.querySelector("#canvas2");

//setting canvas width and height
canvas2.width = document.documentElement.clientWidth;
canvas2.height = document.documentElement.clientHeight;

//geting context
const c2 = canvas2.getContext("2d");

//eventlistener for size change of window
window.addEventListener("resize", () => {
  //setting canvas width and height
  canvas2.width = document.documentElement.clientWidth;
  canvas2.height = document.documentElement.clientHeight;

  //regenerate circles
  init();
});

//mouse obj
const mouse = {
  x: undefined,
  y: undefined,
};
// eventlistener for mouse movement
window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

//max and min radius that a circle can grow to
const maxradius = 55;
//array of colors
const colorsArray = ["#3F8EBF", "#042F40", "#D90404", "#F2A20C", "#167362"];
//circle class with draw and move methods
class MovingCircles {
  constructor(x, y, r, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = r;
    this.minradius = r;
    this.color = colorsArray[Math.floor(5 * Math.random())];
    this.radian = 0;
    //distance from middle
    this.distMiddle = Math.hypot(
      Math.abs(this.x) - canvas2.width / 2,
      Math.abs(this.y) - canvas2.height / 2
    );
    //angular velocity
    this.omega = this.distMiddle * 0.0002 * Math.random();
    this.circularVelocity = false;
  }
  draw() {
    c2.beginPath();
    c2.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c2.fillStyle = this.color;
    c2.fill();
  }
  move() {
    if (this.circularVelocity) return this.circularMotion();
    if (this.x < this.r || this.x > canvas2.width - this.r) {
      this.x = this.x < this.r ? this.r : canvas2.width - this.r;
      this.vx *= -1;
    }
    if (this.y < this.r || this.y > canvas2.height - this.r) {
      this.y = this.y < this.r ? this.r : canvas2.height - this.r;
      this.vy *= -1;
    }
    this.x += this.vx;
    this.y += this.vy;

    //interection with mouse
    if (Math.abs(mouse.x - this.x) < 50 && Math.abs(mouse.y - this.y) < 50) {
      if (this.r < maxradius) {
        this.r++;
      }
    } else if (this.r > this.minradius) {
      this.r--;
    }

    this.draw();
  }

  circularMotion() {
    this.radian += this.omega;
    this.x = canvas2.width / 2 + Math.cos(this.radian) * this.distMiddle;
    this.y = canvas2.height / 2 + Math.sin(this.radian) * this.distMiddle;
    this.draw();
  }
}

//animate function for animation, circle array is used for objets
const animate = () => {
  requestAnimationFrame(animate);
  c2.clearRect(0, 0, canvas2.width, canvas2.height);

  circleArray.forEach((circle) => {
    circle.move(true);
  });
};

//creates array of circles
let circleArray;

//initialization
const init = () => {
  circleArray = [];
  for (
    let i = 0;
    i < Math.floor(canvas2.height * canvas2.width * 5 * Math.pow(10, -4));
    i++
  ) {
    let r = Math.random() * 5 + 10;
    let x = Math.random() * (canvas2.width - r) + r;
    let y = Math.random() * (canvas2.height - r) + r;
    let vx = (Math.random() < 0.5 ? 1 : -1) * Math.random() * 2 + 1;
    let vy = (Math.random() < 0.5 ? 1 : -1) * Math.random() * 2 + 1;
    circleArray.push(new MovingCircles(x, y, r, vx, vy));
  }
};

export const levelUp = () => {
  circleArray.forEach((circle) => {
    circle.circularVelocity = true;
  });
  setTimeout(init, 20000);
};

//calling animate function
export const backgroundAnimation = () => {
  init();
  animate();
  levelUp();
};
