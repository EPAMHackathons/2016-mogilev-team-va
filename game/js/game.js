
BasicGame.Game = function (game) {
  
};

BasicGame.Game.prototype = {

  preload: function() {
    
    this.load.image('back', '/game/assets/space1.jpg');
    this.load.image('redLaser', '/game/assets/laser.png');
    this.load.image('bigLaser', '/game/assets/laser2.png');
    this.load.image('deathStart', '/game/assets/death_star.png');
    this.load.spritesheet('sokol', '/game/assets/sokol.png', 65, 48);
    this.load.spritesheet('wing', '/game/assets/wing.png', 48, 48);
    this.load.spritesheet('tie', '/game/assets/tie.png', 48, 48);
    this.load.spritesheet('explosion', '/game/assets/explosion.png', 32, 32);
    this.load.spritesheet('superFighter', '/game/assets/SuperFighter.png', 96, 128);
    
    this.load.audio('explosion', ['/game/audio/explosion.ogg']);
    this.load.audio('playerExplosion', ['/game/audio/player-explosion.ogg']);
    this.load.audio('playerFire', ['/game/audio/player-fire.ogg']);
  },

  create: function () {
  
    // this.game.stage.backgroundColor = '#0072bc';
    this.game.add.sprite(0, 0, 'back');
    this.game.add.image(1000,200, 'deathStart').anchor.set(0.5);

    this.registerEvents();
    this.createShips();
    this.createTie();
    this.createWings();
    this.createBullets();
    this.createExplosion();
    this.setUpAudio();
    
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);
    
    this.spawnBigShip();
  },
  
  setUpAudio: function() {

    this.sound.volume = 0.3;
    this.explosionSFX = this.add.audio('explosion');
    this.playerExplosionSFX = this.add.audio('playerExplosion');
    this.playerFireSFX = this.add.audio('playerFire');
  },
  
  registerEvents: function() {
    
    var self = this;
    this.exampleSocket = new WebSocket("wss://racing-vnovikov.c9users.io/server");
    this.exampleSocket.onmessage = function (event) {
      // this.fire();
      console.log(event);

      if (!_.isUndefined(event.data)) {


        var parsedEvent = JSON.parse(event.data);
        if (_.isEqual("acc", parsedEvent.type) || _.isEqual("rotate", parsedEvent.type) || _.isEqual("fire", parsedEvent.type)) {
          self.trackUserInput(parsedEvent);
        } else if (_.isEqual("connect", parsedEvent.type)) {
          console.log(parsedEvent.data);
          self.initNewUser(parsedEvent.data);
        } else if (_.isEqual("disconnect", parsedEvent.type)) {
          console.log('Disconnected: ' + parsedEvent.data.clientId);
          self.disconnectUser(parsedEvent.data.clientId);
        }
      }
    }
  },
  
  createExplosion: function() {
    this.explosionPool = this.add.group();
    this.explosionPool.enableBody = true;
    this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.explosionPool.createMultiple(100, 'explosion');
    this.explosionPool.setAll('anchor.x', 0.5);
    this.explosionPool.setAll('anchor.y', 0.5);
    this.explosionPool.forEach(function(explosion) {
      explosion.animations.add('boom');
    });
  },
  
  createBullets: function() {
    
        // Enable physics to the whole sprite group
    this.redLasersPool = this.add.group();
    this.redLasersPool.enableBody = true;
    this.redLasersPool.physicsBodyType = Phaser.Physics.ARCADE;

    this.redLasersPool.createMultiple(200, 'redLaser');

    this.redLasersPool.setAll('anchor.x', 0.5);
    this.redLasersPool.setAll('anchor.y', 0.5);
    
    this.redLasersPool.setAll('damage', BasicGame.DEFAULT_DAMAGE, false, false, 0, true);

    this.redLasersPool.setAll('outOfBoundsKill', true);
    this.redLasersPool.setAll('checkWorldBounds', true);
      
    this.bigLasersPool = this.add.group();
    this.bigLasersPool.enableBody = true;
    this.bigLasersPool.physicsBodyType = Phaser.Physics.ARCADE;

    this.bigLasersPool.createMultiple(200, 'bigLaser');

    this.bigLasersPool.setAll('anchor.x', 0.5);
    this.bigLasersPool.setAll('anchor.y', 0.5);
    
    this.bigLasersPool.setAll('damage', BasicGame.DEFAULT_DAMAGE, false, false, 0, true);

    this.bigLasersPool.setAll('outOfBoundsKill', true);
    this.bigLasersPool.setAll('checkWorldBounds', true);
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
    selectedShip.clientId = connectInfo.clientId;
    console.log(this.idToShip);
    this.spawnShip(selectedShip);
  },
  
  disconnectUser: function(clientId) {
    this.idToShip[clientId].kill();
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
    this.shipsPool.forEach(function(enemy) {
      enemy.animations.add('ghost', [2, 0, 2, 0], 20, false);
      enemy.animations.add('activeGhost', [3, 1, 3, 1], 20, false);
      enemy.health = BasicGame.SOKOL_HEALTH;
    }, this);
  
    this.shipsPool.setAll('reward', BasicGame.DEFAULT_REWARD, false, false, 0, true);
    this.shipsPool.setAll('power', BasicGame.SOKOL_POWER, false, false, 0, true);
    this.shipsPool.setAll('maxSpeed', BasicGame.SOKOL_MAX_SPEED, false, false, 0, true);
    this.shipsPool.setAll('acceleration', BasicGame.SOKOL_ACCELERATION, false, false, 0, true);
    this.shipsPool.setAll('rotationSpeed', BasicGame.SOKOL_ROTATION_SPEED, false, false, 0, true);
    this.shipsPool.setAll('shotDelay', BasicGame.SOKOL_SHOOT_DELAY, false, false, 0, true);
    this.shipsPool.setAll('health', BasicGame.SOKOL_HEALTH, false, false, 0, true);

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
    this.tiesPool.createMultiple(50, 'tie');

    // Sets anchors of all sprites
    this.tiesPool.setAll('anchor.x', 0.5);
    this.tiesPool.setAll('anchor.y', 0.5);
  
    this.tiesPool.setAll('reward', BasicGame.DEFAULT_REWARD, false, false, 0, true);
    this.tiesPool.setAll('power', BasicGame.TIE_POWER, false, false, 0, true);
    this.tiesPool.setAll('maxSpeed', BasicGame.TIE_MAX_SPEED, false, false, 0, true);
    this.tiesPool.setAll('acceleration', BasicGame.TIE_ACCELERATION, false, false, 0, true);
    this.tiesPool.setAll('rotationSpeed', BasicGame.TIE_ROTATION_SPEED, false, false, 0, true);
    this.tiesPool.setAll('shotDelay', BasicGame.TIE_SHOOT_DELAY, false, false, 0, true);
    this.tiesPool.setAll('health', BasicGame.TIE_HEALTH, false, false, 0, true);
    this.tiesPool.forEach(function(enemy) {
      enemy.animations.add('ghost', [2, 0, 2, 0], 20, false);
      enemy.animations.add('activeGhost', [3, 1, 3, 1], 20, false);
      enemy.health = BasicGame.TIE_HEALTH;
    }, this);

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
    this.wingPool.createMultiple(50, 'wing');

    // Sets anchors of all sprites
    this.wingPool.setAll('anchor.x', 0.5);
    this.wingPool.setAll('anchor.y', 0.5);
  
    this.wingPool.setAll('reward', BasicGame.DEFAULT_REWARD, false, false, 0, true);
    this.wingPool.setAll('power', BasicGame.WING_POWER, false, false, 0, true);
    this.wingPool.setAll('maxSpeed', BasicGame.WING_MAX_SPEED, false, false, 0, true);
    this.wingPool.setAll('acceleration', BasicGame.WING_ACCELERATION, false, false, 0, true);
    this.wingPool.setAll('rotationSpeed', BasicGame.WING_ROTATION_SPEED, false, false, 0, true);
    this.wingPool.setAll('shotDelay', BasicGame.WING_SHOOT_DELAY, false, false, 0, true);
    // this.wingPool.setAll('health', BasicGame.WING_HEALTH, false, false, 0, true);
    this.wingPool.forEach(function(enemy) {
      enemy.animations.add('ghost', [2, 0, 2, 0], 20, true);
      // anim.events.onAnimationComplete.add(function(e) {
      //   console.log("stopped");
      //   console.log(e);
      // }, this);
      // enemy.health = BasicGame.WING_HEALTH;
    }, this);

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

    var x = this.rnd.integerInRange(10, $(document).width());
    var y = this.rnd.integerInRange(10, $(document).height());
    
    ship.reset(x, y);
    ship.angle = -90; // rnd?
    ship.body.maxVelocity.setTo(ship.maxSpeed, ship.maxSpeed);
    ship.body.collideWorldBounds = true;
    
    ship.health = 10;
  },
  
  spawnBigShip: function() {
    
    this.bigshipPool = this.add.group();
    this.bigshipPool.enableBody = true;
    this.bigshipPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.bigshipPool.createMultiple(1, 'superFighter');
    this.bigshipPool.setAll('anchor.x', 0.5);
    this.bigshipPool.setAll('anchor.y', 0.5);
    this.bigshipPool.setAll('outOfBoundsKill', false);
    this.bigshipPool.setAll('checkWorldBounds', true);
    this.nextShotAt = 0;

    this.bigShip = this.bigshipPool.getFirstExists(false);
    this.bigShip.shotDelay = BasicGame.SUPER_SHIP_SHOT_DELAY;
    this.bigShip.health = BasicGame.SUPER_SHIP_HEALTH;
    
    var x = this.rnd.integerInRange(10, $(document).width());
    var y = this.rnd.integerInRange(10, $(document).height());
    
    this.bigShip.rotation = 0.9;

    this.bigShip.reset(200, 200);
    this.bigShip.body.velocity.y = this.rnd.integerInRange(BasicGame.SUPER_SHIP_SPEED, BasicGame.SUPER_SHIP_SPEED);
    this.bigShip.body.velocity.x = this.rnd.integerInRange(BasicGame.SUPER_SHIP_SPEED, BasicGame.SUPER_SHIP_SPEED);
  },

  update: function () {
    
    this.checkCollisions();
    this.controlEnemies();
    
    if (this.bigShip.alive) {
      
      var rndX = this.rnd.integerInRange(10, $(document).height());
      if (this.bigShip.x > this.game.width) this.bigShip.x = 0;
      if (this.bigShip.x < 0) this.bigShip.x = this.game.width;
      if (this.bigShip.y > this.game.height) {
        this.bigShip.x = rndX;
        this.bigShip.y = 0;
      }
      if (this.bigShip.y < 0) this.ship.y = this.bigShip.game.height;
    }
  },
  
  controlEnemies: function() {
    
    if (_.isUndefined(this.bigShip) ||!this.bigShip.alive || this.bigShip.nextShotAt > this.time.now) {
      return;
    }
    for(var i = 0; i < 5; ++i) {
      
      console.log("this.bigShip.nextShotAt " + this.bigShip.nextShotAt + " this.time.now " + this.time.now);
      
      
      // var rightBullet = this.redLasersPool.getFirstExists(false);
      // rightBullet.reset(this.bigShip.x + 10 + i * 10, this.bigShip.y + 20);
      
      var leftBullet = this.bigLasersPool.getFirstExists(false);
      leftBullet.reset(this.bigShip.x + i*10, this.bigShip.y + i*10);
      if (i === 0) {
        
        leftBullet.rotation = this.bigShip.rotation;
      } else if (i === 1) {
        
        leftBullet.rotation = this.bigShip.rotation + 1.5;
      } else if (i == 2){
        
        leftBullet.rotation = this.bigShip.rotation + i*1.8;
      } else if (i == 3){
        
        leftBullet.rotation = this.bigShip.rotation + i*7;
      } else if (i == 4 ){
        
        leftBullet.rotation = this.bigShip.rotation + i*1.8;
      }
      
      
      // this.playerFireSFX.play();
      leftBullet.body.velocity.x = Math.cos(this.bigShip.rotation + i*5) * BasicGame.BULLET_SPEED;
      leftBullet.body.velocity.y = Math.sin(this.bigShip.rotation + i*5) * BasicGame.BULLET_SPEED;
    }
    
    this.bigShip.nextShotAt = this.time.now + this.bigShip.shotDelay;
  },
  
  trackEffects: function(ship) {
    if (ship.ghostUntil && ship.ghostUntil > this.time.now) {
      return;
    } else {
      ship.animations.stop(null, false);
    }
  },
  
  checkCollisions: function() {

    this.physics.arcade.overlap(
      this.redLasersPool, this.shipsPool, this.playerHit, null, this
    );
    
    this.physics.arcade.overlap(
      this.redLasersPool, this.wingPool, this.playerHit, null, this
    );
    
    this.physics.arcade.overlap(
      this.redLasersPool, this.tiesPool, this.playerHit, null, this
    );
    
    this.physics.arcade.overlap(
      this.bigLasersPool, this.shipsPool, this.playerHit, null, this
    );
    
    this.physics.arcade.overlap(
      this.bigLasersPool, this.wingPool, this.playerHit, null, this
    );
    
    this.physics.arcade.overlap(
      this.redLasersPool, this.bigShip, this.bigShipHit, null, this
    );
    
    this.physics.arcade.overlap(
      this.bigLasersPool, this.tiesPool, this.playerHit, null, this
    );
    
    //ship collision
    this.physics.arcade.collide(
      this.shipsPool, this.shipsPool, this.playerCollision, null, this
    );
    
    this.physics.arcade.collide(
      this.tiesPool, this.tiesPool, this.playerCollision, null, this
    );
    
    this.physics.arcade.collide(
      this.wingPool, this.wingPool, this.playerCollision, null, this
    );
    
    this.physics.arcade.collide(
      this.shipsPool, this.wingPool, this.playerCollision, null, this
    );
    
    this.physics.arcade.collide(
      this.shipsPool, this.tiesPool, this.playerCollision, null, this
    );
    
    this.physics.arcade.collide(
      this.tiesPool, this.wingPool, this.playerCollision, null, this
    );

  },
  
  playerCollision: function(ship1, ship2) {
    
    if (_.isEqual(ship1.clientId, ship2.clientId)) {
      return;
    }
    
    if (ship2.ghostUntil && ship2.ghostUntil > this.time.now) {
      return;
    }
    
    if (ship1.ghostUntil && ship1.ghostUntil > this.time.now) {
      return;
    }

    ship2.health = Number(ship2.health) - 1;
    ship1.health = Number(ship1.health) - 1;

    if (ship2.health > 0) {
      ship2.ghostUntil = this.time.now + BasicGame.PLAYER_GHOST_TIME;
      ship2.play('ghost');
    } else {
    
      this.sendKilled(ship2);  
      this.explode(ship2);
      ship2.kill();
    }
    
    if (ship1.health > 0) {
      ship1.ghostUntil = this.time.now + BasicGame.PLAYER_GHOST_TIME;
      ship1.play('ghost');
    } else {
    
      this.sendKilled(ship1);  
      this.explode(ship1);
      ship1.kill();
    }
    
    var hitEvent1 = {
       type: 'hit',
       data: {
         clientId: ship1.clientId
       } 
    };

    var hitEvent2 = {
       type: 'hit',
       data: {
         clientId: ship2.clientId
       } 
    };
    this.exampleSocket.send(JSON.stringify(hitEvent1));
    this.exampleSocket.send(JSON.stringify(hitEvent2));
    
  },
  
  playerHit: function(laser, ship) {
    
    if (_.isEqual(laser.clientId, ship.clientId)) {
      return;
    }
    
    if (ship.ghostUntil && ship.ghostUntil > this.time.now) {
      return;
    }

    ship.health = Number(ship.health) - Number(laser.damage);
    if (ship.health > 0) {

      this.sendHit(ship);
      ship.ghostUntil = this.time.now + BasicGame.PLAYER_GHOST_TIME;
      ship.play('ghost');
    } else {
    
      this.sendKilled(ship);  
      this.explode(ship);
      ship.kill();
      this.playerExplosionSFX.play();
    }
  },
  
  bigShipHit: function(laser, bigShip) {
    
    this.bigShip.health = Number(this.bigShip.health) - Number(laser.damage);
    if (this.bigShip.health > 0) {

      this.bigShip.ghostUntil = this.time.now + BasicGame.PLAYER_GHOST_TIME;
      // bigShip.play('ghost');
    } else {

      this.explode(this.bigShip);
      this.bigShip.kill();
      this.playerExplosionSFX.play();
    }
  },
  
  sendKilled: function(ship) {
    
    var hitEvent = {
       type: 'killed',
       data: {
         clientId: ship.clientId
       } 
    };
    
     this.exampleSocket.send(JSON.stringify(hitEvent));
  },
  
  sendHit: function(ship) {
    
    var hitEvent = {
       type: 'hit',
       data: {
         clientId: ship.clientId
       } 
    };
    
     this.exampleSocket.send(JSON.stringify(hitEvent));
  },
  
  explode: function(sprite) {

    if (this.explosionPool.countDead() === 0 ) {
      return;
    }

    var explosion = this.explosionPool.getFirstExists(false);
    explosion.reset(sprite.x, sprite.y);
    explosion.play('boom', 15, false, true);

    explosion.body.velocity.x = sprite.body.velocity.x;
    explosion.body.velocity.y = sprite.body.velocity.y;
  },
  
  trackUserInput: function(event) {

    if (_.isUndefined(this.idToShip)) {
      return;
    }
    var ship = this.idToShip[event.data.clientId];
    
    this.trackEffects(ship);
    
    // if (ship.x > this.game.width) ship.x = 0;
    // if (ship.x < 0) ship.x = this.game.width;
    // if (ship.y > this.game.height) ship.y = 0;
    // if (ship.y < 0) ship.y = this.game.height;
    
    if (_.isEqual("acc", event.type)) {
      this.handleAcceleration(ship, event.data.value);
    } else if (_.isEqual("rotate", event.type)) {
      this.handleRotation(ship, event.data.value);
    } else if (_.isEqual("fire", event.type)) {
      this.handleFire(ship, event.data.value);
    }
  },
  
  handleAcceleration: function(ship, isActive) {
    
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

  handleFire: function(ship, isFire) {
    
    if (isFire) {

      if (_.isUndefined(ship) ||!ship.alive || ship.nextShotAt > this.time.now) {
        return;
      }
      
      this.playerFireSFX.play();
      ship.nextShotAt = this.time.now + ship.shotDelay;

      var laser;
      if (this.redLasersPool.countDead() === 0) {
        return;
      }
      laser = this.redLasersPool.getFirstExists(false);
      laser.rotation = ship.rotation;
      laser.reset(ship.x, ship.y);
      laser.clientId = ship.clientId;

      // Shoot it in the right direction
      laser.body.velocity.x = Math.cos(laser.rotation) * BasicGame.BULLET_SPEED;
      laser.body.velocity.y = Math.sin(laser.rotation) * BasicGame.BULLET_SPEED;
    }
    
  },

  quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //  Then let's go back to the main menu.
    // this.state.start('MainMenu');

  }

};
