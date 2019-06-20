var game;
Game.Tutorial = function(game) {};

Game.Tutorial.prototype = {
  create: function() {
    game = this.game;
    background = this.game.add.sprite(0, 0, "background");
    btnSfx = this.game.add.button(1020,20, 'btn-sfx', sfxTogle, this, 2,1,0);
    
    textTutorialTitle = this.game.add.text(300, -200, "Tutorial", {
        font: "160px Fredoka One, cursive",
        fill: "#d46866",
        align: "center"
      });
    textfindDonuts = this.game.add.text(100, -200, "Find 3 and more identical donuts and swap them this way.", {
        font: "38px Fredoka One, cursive",
        fill: "#d46866",
        align: "center"
      });
    tutorialImgOne = this.game.add.sprite(180, -400, "tutorial-img-1");
    tutorialImgTwo = this.game.add.sprite(690, -400, "tutorial-img-2");

    textTutorial = this.game.add.text(120, -300, 
      "When 3 or more identical donuts line up in one line, they are removing and each one brings you 10 points. Remove as many donuts as possible for the allotted time."
      ,{
      font: "38px Fredoka One, cursive",
      fill: "#c15d5c",
      align: "center",
      wordWrap: true,
      wordWrapWidth: "1050"
      });
    btnBack = this.game.add.button(490,-300, 'btn-back', moveToStartMenu, this, 2,1,0);

  this.game.add
    .tween(textTutorialTitle)
    .to({ x: 300, y: 30 }, 800, Phaser.Easing.Linear.None, true);
  this.game.add
    .tween(textfindDonuts)
    .to({ x: 100, y: 210 }, 700, Phaser.Easing.Linear.None, true);
  this.game.add
    .tween(tutorialImgOne)
    .to({ x: 180, y: 280 }, 600, Phaser.Easing.Linear.None, true);
  this.game.add
    .tween(tutorialImgTwo)
    .to({ x: 690, y: 280 }, 600, Phaser.Easing.Linear.None, true);
  this.game.add
    .tween(textTutorial)
    .to({ x: 120, y: 600 }, 500, Phaser.Easing.Linear.None, true);
  this.game.add
    .tween(btnBack)
    .to({ x: 490, y: 760 }, 400, Phaser.Easing.Linear.None, true);

  },
  update: function() {
    if (btnBack.clicked === true) {
      textTutorialTitle.y -= 25;
      textfindDonuts.y -= 25;
      tutorialImgOne.y -= 25;
      textTutorial.y -=25;
      tutorialImgTwo.y -= 25;
      btnBack.y += 25;
      setTimeout(() => {
        Sfx.destroy();
        
         this.game.state.start("StartMenu");

      }, 800);
    }
  }
};

function moveToStartMenu() {
  btnBack.clicked = true;
}

function sfxTogle(){
  if (!this.game.sound.mute){
    this.game.sound.mute = true;
  }else{
    this.game.sound.mute = false;    
  }
}
