
BasicGame.Game = function (game) {
  
};

BasicGame.Game.prototype = {

  preload: function() {
    
    //    this.load.image('powerup1', 'assets/powerup1.png');
    this.load.spritesheet('sokol', '/game/assets/sokol.png', 32, 32);
    // this.load.audio('powerUp', ['assets/powerup.ogg', 'assets/powerup.wav']);
  },

  create: function () {
  
    this.registerEvents();
    this.createShips();
    this.createTie();
    this.createWings();
    this.createBullets();
    
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);
  },
  
  registerEvents: function() {
    
    var self = this;
    var exampleSocket = new WebSocket("wss://racing-vnovikov.c9users.io/server");
    exampleSocket.onmessage = function (event) {
      // this.fire();
      console.log(event);

      if (!_.isUndefined(event.data)) {


        var parsedEvent = JSON.parse(event.data);
        if (_.isEqual("acc", parsedEvent.type) || _.isEqual("rotate", parsedEvent.type)) {
          self.trackUserInput(parsedEvent);
        } else if (_.isEqual("connect", parsedEvent.type)) {
          console.log(parsedEvent.data);
          self.initNewUser(parsedEvent.data);
        }
      }
    }
  },
  
  createBullets: function() {
    
  },
  
  initNewUser: function(connectInfo) {
    
    var selectedShip;
    if (_.isEqual("1", connectInfo.shipType)) {
      selectedShip = this.shipsPool.getFirstExists(false);
    } else if (_.isEqual("2", connectInfo.shipType)) {
      selectedShip = this.wingPool.getFirstExists(false);
    } else if (_.isEqual("3", connectInfo.shipType)) {
      selectedShip = this.tiesPool.getFirstExists(false);
    }
    
    console.log("selectedShip " + selectedShip);
    
    if (_.isUndefined(this.idToShip)) {
      this.idToShip = [];
    }
    this.idToShip[connectInfo.clientId] = selectedShip;
    console.log(this.idToShip);
    this.spawnShip(selectedShip);
  },
  
  createShips: function() {
    
        // this.sea = this.add.tileSprite(0, 0, 1000, 600, 'sokol');
    this.shipsPool = this.add.group();
    
        // Enable physics to the whole sprite group
    this.shipsPool.enableBody = true;
    this.shipsPool.physicsBodyType = Phaser.Physics.ARCADE;

    // Add 100 'bullet' sprites in the group.
    // By default this uses the first frame of the sprite sheet and
    //   sets the initial state as non-existing (i.e. killed/dead)
    this.shipsPool.createMultiple(50, 'sokol');

    // Sets anchors of all sprites
    this.shipsPool.setAll('anchor.x', 0.5);
    this.shipsPool.setAll('anchor.y', 0.5);
  
    this.shipsPool.setAll('reward', BasicGame.DEFAULT_REWARD, false, false, 0, true);
    this.shipsPool.setAll('power', BasicGame.SOKOL_POWER, false, false, 0, true);
    this.shipsPool.setAll('maxSpeed', BasicGame.SOKOL_MAX_SPEED, false, false, 0, true);
    this.shipsPool.setAll('acceleration', BasicGame.SOKOL_ACCELERATION, false, false, 0, true);
    this.shipsPool.setAll('rotationSpeed', BasicGame.SOKOL_ROTATION_SPEED, false, false, 0, true);

    // Automatically kill the bullet sprites when they go out of bounds
    //this.shipsPool.setAll('outOfBoundsKill', true);
    //this.shipsPool.setAll('checkWorldBounds', true);

    // this.spawnShip();
  },
  
  createTie: function() {
    
        // this.sea = this.add.tileSprite(0, 0, 1000, 600, 'sokol');
    this.tiesPool = this.add.group();
    
        // Enable physics to the whole sprite group
    this.tiesPool.enableBody = true;
    this.tiesPool.physicsBodyType = Phaser.Physics.ARCADE;

    // Add 100 'bullet' sprites in the group.
    // By default this uses the first frame of the sprite sheet and
    //   sets the initial state as non-existing (i.e. killed/dead)
    this.tiesPool.createMultiple(50, 'sokol');

    // Sets anchors of all sprites
    this.tiesPool.setAll('anchor.x', 0.5);
    this.tiesPool.setAll('anchor.y', 0.5);
  
    this.tiesPool.setAll('reward', BasicGame.DEFAULT_REWARD, false, false, 0, true);
    this.tiesPool.setAll('power', BasicGame.TIE_POWER, false, false, 0, true);
    this.tiesPool.setAll('maxSpeed', BasicGame.TIE_MAX_SPEED, false, false, 0, true);
    this.tiesPool.setAll('acceleration', BasicGame.TIE_ACCELERATION, false, false, 0, true);
    this.tiesPool.setAll('rotationSpeed', BasicGame.TIE_ROTATION_SPEED, false, false, 0, true);

    // Automatically kill the bullet sprites when they go out of bounds
    // this.shipsPool.setAll('outOfBoundsKill', true);
    // this.shipsPool.setAll('checkWorldBounds', true);
  },
  
    createWings: function() {
    
        // this.sea = this.add.tileSprite(0, 0, 1000, 600, 'sokol');
    this.wingPool = this.add.group();
    
        // Enable physics to the whole sprite group
    this.wingPool.enableBody = true;
    this.wingPool.physicsBodyType = Phaser.Physics.ARCADE;

    // Add 100 'bullet' sprites in the group.
    // By default this uses the first frame of the sprite sheet and
    //   sets the initial state as non-existing (i.e. killed/dead)
    this.wingPool.createMultiple(50, 'sokol');

    // Sets anchors of all sprites
    this.wingPool.setAll('anchor.x', 0.5);
    this.wingPool.setAll('anchor.y', 0.5);
  
    this.wingPool.setAll('reward', BasicGame.DEFAULT_REWARD, false, false, 0, true);
    this.wingPool.setAll('power', BasicGame.WING_POWER, false, false, 0, true);
    this.wingPool.setAll('maxSpeed', BasicGame.WING_MAX_SPEED, false, false, 0, true);
    this.wingPool.setAll('acceleration', BasicGame.WING_ACCELERATION, false, false, 0, true);
    this.wingPool.setAll('rotationSpeed', BasicGame.WING_ROTATION_SPEED, false, false, 0, true);

    // Automatically kill the bullet sprites when they go out of bounds
    // this.shipsPool.setAll('outOfBoundsKill', true);
    // this.shipsPool.setAll('checkWorldBounds', true);
  },
  // spawnShip: function() {
    
  //   var ship = this.shipsPool.getFirstExists(false);
  //   // spawn at a random location top of the screen
    
  //   var x = this.rnd.integerInRange(0, 800);
  //   var y =this.rnd.integerInRange(100, 600);
    
  //   ship.reset(x, y);
  //   ship.angle = -90; // rnd?
  //   ship.body.maxVelocity.setTo(ship.maxSpeed, ship.maxSpeed);
    
  //   this.ship = ship
  // },
  spawnShip: function(ship) {
    
    // var ship = this.shipsPool.getFirstExists(false);

    var x = this.rnd.integerInRange(0, 800);
    var y = this.rnd.integerInRange(100, 600);
    
    ship.reset(x, y);
    ship.angle = -90; // rnd?
    ship.body.maxVelocity.setTo(ship.maxSpeed, ship.maxSpeed);
    
    this.ship = ship
  },

  update: function () {
    //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
    // this.trackUserInput();
  },
  
  trackUserInput: function(event) {
    
    
    
    console.log("event.clientId " + event.data.clientId);
    console.log(this.idToShip);
    var ship = this.idToShip[event.data.clientId];
    
    if (ship.x > this.game.width) ship.x = 0;
    if (ship.x < 0) ship.x = this.game.width;
    if (ship.y > this.game.height) ship.y = 0;
    if (ship.y < 0) ship.y = this.game.height;
    
    if (_.isEqual("acc", event.type)) {
      this.handleAcceleration(ship, event.data.value);
    } else if (_.isEqual("rotate", event.type)) {
      this.handleRotation(ship, event.data.value);
    }
  },
  
  handleAcceleration: function(ship, isActive) {
    
    console.log("handle acceleration");
    if (isActive) {
        // If the UP key is down, thrust
        // Calculate acceleration vector based on this.angle and this.ACCELERATION
        ship.body.acceleration.x = Math.cos(ship.rotation) * ship.acceleration;
        ship.body.acceleration.y = Math.sin(ship.rotation) * ship.acceleration;

        // Show the frame from the spritesheet with the engine on
        ship.frame = 1;
    } else {
        // Otherwise, stop thrusting
        ship.body.acceleration.setTo(0, 0);

        // Show the frame from the spritesheet with the engine off
        ship.frame = 0;
    }
  },

handleRotation: function(ship, rotationValue) {
    
    ship.body.angularVelocity = rotationValue*ship.rotationSpeed*BasicGame.ROTATION_CALIBRATE;
},
  
  leftInputIsActive : function() {

    var isActive = false;
  
    isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    isActive |= (this.game.input.activePointer.isDown &&
    this.game.input.activePointer.x < this.game.width/4);

    return isActive;
  },
  
  rightInputIsActive : function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
    isActive |= (this.game.input.activePointer.isDown &&
        this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

    return isActive;
  },
  
  upInputIsActive : function() {
      var isActive = false;
  
      isActive = this.input.keyboard.isDown(Phaser.Keyboard.UP);
      isActive |= (this.game.input.activePointer.isDown &&
          this.game.input.activePointer.x > this.game.width/4 &&
          this.game.input.activePointer.x < this.game.width/2 + this.game.width/4);
  
      return isActive;
  },

  quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //  Then let's go back to the main menu.
    // this.state.start('MainMenu');

  }

};
