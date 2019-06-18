var Game = {};
Game.Boot = function(game) {}
Game.Boot.prototype = {
    preload: function(){

    },
    create: function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.canvas.id = 'phaser-game';
        this.game.state.start('Preload');
    },
}

