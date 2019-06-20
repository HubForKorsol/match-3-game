var game;
var Sfx;
Game.StartMenu = function(game) {};
Game.StartMenu.prototype = {

  preload: function(){
    Sfx = this.game.add.audio('fx-background', 0.4, true);
  },
  create: function() {
    game = this.game;
    background = this.game.add.sprite(0, 0, "background");
    bigShadow = this.game.add.sprite(320, -1000, "big-shadow");
    donut = this.game.add.sprite(320, -1000, "donut");
    donutLogo = this.game.add.sprite(320, -1000, "donut-logo");
    btnPlay = this.game.add.button(
      470,
      -1000,
      "btn-play",
      moveToGameBoard,
      this,
      2,
      1,
      0
    );
    btnSfx = this.game.add.button(1020,20, 'btn-sfx', sfxTogle, this, 2,1,0);
    tutorialBtn = this.game.add.button(1020,200, "tutorial-btn", moveToTutorial, this, 2,1,0);
    
    Sfx.play();
    this.game.add
      .tween(donut)
      .to({ x: 349, y: 328 }, 800, Phaser.Easing.Linear.None, true);
    this.game.add
      .tween(bigShadow)
      .to({ x: 330, y: 320 }, 800, Phaser.Easing.Linear.None, true);
    this.game.add
      .tween(donutLogo)
      .to({ x: 337, y: 80 }, 800, Phaser.Easing.Linear.None, true);
    this.game.add
      .tween(btnPlay)
      .to({ x: 497, y: 520 }, 800, Phaser.Easing.Linear.None, true);
  },
  update: function() {
    if (btnPlay.clicked === true) {
      donutLogo.y -= 25;
      donut.y += 25;
      bigShadow.y += 25;
      setTimeout(() => {
        this.game.state.start("GameBoard");
      }, 500);
    }else if(tutorialBtn.clicked === true){
      donutLogo.y -= 25;
      donut.y += 25;
      bigShadow.y += 25;
      setTimeout(() => {
        this.game.state.start("Tutorial");
      }, 500);      
    }
  }
};

function moveToGameBoard() {
  btnPlay.clicked = true;
}
function moveToTutorial() {
  tutorialBtn.clicked = true;  
}

function sfxTogle(){
  if (!this.game.sound.mute){
    this.game.sound.mute = true;
  }else{
    this.game.sound.mute = false;    
  }
}