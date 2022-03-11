var UIS;
class numberRPG extends Phaser.Scene {
  constructor() {
    super("numberRPG");
  }
  preload() {


  }
  create() {
    numberRPGData = JSON.parse(localStorage.getItem('rpgData'));

    if (numberRPGData === null || numberRPGData.length <= 0) {
      localStorage.setItem('rpgData',
        JSON.stringify(defaultNumberRPGData));
      numberRPGData = defaultNumberRPGData;
    }
    this.rows = 10
    this.cols = 10
    this.range = 10;
    this.currentRoll = 0;
    this.directions = [{ r: 0, c: 1 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: -1, c: 0 }];
    this.hasArrow = false;
    this.colors = {
      bg: 0x000000,
      tileEmpty: 0x7f8c8d,
      tileNormal: 0x16a085,
      tileUpgrade: 0xe74c3c,
      tileX: 0xff914d,
      tileTree: 0x07bc07,
      tileEnemy1: 0xa70204,
      tileEnemy2: 0xc10306,
      tileEnemy3: 0xe00408,
      tileEnemy4: 0xf9060a,
      tileWall: 0xbeacad,
      tilePotion: 0x80b8cc,
      tileSword: 0xe0e0e0,
      tileShield: 0x987302,
      tileArrow: 0xd0b666,
      tileKey: 0xf48834,
      tileHealth: 0x16a085,
      tileCoin: 0xf2e711,
      uiText: 0xecf0f1,
      tileWizard: 0xffffff
    }
    UIS = this.scene.get('UI');

    this.cameras.main.fadeIn(800, 0, 0, 0);
    this.cameras.main.setBackgroundColor(this.colors.bg);
    this.cameras.main.setBounds(0, 0, this.xOffset + this.cols * (this.tileSize + 15) + this.tileSize / 2, this.yOffset + this.rows * (this.tileSize + 15) + this.tileSize / 2);
    this.cameras.main.setZoom(.5)
    //var title = this.add.bitmapText(50, 50, 'topaz', 'L: 1', 100).setOrigin(0,.5).setTint(0xc76210);
    this.tileSize = 150;
    this.xOffset = (game.config.width - (5 * (this.tileSize + 15) + this.tileSize / 2)) / 2;

    this.yOffset = 450;

    //roller
    this.nextSlot = this.add.image(this.xOffset + 2 * (this.tileSize + 15) + this.tileSize / 2, 250, 'blankoutline').setInteractive().setTint(0x16a085).setScrollFactor(0).setDepth(2);
    this.nextSlot.value = 5;
    this.nextSlot.displayWidth = 140;
    this.nextSlot.displayHeight = 140;
    this.nextNum = this.add.bitmapText(this.xOffset + 2 * (this.tileSize + 15) + this.tileSize / 2, 250, 'topaz', '0', 100).setOrigin(.5).setTint(0x16a085).setScrollFactor(0).setDepth(2);

    this.nextSlot2 = this.add.image(this.xOffset + 3 * (this.tileSize + 15) + this.tileSize / 2, 250, 'blankoutline').setInteractive().setTint(0x7f8c8d).setScrollFactor(0).setDepth(2);
    this.nextSlot2.displayWidth = 100;
    this.nextSlot2.displayHeight = 100;
    this.nextNum2 = this.add.bitmapText(this.xOffset + 3 * (this.tileSize + 15) + this.tileSize / 2, 250, 'topaz', 'R', 70).setOrigin(.5).setTint(0x7f8c8d).setScrollFactor(0).setDepth(2);
    this.nextSlot2.on('pointerdown', function() {
      this.nextSlot2.setTint(0xecf0f1)
      this.nextNum2.setTint(0xecf0f1)
      //this.removeX1.disableInteractive();

      var tween = this.tweens.add({
        targets: [this.nextSlot2, this.nextNum2],
        scale: .4,
        duration: 100,
        yoyo: true,

      })
      this.roll()
    }, this)




    //create deck of "cards"
    this.makeDeck();

    //create game board and player
    this.createGrid();
   
    //invisiable object that moves with player for the camerea to follow
    this.playerSprite = this.add.image(0, 0, 'blankoutline').setVisible(false);
    this.cameras.main.startFollow(this.playerSprite, true, .1, .1);
    var ps = this.getEmptySpace()
    this.player = new Player(this, ps)
    
    this.player.addPlayer();

    //add objects to the game board
    this.addTiles(5);

    //this.shape = this.add.image(200, 200, 'blank').setVisible(false);
    //this.mask = new Phaser.Display.Masks.BitmapMask(this, this.shape);



    //pop up collectable text
    this.popUpText = this.add.bitmapText(-50, -50, 'topaz', '', 60).setOrigin(.5).setTint(0xecf0f1).setAlpha(0);

    UIS.events.on('wallSpell', this.cast, this);

    this.input.on('pointerup', this.endSwipe, this)
  }
  update() {
    this.playerSprite.setPosition(this.xOffset + this.player.location.c * (this.tileSize + 15) + this.tileSize / 2, this.yOffset + this.player.location.r * (this.tileSize + 15) + this.tileSize / 2)

  }
  nextLevel() {
    this.player.removePlayer();
    //clear board
    this.clearGrid()
    this.makeDeck();
    this.growMountains(9)
    this.growMountains(7)
    this.addTiles(6);
    //shuffle deck
    //add tiles
  }
  roll() {

    var num = Phaser.Math.Between(4, this.range)
    //this.moveEnemies(num)
    this.currentRoll = num;
    this.tweens.add({
      targets: [this.nextSlot, this.nextNum],
      angle: 360,
      yoyo: true,
      duration: 500,
      onCompleteScope: this,
      onComplete: function() {
        this.nextNum.setText(num)
      }
    })
  }
  updateStats() {
    this.events.emit('updateStats')
  }
  addNumberPopUp(x, y, text) {
    this.popUpText.setText('+' + text);
    this.popUpText.setPosition(x, y);
    this.popUpText.setAlpha(1);
    var tween = this.tweens.add({
      targets: this.popUpText,
      y: '-=500',
      alpha: 0,
      duration: 1000
    })
  }
  cast() {
    this.tweens.add({
      targets: this.grid[this.player.location.r][this.player.location.c].tileSprite,
      angle: 360,
      yoyo: true,
      duration: 500,
      onCompleteScope: this,
      onComplete: function() {
        this.wallSpell();
      }
    })
  }
  wallSpell() {
    //var tileUp = this.grid[this.player.location.r - 1][this.player.location.c]

    // var tileDown = this.grid[this.player.location.r + 1][this.player.location.c]
    // var tileLeft = this.grid[this.player.location.r][this.player.location.c - 1]
    // var tileRight = this.grid[this.player.location.r][this.player.location.c + 1]
    var neighbors = this.getValid4neighbors();
    for (var n = 0; n < neighbors.length; n++) {
      if (this.grid[neighbors[n].r][neighbors[n].c].name == 'Wall') {
        var tile = this.grid[neighbors[n].r][neighbors[n].c];
        /* this.tweens.add({
           targets: [tile.tileSprite, tile.tileText],
           scale: 2,
           duration: 100,
           yoyo: true,
           onYoyoScope: this,
           onYoyo: function() {*/
        tile.name = '';
        tile.isEmpty = true
        tile.tileValue = 0;
        tile.tileText.setText('');
        tile.tileBack.setAlpha(0);
        tile.tileText.setTint(this.colors.tileEmpty);
        tile.tileSprite.setTint(this.colors.tileEmpty);

        /*   }
         })*/


      }
    }

  }
  
