class Deck {
  constructor(scene) {
	  this.scene = scene;
	  this.deck = [] 
    
  }
  makeDeck(){
    var deckConfig = [
      {type: 'Wall', count: 3},
      {type: 'Enemy 1', count: 3},
      {type: 'Enemy 2', count: 3},
      {type: 'Enemy 3', count: 3},
      {type: 'Enemy 4', count: 3},
      {type: 'Potion', count: 3},
      {type: 'Coin', count: 3},
      {type: 'Sword', count: 3},
      {type: 'Sheild', count: 3},
      {type: 'Health', count: 3},
      {type: 'Wizard', count: 3},
      {type: 'Key', count: 3},
      {type: 'Arrow', count: 3},
      {type: 'Tree', count: 3},
    ]
    for(var i = 0; i < deckConfig.length; i++){
      //this.deck.push(this.addCard(deckConfig[i].type, deckConfig[i].count, i))
      this.addCard(deckConfig[i].type, deckConfig[i].count, i)
    }
    return this.deck
  }
  getDeck(){
    return this.deck
  }
  addCard(type, count, thisid){
   for(var i = 0; i < count; i++){
    var card = {}
    
    card.name = type;
    card.text = '';
    card.id = thisid;
    card.color = this.getColor(type);
    card.strength = this.getStrength(type);
    card.index = this.getIndex(type);
    this.deck.push(card)
   }
    
  }
  getColor(type){
    if(type == 'Wall'){
      return this.scene.colors.tileWall
    } else if(type == 'Enemy 1'){
      return this.scene.colors.tileEnemy1
    } else if(type == 'Enemy 2'){
      return  this.scene.colors.tileEnemy2
    } else if(type == 'Enemy 3'){
      return this.scene.colors.tileEnemy3
    } else if(type == 'Enemy 4'){
      return this.scene.colors.tileEnemy4
    } else if(type == 'Potion'){
      return this.scene.colors.tilePotion
    } else if(type == 'Coin'){
      return this.scene.colors.tileCoin
    } else if(type == 'Sword'){
      return this.scene.colors.tileSword
    } else if(type == 'Sheild'){
      return this.scene.colors.tileSheild
    } else if(type == 'Health'){
      return this.scene.colors.tileHealth
    } else if(type == 'Wizard'){
      return this.scene.colors.tileWizard
    } else if(type == 'Key'){
      return this.scene.colors.tileKey
    } else if(type == 'Arrow'){
      return this.scene.colors.tileArrow
    } else if(type == 'Tree'){
      return this.scene.colors.tileTree
    }
  }
  getStrength(type){
    if(type == 'Wall'){
      return 0
    } else if(type == 'Enemy 1'){
      return 3
    } else if(type == 'Enemy 2'){
      return 6
    } else if(type == 'Enemy 3'){
      return 9
    } else if(type == 'Enemy 4'){
      return 12
    } else if(type == 'Potion'){
      return 0
    } else if(type == 'Coin'){
      return 0
    } else if(type == 'Sword'){
      return 0
    } else if(type == 'Sheild'){
      return 0
    } else if(type == 'Health'){
      return 0
    } else if(type == 'Wizard'){
      return 0
    } else if(type == 'Key'){
      return 0
    } else if(type == 'Arrow'){
      return 0
    } else if(type == 'Tree'){
      return 0
    }
  }
  getIndex(type){
    if(type == 'Wall'){
      return 128
    } else if(type == 'Enemy 1'){
      return 160
    } else if(type == 'Enemy 2'){
      return 161
    } else if(type == 'Enemy 3'){
      return 162
    } else if(type == 'Enemy 4'){
      return 163
    } else if(type == 'Potion'){
      return 354
    } else if(type == 'Coin'){
      return 348
    } else if(type == 'Sword'){
      return 301
    } else if(type == 'Sheild'){
      return 362
    } else if(type == 'Health'){
      return 358
    } else if(type == 'Wizard'){
      return 144
    } else if(type == 'Key'){
      return 342
    } else if(type == 'Arrow'){
      return 323
    } else if(type == 'Tree'){
      return 84
    }
  }
}
