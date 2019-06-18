var GEM_SIZE = 100;
var GEM_SPACING = 0;
var GEM_SIZE_SPACED = GEM_SIZE + GEM_SPACING;
var BOARD_COLUMNS;
var BOARD_ROWS;
var MATCH_MIN = 3;
var BOARD_START_POS_X = 85;
var BOARD_START_POS_Y = 170;

var gems;
var selectedGem = null;
var selectedGemStartPos;
var selectedGemTween;
var tempShiftedGem = null;
var allowInput;
var game;
var score;
var setTime;
var gameStart;

Game.GameBoard = function(game) {};

Game.GameBoard.prototype = {
  create: function() {
    fxKill = game.add.audio("fx-kill", 0.3);

    setTime = 61;
    score = 0;
    gameStart = 10;
    game = this.game;
    background = this.game.add.sprite(0, 0, "background");

    spawnBoard();

    scoreSprite = this.game.add.sprite(750, 10, "score");
    this.game.time.events.loop(Phaser.Timer.SECOND, gameBegin, this);
    selectedGemStartPos = { x: 0, y: 0 };

    allowInput = false;

    game.input.addMoveCallback(slideGem, this);

    textTime = this.game.add.text(100, 70, "Time: ", {
      font: "80px Fredoka One, cursive",
      fill: "#d46866",
      align: "center"
    });
    textScore = this.game.add.text(850, 65, score, {
      font: "64px Fredoka One, cursive",
      fill: "#eaeaea",
      align: "center"
    });
    loadShadow = this.game.add.sprite(0, 0, "load-shadow");
    textBeginGame = this.game.add.text(600, 1100, gameStart, {
      font: "120px Fredoka One, cursive",
      fill: "#eeeeee",
      align: "center"
    });

    this.game.add
      .tween(textBeginGame)
      .to({ x: 600, y: 440 }, 400, Phaser.Easing.Linear.None, true);
    this.game.time.events.loop(Phaser.Timer.SECOND, gameTimer, this);
  },

  update: function() {
    if (setTime == 0) {
      gems.kill();
      this.game.add.sprite(407, 424, "time-up");
      scoreSprite.y -= 10;
      textScore.y -= 10;
      textTime.y -= 10;
      setTimeout(() => {
        this.game.state.start("GameOver");
      }, 1500);
    }
  }
};

function gameBegin() {
  if (gameStart > 0) {
    gameStart--;
    textBeginGame.setText(gameStart);
  } else {
    textBeginGame.kill();
    game.add
      .tween(loadShadow)
      .to({ x: 1280, y: 0 }, 400, Phaser.Easing.Linear.None, true);
  }
}

function gameTimer() {
  if (gameStart === 0) {
    setTime--;

    textTime.setText("Time: " + setTime);
  }
}

function spawnBoard() {
  BOARD_COLUMNS = Math.floor((game.world.width * 0.9) / GEM_SIZE_SPACED);
  BOARD_ROWS = Math.floor((game.world.height * 0.8) / GEM_SIZE_SPACED);

  gems = game.add.group();

  for (var i = 0; i < BOARD_COLUMNS; i++) {
    for (var j = 0; j < BOARD_ROWS; j++) {
      var gem = gems.create(
        i * GEM_SIZE_SPACED + BOARD_START_POS_X,
        j * GEM_SIZE_SPACED + BOARD_START_POS_Y,
        "gems"
      );
      gem.name = "gem" + i.toString() + "x" + j.toString();
      gem.inputEnabled = true;
      gem.events.onInputDown.add(selectGem, this);
      gem.events.onInputUp.add(releaseGem, this);
      randomizeGemColor(gem);
      setGemPos(gem, i, j);
      gem.kill();
    }
  }

  removeKilledGems();

  var dropGemDuration = dropGems();

  game.time.events.add(dropGemDuration * 100, refillBoard);

  allowInput = false;

  selectedGem = null;
  tempShiftedGem = null;
}

