class Grid {
  constructor(scene, width, height, tilesize, xOffset, yOffset) {
	  this.scene = scene;
	  this.rows = height;
	  this.cols = width;
    this.tileSize = tilesize;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
  }
  createGrid() {
    this.grid = [];
    //this.upgradeMax = numberRPGData.upgradeMax;
    //this.fieldArray = [];
    // this.fieldGroup = this.add.group();
    // console.log('saveval ' + gridGameData.grid[2][2].value)
    for (var i = 0; i < this.rows; i++) {
      this.grid[i] = [];
      for (var j = 0; j < this.cols; j++) {

        var tileXPos = this.xOffset + j * (this.tileSize + 15) + this.tileSize / 2;
        var tileYPos = this.yOffset + i * (this.tileSize + 15) + this.tileSize / 2;

        var one = this.scene.add.sprite(tileXPos, tileYPos, 'items', 1).setAlpha(0);
        one.displayWidth = 100;
        one.displayHeight = 100;
        
        var two = this.scene.add.sprite(tileXPos, tileYPos, 'blankoutline').setTint(this.scene.colors.tileEmpty);
        two.displayWidth = 140;
        two.displayHeight = 140;
        
		//this.scene.add.existing(two);
        var tileText = this.scene.add.bitmapText(tileXPos + 35, tileYPos - 35, 'topaz', '', 40).setOrigin(.5).setTint(this.scene.colors.tileNormal);
        
		//this.scene.add.existing(tileText);
        this.grid[i][j] = {
          tileValue: 0,
          tileText: tileText,
          tileSprite: two,
          isEmpty: true,
          canUpgrade: 0,
          hasBonus: false,
          name: '',
          tileBack: one
        }
      }
    }
	return this.grid;
  }
}



class playerGrid {
  constructor(scene, width, height, tilesize, xOffset, yOffset) {
	  this.scene = scene;
	  this.rows = height;
	  this.cols = width;
    this.tileSize = tilesize;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
  }
  createGrid() {
    this.grid = [];
    //this.upgradeMax = numberRPGData.upgradeMax;
    //this.fieldArray = [];
    // this.fieldGroup = this.add.group();
    // console.log('saveval ' + gridGameData.grid[2][2].value)
    for (var i = 0; i < this.rows; i++) {
      this.grid[i] = [];
      for (var j = 0; j < this.cols; j++) {

        var tileXPos = this.xOffset + j * (this.tileSize + 15) + this.tileSize / 2;
        var tileYPos = this.yOffset + i * (this.tileSize + 15) + this.tileSize / 2;

         var one = this.scene.add.sprite(tileXPos, tileYPos, 'player', 0).setTint(this.scene.colors.tileNormal).setAlpha(0);
         one.displayWidth = 120;
         one.displayHeight = 120;
        
        var two = this.scene.add.sprite(tileXPos, tileYPos, 'blankoutline').setTint(this.scene.colors.tileEmpty).setAlpha(0);
        two.displayWidth = 140;
        two.displayHeight = 140;
        
		//this.scene.add.existing(two);
        var tileText = this.scene.add.bitmapText(tileXPos + 35, tileYPos - 35, 'topaz', '', 40).setOrigin(.5).setTint(this.scene.colors.tileNormal);
        
		//this.scene.add.existing(tileText);
        this.grid[i][j] = {
        
          tileText: tileText,
          tileSprite: two,
          tileBack: one,
          isEmpty: true,
          
        }
      }
    }
	return this.grid;
  }
}