  removeTile(row, col) {
    var tile = this.grid[row][col]
    tile.tileText
  }

 

  removeTile(row, col) {

    this.grid[row][col].tileValue = 0;
    this.grid[row][col].tileText.setText('')
    this.grid[row][col].tileText.setTint(this.colors.tileNormal)
    this.grid[row][col].tileSprite.setTint(this.colors.tileEmpty)
    this.grid[row][col].tileBack.setAlpha(0)
    this.grid[row][col].isEmpty = true;
    this.grid[row][col].name = '';
    this.grid[row][col].strength = 0;
    this.t
  }
  growMountains(times) {
    var start = this.getEmptySpace();
    console.log(start)
    for (var m = 0; m < times; m++) {
      var neighbors = this.getEmptyNeighbors(start)
      if (neighbors.length > 0) {
        var rand = Phaser.Math.Between(0, neighbors.length - 1)
        //to tile
        this.grid[neighbors[rand].r][neighbors[rand].c].tileValue = 0
        this.grid[neighbors[rand].r][neighbors[rand].c].backFrame = 128
        this.grid[neighbors[rand].r][neighbors[rand].c].tileText.setText('')
        //this.grid[neighbors[rand].r][neighbors[rand].c].tileText.s
        this.grid[neighbors[rand].r][neighbors[rand].c].tileSprite.setTint(this.colors.tileWall)

        this.grid[neighbors[rand].r][neighbors[rand].c].tileBack.setFrame(128).setAlpha(1)
        this.grid[neighbors[rand].r][neighbors[rand].c].isEmpty = false;
        this.grid[neighbors[rand].r][neighbors[rand].c].name = 'Wall'
        this.grid[neighbors[rand].r][neighbors[rand].c].strength = 0

        //this.removeTile(enemies[i].r, enemies[i].c)
        start = { r: neighbors[rand].r, c: neighbors[rand].c }
      }
    }
  }
  moveEnemies(times) {
    for (var m = 0; m < times; m++) {
      var enemies = this.findEnemies();
      if (enemies.length == 0) { return }
      for (var i = 0; i < enemies.length; i++) {
        var neighbors = this.getEmptyNeighbors(enemies[i])
        if (neighbors.length > 0) {
          var rand = Phaser.Math.Between(0, neighbors.length - 1)
          //to tile
          this.grid[neighbors[rand].r][neighbors[rand].c].tileValue = this.grid[enemies[i].r][enemies[i].c].tileValue
          this.grid[neighbors[rand].r][neighbors[rand].c].backFrame = this.grid[enemies[i].r][enemies[i].c].backFrame
          this.grid[neighbors[rand].r][neighbors[rand].c].tileText.setText(this.grid[enemies[i].r][enemies[i].c].strength)
          this.grid[neighbors[rand].r][neighbors[rand].c].tileText.setTint(this.colors.tileEnemy1)
          this.grid[neighbors[rand].r][neighbors[rand].c].tileSprite.setTint(this.colors.tileEnemy1)

          this.grid[neighbors[rand].r][neighbors[rand].c].tileBack.setFrame(this.grid[enemies[i].r][enemies[i].c].backFrame).setAlpha(1)
          this.grid[neighbors[rand].r][neighbors[rand].c].isEmpty = false;
          this.grid[neighbors[rand].r][neighbors[rand].c].name = this.grid[enemies[i].r][enemies[i].c].name
          this.grid[neighbors[rand].r][neighbors[rand].c].strength = this.grid[enemies[i].r][enemies[i].c].strength

          this.removeTile(enemies[i].r, enemies[i].c)
          if(neighbors[rand].r == this.player.location.r && neighbors[rand].c == this.player.location.c){
            console.log('BAM')
            var tween = this.tweens.add({
              targets: this.playerGrid[this.player.location.r][this.player.location.c].tileBack,
              scale: 2,
              alpha: 0,
              yoyo: true,
              duration: 750
            })
          }
        }
      }

    }

  }
  