function releaseGem() {
  if (tempShiftedGem === null) {
    selectedGem = null;
    return;
  }

  var canKill = checkAndKillGemMatches(selectedGem);
  canKill = checkAndKillGemMatches(tempShiftedGem) || canKill;

  if (!canKill) {
    var gem = selectedGem;

    if (
      gem.posX !== selectedGemStartPos.x ||
      gem.posY !== selectedGemStartPos.y
    ) {
      if (selectedGemTween !== null) {
        game.tweens.remove(selectedGemTween);
      }

      selectedGemTween = tweenGemPos(
        gem,
        selectedGemStartPos.x,
        selectedGemStartPos.y
      );

      if (tempShiftedGem !== null) {
        tweenGemPos(tempShiftedGem, gem.posX, gem.posY);
      }

      swapGemPosition(gem, tempShiftedGem);

      tempShiftedGem = null;
    }
  }

  removeKilledGems();

  var dropGemDuration = dropGems();

  game.time.events.add(dropGemDuration * 100, refillBoard);

  allowInput = false;

  selectedGem = null;
  tempShiftedGem = null;
}
function slideGem(pointer, x, y) {
  if (gameStart === 0) {
    if (selectedGem && pointer.isDown) {
      var cursorGemPosX = getGemPosX(x);
      var cursorGemPosY = getGemPosY(y);

      if (
        checkIfGemCanBeMovedHere(
          selectedGemStartPos.x,
          selectedGemStartPos.y,
          cursorGemPosX,
          cursorGemPosY
        )
      ) {
        if (
          cursorGemPosX !== selectedGem.posX ||
          cursorGemPosY !== selectedGem.posY
        ) {
          if (selectedGemTween !== null) {
            game.tweens.remove(selectedGemTween);
          }

          selectedGemTween = tweenGemPos(
            selectedGem,
            cursorGemPosX,
            cursorGemPosY
          );

          gems.bringToTop(selectedGem);

          if (tempShiftedGem !== null) {
            tweenGemPos(tempShiftedGem, selectedGem.posX, selectedGem.posY);
            swapGemPosition(selectedGem, tempShiftedGem);
          }

          tempShiftedGem = getGem(cursorGemPosX, cursorGemPosY);

          if (tempShiftedGem === selectedGem) {
            tempShiftedGem = null;
          } else {
            tweenGemPos(tempShiftedGem, selectedGem.posX, selectedGem.posY);
            swapGemPosition(selectedGem, tempShiftedGem);
          }
        }
      }
    }
  }
}

function selectGem(gem) {
  if (allowInput) {
    selectedGem = gem;
    selectedGemStartPos.x = gem.posX;
    selectedGemStartPos.y = gem.posY;
  }
}

function getGem(posX, posY) {
  return gems.iterate("id", calcGemId(posX, posY), Phaser.Group.RETURN_CHILD);
}

function getGemPosX(coordinate) {
  return Math.floor((coordinate - BOARD_START_POS_X) / GEM_SIZE_SPACED);
}

function getGemPosY(coordinate) {
  return Math.floor((coordinate - BOARD_START_POS_Y) / GEM_SIZE_SPACED);
}

function setGemPos(gem, posX, posY) {
  gem.posX = posX;
  gem.posY = posY;
  gem.id = calcGemId(posX, posY);
}

function calcGemId(posX, posY) {
  return posX + posY * BOARD_COLUMNS;
}

function getGemColor(gem) {
  return gem.frame;
}

function randomizeGemColor(gem) {
  gem.frame = game.rnd.integerInRange(0, gem.animations.frameTotal - 1);
}

function checkIfGemCanBeMovedHere(fromPosX, fromPosY, toPosX, toPosY) {
  if (
    toPosX < 0 ||
    toPosX >= BOARD_COLUMNS ||
    toPosY < 0 ||
    toPosY >= BOARD_ROWS
  ) {
    return false;
  }

  if (fromPosX === toPosX && fromPosY >= toPosY - 1 && fromPosY <= toPosY + 1) {
    return true;
  }

  if (fromPosY === toPosY && fromPosX >= toPosX - 1 && fromPosX <= toPosX + 1) {
    return true;
  }

  return false;
}

function countSameColorGems(startGem, moveX, moveY) {
  var curX = startGem.posX + moveX;
  var curY = startGem.posY + moveY;
  var count = 0;

  while (
    curX >= 0 &&
    curY >= 0 &&
    curX < BOARD_COLUMNS &&
    curY < BOARD_ROWS &&
    getGemColor(getGem(curX, curY)) === getGemColor(startGem)
  ) {
    count++;
    curX += moveX;
    curY += moveY;
  }

  return count;
}

function swapGemPosition(gem1, gem2) {
  var tempPosX = gem1.posX;
  var tempPosY = gem1.posY;
  setGemPos(gem1, gem2.posX, gem2.posY);
  setGemPos(gem2, tempPosX, tempPosY);
}

