var Main;
class UI extends Phaser.Scene {

  constructor() {

    super("UI");
  }
  preload() {
  
	 
	
  }
  
  create() {
  
    this.header = this.add.image(game.config.width / 2, 10, 'blank').setOrigin(.5,0).setTint(0x000000).setAlpha(.4);
	this.header.displayWidth = 900;
	this.header.displayHeight = 200;
    
   
  this.score = 0;
      //this.scoreText = this.add.bitmapText(85, 100, 'topaz', this.score, 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);
    
   

    
	
	Main = this.scene.get('numberRPG');
	
	
	    //player stats
    this.playerHealthText = this.add.bitmapText(15, 75, 'topaz', '#' + Main.player.health, 60).setOrigin(0, .5).setTint(Main.colors.uiText);
    this.playerStrengthText = this.add.bitmapText(150, 75, 'topaz', 's' + Main.player.strength, 60).setOrigin(0, .5).setTint(Main.colors.uiText);
    this.playerProtectionText = this.add.bitmapText(250, 75, 'topaz', 'p' + Main.player.protection, 60).setOrigin(0, .5).setTint(Main.colors.uiText);
    this.playerMagicText = this.add.bitmapText(385, 75, 'topaz', '@' + Main.player.magic, 60).setOrigin(0, .5).setTint(Main.colors.uiText);
    this.playerCoinText = this.add.bitmapText(485, 75, 'topaz', '$' + Main.player.coins, 60).setOrigin(0, .5).setTint(Main.colors.tileCoin);

    this.playerArrowText = this.add.bitmapText(585, 75, 'topaz', '}->', 60).setOrigin(0, .5).setTint(0xecf0f1).setVisible(false);

	
	
    //message text
    this.tileTypeText = this.add.bitmapText(15, 150, 'topaz', 'message text', 60).setOrigin(0, .5).setTint(0xecf0f1);



	//spell button
    this.remove = this.add.image(65, game.config.height - 25, 'blank').setInteractive().setTint(0xecf0f1).setOrigin(.5,1);
    this.remove.displayWidth = 100;
    this.remove.displayHeight = 100;
    this.removeText = this.add.bitmapText(65, game.config.height - 40, 'topaz', 'X', 70).setOrigin(.5,1).setTint(0x000000);
    this.remove.on('pointerdown', function() {
      this.events.emit('wallSpell')
    }, this)
	
	
	Main.events.on('updateStats', this.updateStats, this);
    
  Main.events.on('setMessage', function(data){
    this.updateMessage(data)
  }, this);
 

  }
  
  update(){
	
  }
  updateStats() {
    this.playerHealthText.setText('#' + Main.player.health)
    this.playerStrengthText.setText('s' + Main.player.strength);
    this.playerProtectionText.setText('p' + Main.player.protection);
    this.playerMagicText.setText('@' + Main.player.magic);
    this.playerCoinText.setText('$' + Main.player.coins)
  }
  updateMessage(data){
    this.tileTypeText.setText(data)
  }
  
}
