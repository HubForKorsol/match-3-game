Game.GameOver = function(game) {};

Game.GameOver.prototype = {
  create: function() {
    background = this.game.add.sprite(0, 0, "background");
    scoreSprite = this.game.add.sprite(375, -200, "score");
    textScore = this.game.add.text(475, -100, score, {
      font: "64px Fredoka One, cursive",
      fill: "#eeeeee",
      align: "center"
    });
    btnPlay = this.game.add.button(
      487,
      1000,
      "btn-play",
      actionOnCllick,
      this,
      2,
      1,
      0
    );
    this.game.add
      .tween(btnPlay)
      .to({ x: 487, y: 520 }, 500, Phaser.Easing.Linear.None, true);
    this.game.add
      .tween(scoreSprite)
      .to({ x: 375, y: 350 }, 500, Phaser.Easing.Linear.None, true);
    this.game.add
      .tween(textScore)
      .to({ x: 475, y: 405 }, 500, Phaser.Easing.Linear.None, true);
  },
  update: function() {
    if (btnPlay.clicked === true) {
      this.game.state.start("GameBoard");
    }
  }
};

function actionOnCllick() {
  btnPlay.clicked = true;
}