function checkAndKillGemMatches(gem) {
  if (gem === null) {
    return;
  }

  var canKill = false;

  var countUp = countSameColorGems(gem, 0, -1);
  var countDown = countSameColorGems(gem, 0, 1);
  var countLeft = countSameColorGems(gem, -1, 0);
  var countRight = countSameColorGems(gem, 1, 0);

  var countHoriz = countLeft + countRight + 1;
  var countVert = countUp + countDown + 1;

  if (countVert >= MATCH_MIN) {
    killGemRange(gem.posX, gem.posY - countUp, gem.posX, gem.posY + countDown);
    canKill = true;

    scoreCalc(countVert);
  }

  if (countHoriz >= MATCH_MIN) {
    killGemRange(
      gem.posX - countLeft,
      gem.posY,
      gem.posX + countRight,
      gem.posY
    );
    canKill = true;
    scoreCalc(countHoriz);
  }
  return canKill;
}

function killGemRange(fromX, fromY, toX, toY) {
  fxKill.play();
  fromX = Phaser.Math.clamp(fromX, 0, BOARD_COLUMNS - 1);
  fromY = Phaser.Math.clamp(fromY, 0, BOARD_ROWS - 1);
  toX = Phaser.Math.clamp(toX, 0, BOARD_COLUMNS - 1);
  toY = Phaser.Math.clamp(toY, 0, BOARD_ROWS - 1);

  for (var i = fromX; i <= toX; i++) {
    for (var j = fromY; j <= toY; j++) {
      var gem = getGem(i, j);
      gem.kill();
    }
  }
}

function removeKilledGems() {
  gems.forEach(function(gem) {
    if (!gem.alive) {
      setGemPos(gem, -1, -1);
    }
  });
}

function tweenGemPos(gem, newPosX, newPosY, durationMultiplier) {
  if (
    durationMultiplier === null ||
    typeof durationMultiplier === "undefined"
  ) {
    durationMultiplier = 1;
  }
  return game.add.tween(gem).to(
    {
      x: newPosX * GEM_SIZE_SPACED + BOARD_START_POS_X,
      y: newPosY * GEM_SIZE_SPACED + BOARD_START_POS_Y
    },
    100 * durationMultiplier,
    Phaser.Easing.Linear.None,
    true
  );
}

function dropGems() {
  var dropRowCountMax = 0;

  for (var i = 0; i < BOARD_COLUMNS; i++) {
    var dropRowCount = 0;

    for (var j = BOARD_ROWS - 1; j >= 0; j--) {
      var gem = getGem(i, j);

      if (gem === null) {
        dropRowCount++;
      } else if (dropRowCount > 0) {
        gem.dirty = true;
        setGemPos(gem, gem.posX, gem.posY + dropRowCount);
        tweenGemPos(gem, gem.posX, gem.posY, dropRowCount);
      }
    }

    dropRowCountMax = Math.max(dropRowCount, dropRowCountMax);
  }
  return dropRowCountMax;
}

function refillBoard() {
  var maxGemsMissingFromCol = 0;

  for (var i = 0; i < BOARD_COLUMNS; i++) {
    var gemsMissingFromCol = 0;

    for (var j = BOARD_ROWS - 1; j >= 0; j--) {
      var gem = getGem(i, j);

      if (gem === null) {
        gemsMissingFromCol++;
        gem = gems.getFirstDead();
        gem.reset(
          i * GEM_SIZE_SPACED + BOARD_START_POS_X,
          -gemsMissingFromCol * GEM_SIZE_SPACED + BOARD_START_POS_Y
        );
        gem.dirty = true;
        randomizeGemColor(gem);
        setGemPos(gem, i, j);
        tweenGemPos(gem, gem.posX, gem.posY, gemsMissingFromCol * 2);
      }
    }

    maxGemsMissingFromCol = Math.max(maxGemsMissingFromCol, gemsMissingFromCol);
  }

  game.time.events.add(maxGemsMissingFromCol * 2 * 100, boardRefilled);
}

function boardRefilled() {
  var canKill = false;
  for (var i = 0; i < BOARD_COLUMNS; i++) {
    for (var j = BOARD_ROWS - 1; j >= 0; j--) {
      var gem = getGem(i, j);

      if (gem.dirty) {
        gem.dirty = false;
        canKill = checkAndKillGemMatches(gem) || canKill;
      }
    }
  }

  if (canKill) {
    removeKilledGems();
    var dropGemDuration = dropGems();
    game.time.events.add(dropGemDuration * 100, refillBoard);
    allowInput = false;
  } else {
    allowInput = true;
  }
}

function scoreCalc(killRange) {
  if (gameStart === 0) {
    score += killRange * 10;

    textScore.setText(score);
  }
}