  findEnemies() {
    var enm = []
    for (var r = 0; r < this.rows; r++) {
      for (var c = 0; c < this.cols; c++) {
        if (this.grid[r][c].name == 'Enemy 1' || this.grid[r][c].name == 'Enemy 2' || this.grid[r][c].name == 'Enemy 3' || this.grid[r][c].name == 'Enemy 4') {
          enm.push({ r: r, c: c })
        }
      }
    }
    return enm
  }
  
  /////////////////////////////////////////////////////
  //
  // movement and collision
  //
  ////////////////////////////////////////////////////
  
  endSwipe(e) {
    var swipeTime = e.upTime - e.downTime;
    var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
    var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
    var swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude);
    if (swipeMagnitude > 20 && swipeTime < 1000 && (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)) {

      if (swipeNormal.x > 0.8) {
        //console.log('right')
        this.handleMove(0, 1, );
      }
      if (swipeNormal.x < -0.8) {
        //console.log('left')
        this.handleMove(0, -1);
      }
      if (swipeNormal.y > 0.8) {
        // console.log('down')
        this.handleMove(1, 0);
      }
      if (swipeNormal.y < -0.8) {
        // console.log('up')
        this.handleMove(-1, 0);
      }
    }
  }
  handleMove(deltaRow, deltaCol) {

    if (this.player.location.r + deltaRow == this.rows || this.player.location.r + deltaRow < 0 || this.player.location.c + deltaCol == this.cols || this.player.location.c + deltaCol < 0) { return }
    if (this.currentRoll > 0) {



      var playerTile = this.grid[this.player.location.r][this.player.location.c]
      var playerTileNew = this.grid[this.player.location.r + deltaRow][this.player.location.c + deltaCol]
     var mess = playerTileNew.name
      this.events.emit('setMessage', mess)
      if (this.checkBlock(playerTileNew)) { return }
      if (this.hasArrow) {
        this.hasArrow = false;
        UIS.playerArrowText.setVisible(false)
        this.player.strength -= 1;
        this.updateStats();
      }
      if (this.checkCollectable(playerTileNew)) {
        this.removeTile(this.player.location.r + deltaRow, this.player.location.c + deltaCol)
      }
      if (this.checkEnemy(playerTileNew)) {
        this.doBattle(playerTile, playerTileNew, deltaRow, deltaCol)
        return

      }
      this.tweens.add({
        targets: [playerTile.tileSprite, playerTile.tileText],
        x: playerTile.tileSprite.x + (deltaCol * 50),
        y: playerTile.tileSprite.y + (deltaRow * 50),
        yoyo: true,
        duration: 100,
        onCompleteScope: this,
        onComplete: function() {

          this.currentRoll--;
          this.nextNum.setText(this.currentRoll)
          if (this.currentRoll == 0) {
            this.addTiles(Phaser.Math.Between(0, 3))
            this.moveEnemies(Phaser.Math.Between(0,9))
          }
        }
      })


      this.player.removePlayer()
      this.player.location.r += deltaRow;
      this.player.location.c += deltaCol;
      this.player.addPlayer()
      //console.log(this.player.location)
    }
  }
  checkBlock(tile) {
    if (tile.name == 'Wall' || tile.name == 'Tree') { // || tile.name == 'forest'
      return true
    }
  }
  checkCollectable(tile) {
    if (tile.name == 'Potion') {
      this.player.magic += 5;
      this.addNumberPopUp(tile.tileSprite.x, tile.tileSprite.y, '@')
      this.updateStats();
      return true;
    } else if (tile.name == 'Coin') {
      this.player.coins += 1;
      this.addNumberPopUp(tile.tileSprite.x, tile.tileSprite.y, '$')
      this.updateStats();
      return true;
    } else if (tile.name == 'Health') {
      this.player.health += 1;
      this.addNumberPopUp(tile.tileSprite.x, tile.tileSprite.y, '#')
      this.updateStats();
      return true;
    } else if (tile.name == 'Sword') {
      this.player.strength += 1;
      this.addNumberPopUp(tile.tileSprite.x, tile.tileSprite.y, '1')
      this.updateStats();
      return true;
    } else if (tile.name == 'Sheild') {
      this.player.protection += 1;
      this.addNumberPopUp(tile.tileSprite.x, tile.tileSprite.y, '1')
      this.updateStats();
      return true;
    } else if (tile.name == 'Arrow') {
      this.player.strength += 1;
      UIS.playerArrowText.setVisible(true)
      this.hasArrow = true;
      this.addNumberPopUp(tile.tileSprite.x, tile.tileSprite.y, '1')
      this.updateStats();
      return true;
    } else if (tile.name == 'Key') {
      this.addDoor()
      this.addNumberPopUp(tile.tileSprite.x, tile.tileSprite.y, 'K')
      this.updateStats();
      return true;
    } else if (tile.name == 'Door') {
      alert('level complete')
      this.nextLevel()
    } else {
      return false
    }
  }
  checkEnemy(tile) {
    if (tile.name == 'Enemy 1' || tile.name == 'Enemy 2' || tile.name == 'Enemy 3' || tile.name == 'Enemy 4') {
      return true
    }
    return false
  }
  doBattle(player, enemy, deltaRow, deltaCol) {
    //alert('battle')
    this.tweens.add({
      targets: [player.tileSprite, player.tileText],
      x: player.tileSprite.x + (deltaCol * 50),
      y: player.tileSprite.y + (deltaRow * 50),
      yoyo: true,
      duration: 100,
      onCompleteScope: this,
      onComplete: function() {

        // this.currentRoll--;
        //this.nextNum.setText(this.currentRoll)
        // if (this.currentRoll == 0) {
        //this.addTiles(Phaser.Math.Between(0, 3))
        // }
      }
    })
    this.tweens.add({
      targets: [enemy.tileSprite, enemy.tileText],
      x: enemy.tileSprite.x + (deltaCol * 50),
      y: enemy.tileSprite.y + (deltaRow * 50),
      yoyo: true,
      duration: 100,
      delay: 50,
      onCompleteScope: this,
      onComplete: function() {
        var chance;
        //console.log('ps' + this.player.strength + ' es' + enemy.strength)
        if (this.player.strength > enemy.strength) {
          chance = 50 - (this.player.strength - enemy.strength)
        } else if (this.player.strength < enemy.strength) {
          chance = 50 + (enemy.strength - this.player.strength)
        } else {
          chance = 50
        }





        if (Phaser.Math.Between(0, 100) > chance) {
          // this.player.strength += 1;
          this.currentRoll--;
          this.nextNum.setText(this.currentRoll)
          this.player.removePlayer()
          this.removeTile(this.player.location.r + deltaRow, this.player.location.c + deltaCol)
          this.player.location.r += deltaRow;
          this.player.location.c += deltaCol;
          this.player.addPlayer()

        } else {
          this.player.health -= 1;

        }
        this.updateStats();
        // this.currentRoll--;
        //this.nextNum.setText(this.currentRoll)
        // if (this.currentRoll == 0) {
        //this.addTiles(Phaser.Math.Between(0, 3))
        // }
      }
    })

  }
  checkInteraction(){
    
  }
