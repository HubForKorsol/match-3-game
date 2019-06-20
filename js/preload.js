Game.Preload = function(game) {};

Game.Preload.prototype = {
  preload: function() {
    this.load.image("background", "img/background.jpg");
    this.load.image("big-shadow", "img/big-shadow.png");
    this.load.image("donut", "img/donut.png");
    this.load.image("donut-logo", "img/donuts_logo.png");
    this.load.image("btn-play", "img/btn-play.png");
    this.load.image("btn-sfx", "img/btn-sfx.png");
    this.load.image("time-up", "img/text-timeup.png");
    this.load.image("load-shadow", "img/load-shadow.png");
    this.load.image("tutorial-btn", "img/btn-tutorial.png");
    this.load.image("tutorial-img-1", "img/tutorial-img-1.png");
    this.load.image("tutorial-img-2", "img/tutorial-img-2.png");
    this.load.image("btn-back", "img/btn-back.png");
    this.load.spritesheet("particle-1", "img/particle-1.png", 72, 72);
    this.load.spritesheet("gems", "img/gem-sprite-1.png", 100, 100);
    this.load.image("score", "img/bg-score.png");
    this.load.audio("fx-background", "audio/background.mp3");
    this.load.audio("fx-kill", "audio/kill.mp3");
    this.load.audio("select-1", "audio/select-1.mp3");
  },
  create: function() {
    this.game.state.start("StartMenu");
  }
};
