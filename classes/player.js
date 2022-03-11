class Player {
  constructor(scene, ps) {
	  this.scene = scene;
	    this.location = { r: ps.r, c: ps.c };
      this.health = 10;
      this.strength = 5;
      this.magic = 0;
      this.protection = 5;
      this.coins = 0;
      this.inventory = null;
    
  }
  addPlayer() {
    //console.log(this.player)
    this.scene.playerSprite.setPosition(this.scene.xOffset + this.location.c * (this.scene.tileSize + 15) + this.scene.tileSize / 2, this.scene.yOffset + this.location.r * (this.tileSize + 15) + this.tileSize / 2)
    this.scene.playerGrid[this.location.r][this.location.c].tileText.setText(this.scene.player.strength)
    this.scene.playerGrid[this.location.r][this.location.c].tileText.setTint(this.scene.colors.tileNormal)
    this.scene.playerGrid[this.location.r][this.location.c].tileSprite.setTint(this.scene.colors.tileNormal).setAlpha(1)
    this.scene.playerGrid[this.location.r][this.location.c].tileBack.setAlpha(1)
    this.scene.playerGrid[this.location.r][this.location.c].isEmpty = false;
  }
  removePlayer() {
    this.scene.playerGrid[this.location.r][this.location.c].tileText.setText('')
    this.scene.playerGrid[this.location.r][this.location.c].tileText.setTint(this.scene.colors.tileNormal)
    this.scene.playerGrid[this.location.r][this.location.c].tileBack.setAlpha(0)
    this.scene.playerGrid[this.location.r][this.location.c].tileSprite.setTint(this.scene.colors.tileEmpty).setAlpha(0)
    this.scene.playerGrid[this.location.r][this.location.c].isEmpty = true;
  }
}