////////////////////////////////////////////////
//
/// Grid and tiles
//
///////////////////////////////////////////////
  createGrid() {

    this.g = new Grid(this, this.cols, this.rows, this.tileSize, this.xOffset, this.yOffset)
    this.grid = this.g.createGrid();
    this.pg = new playerGrid(this, this.cols, this.rows, this.tileSize, this.xOffset, this.yOffset)
    this.playerGrid = this.pg.createGrid();
    this.growMountains(9)
    this.growMountains(7)
    //this.addFeature()
    
  }
  addFeature() {
    var forest = [[0, 0], [0, -1], [0, 1], [-1, 0], [1, 0]];
    do {
      var tiles = this.getValidShape(this.getEmptySpace())
    }
    while (tiles.length == 0)

    if (tiles.length > 0) {
      //console.log(tiles)
      for (var i = 0; i < tiles.length; i++) {
        //this.grid[tiles[i].r][tiles[i].c].tileSprite.setTint(this.colors.tileTree)
        this.grid[tiles[i].r][tiles[i].c].tileValue = 0;
        this.grid[tiles[i].r][tiles[i].c].tileText.setText('')
        this.grid[tiles[i].r][tiles[i].c].tileBack.setFrame(84).setAlpha(.8)
        //this.grid[tiles[i].r][tiles[i].c].tileText.setTint(card.color)
        this.grid[tiles[i].r][tiles[i].c].isEmpty = false;
        this.grid[tiles[i].r][tiles[i].c].name = 'forest';
        this.grid[tiles[i].r][tiles[i].c].strength = 0;




      }
    }
  }
  getValidShape(point) {
    var neigh = []
    for (var d = 0; d < 4; d++) {
      if (this.inGrid(point.r + this.directions[d].r, point.c + this.directions[d].c) && this.grid[point.r + this.directions[d].r][point.r + this.directions[d].c].isEmpty) {
        neigh.push({ r: point.r + this.directions[d].r, c: point.c + this.directions[d].c })
      } else {
        return false
      }
    }
    neigh.push(point)
    return neigh
  }
  addTiles(count) {
    if (count == 0) { return }
    if (count > this.deck.length) {
      count == this.deck.length
    }
    let added = 0;
    let coo, val;
    while (added < count) {
      coo = this.getEmptySpace();
      if (this.deck.length == 0) { return }
      var card = this.deck.pop()
      this.grid[coo.r][coo.c].tileValue = card.id;
      this.grid[coo.r][coo.c].tileText.setText(card.text)
      this.grid[coo.r][coo.c].tileSprite.setTint(card.color)
      this.grid[coo.r][coo.c].tileBack.setFrame(card.index).setAlpha(1)
      this.grid[coo.r][coo.c].tileText.setTint(card.color)
      this.grid[coo.r][coo.c].isEmpty = false;
      this.grid[coo.r][coo.c].name = card.name;
      this.grid[coo.r][coo.c].strength = card.strength;
      this.grid[coo.r][coo.c].backFrame = card.index;
      //console.log('fr' + this.grid[coo.r][coo.c].backFrame);

      //this.grid[index].tileSprite.setTint(0x111111)
      added++;
    }
    //console.log('tiles: ' + added)
  }
  addDoor() {
    let coo = this.getEmptySpace();
    this.grid[coo.r][coo.c].tileValue = -1;
    this.grid[coo.r][coo.c].tileText.setText('[]')
    this.grid[coo.r][coo.c].tileSprite.setTint(this.colors.tileKey)
    this.grid[coo.r][coo.c].tileBack.setFrame(15).setAlpha(1)
    this.grid[coo.r][coo.c].tileText.setTint(this.colors.tileKey)
    this.grid[coo.r][coo.c].isEmpty = false;
    this.grid[coo.r][coo.c].name = 'Door';

  }
  getEmptySpace() {
    var clear = false;
    let one = Phaser.Math.Between(0, this.rows - 1)
    let two = Phaser.Math.Between(0, this.cols - 1)
    let rnd = { r: one, c: two };
    while (!clear) {
      one = Phaser.Math.Between(0, this.rows - 1)
      two = Phaser.Math.Between(0, this.cols - 1)
      rnd = { r: one, c: two };
      if (this.grid[rnd.r][rnd.c].isEmpty) {
        clear = true
      }
    }
    return rnd;
    // return {r: 2, c: 3};
  }
  clearGrid() {
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        this.grid[i][j].tileValue = 0;
        this.grid[i][j].isEmpty = true
        this.grid[i][j].name = '',
          this.grid[i][j].tileSprite.setTint(this.colors.tileEmpty)
        this.grid[i][j].tileText.setText('')
        this.grid[i][j].tileBack.setAlpha(0)
      }
    }

  }
  getValid4neighbors() {
    var neigh = []
    for (var d = 0; d < 4; d++) {

      if (this.inGrid(this.player.location.r + this.directions[d].r, this.player.location.c + this.directions[d].c)) {
        neigh.push({ r: this.player.location.r + this.directions[d].r, c: this.player.location.c + this.directions[d].c })
      }
    }
    return neigh
  }
  getEmptyNeighbors(point) {
    var n = []
    if (point.r - 1 > -1) {
      if (this.grid[point.r - 1][point.c].isEmpty) {
        n.push({ r: point.r - 1, c: point.c })
      }
    }
    if (point.r + 1 < this.rows) {
      if (this.grid[point.r + 1][point.c].isEmpty) {
        n.push({ r: point.r + 1, c: point.c })
      }
    }
    if (point.c - 1 > -1) {
      if (this.grid[point.r][point.c - 1].isEmpty) {
        n.push({ r: point.r, c: point.c - 1 })
      }
    }
    if (point.c + 1 < this.cols) {
      if (this.grid[point.r][point.c + 1].isEmpty) {
        n.push({ r: point.r, c: point.c + 1 })
      }
    }
    return n
  }
  inGrid(row, col) {
    if (row == this.rows || row < 0 || col == this.cols || col < 0) {
      return false
    }
    return true
  }
  makeDeck() {
    this.d = new Deck(this)
    this.deck = this.d.makeDeck()
    Phaser.Utils.Array.Shuffle(this.deck)

  }

}
