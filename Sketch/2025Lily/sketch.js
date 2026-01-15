//Date: 2025-12-1
//Author: Yang Yaru
//Project Title: Lily

let poem = "O Lily, lily of the valley, fair and sweet, " +
  "Thy fragrance fills the air with summer's heat. " +
  "A symbol of purity and grace, " +
  "You bring a smile to every face.";

let lily;
let restartButton;
let T;

function preload() {
  T = loadImage("lily.jpg"); //Background image
}

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  textSize(15);

  lily = new Lily(poem, 10);

  // DOM button
  restartButton = createButton("Bloom again");
  restartButton.position(20, 20);
  restartButton.mousePressed(() => lily.resetBloom());
}

function draw() {
  background(255);

  // Background image
  image(T, 0, 0, width, height);

  translate(width / 2, height / 2);

  lily.update();
  lily.display();
}

class Lily {
  constructor(text, petalCount) {
    this.text = text;
    this.chars = text.split("");
    this.petalCount = petalCount;
    this.petals = [];
    this.bloomSpeed = 0.015;
    this.startFrame = frameCount;

    this.createPetals();
  }

  createPetals() {
    let perPetal = ceil(this.chars.length / this.petalCount);
    for (let p = 0; p < this.petalCount; p++) {
      let start = p * perPetal;
      let end = min(start + perPetal, this.chars.length);

      let subChars = this.chars.slice(start, end);
      let angle = map(p, 0, this.petalCount, 0, 360);

      let petal = new Petal(subChars, angle);
      this.petals.push(petal);
    }
  }

  resetBloom() {
    this.startFrame = frameCount;
  }

  update() {
    let t = (frameCount - this.startFrame) * this.bloomSpeed;
    this.bloom = constrain(t, 0, 1);
    this.bloom = 1 - pow(1 - this.bloom, 3); // easeOutCubic
  }

  display() {
    // line-Petals
    for (let petal of this.petals) {
      petal.displayPetalShape(this.bloom);
    }

    // circle-Flower stamen
    fill(255, 245, 232);
    ellipse(0, 0, 5, 5);

    // txt-Petals
    for (let petal of this.petals) {
      petal.displayText(this.bloom);
    }
  }
}

class Petal {
  constructor(chars, baseAngle) {
    this.chars = chars;
    this.baseAngle = baseAngle;
    this.maxLen = 210;
    this.step = 16;
    this.noiseSeed = random(1000);
  }
//The color of the petals Flower stamen
  displayPetalShape(bloom) {
    stroke(255, 170, 210);
    strokeWeight(1);
    noFill();

    beginShape();
    for (let r = 0; r <= this.maxLen * bloom; r += 6) {
      let bend = sin(map(r, 0, this.maxLen, 0, 120)) * 12;
      let a = this.baseAngle + bend;

      let n = noise(this.noiseSeed, r * 0.01, frameCount * 0.01);
      let wobble = map(n, 0, 1, -3, 3);

      let x = (r * 0.8) * cos(a) + wobble;
      let y = (r * 0.8) * sin(a) + wobble;
      vertex(x, y);
    }
    endShape();
  }

  // txt-Petals
  displayText(bloom) {
    fill(140, 50, 40, map(bloom, 0, 1, 0, 255));
    noStroke();

    for (let i = 0; i < this.chars.length; i++) {
      let ch = this.chars[i];
      let maxR = 40 + i * this.step;
      let r = maxR * bloom;

      let noiseVal = noise(this.noiseSeed + i * 0.2, frameCount * 0.01);
      let angleOffset = map(noiseVal, 0, 1, -8, 8);
      let a = this.baseAngle + angleOffset;

      let x = r * cos(a);
      let y = r * sin(a);

      push();
      translate(x, y);
      rotate(a + 90);
      text(ch, 0, 0);
      pop();
    }
  }
}