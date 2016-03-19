var BasicGame = {

  MAX_SPEED: 150,
  ACCELERATION: 90,
  ROTATION_SPEED: 250,
  
  DEFAULT_REWARD: 10,

  SOKOL_POWER: 1,
  SOKOL_MAX_SPEED: 90,
  SOKOL_ACCELERATION: 40,
  SOKOL_ROTATION_SPEED: 250,
  
  TIE_POWER: 1,
  TIE_MAX_SPEED: 150,
  TIE_ACCELERATION: 90,
  TIE_ROTATION_SPEED: 300,
  
  WING_POWER: 1,
  WING_MAX_SPEED: 150,
  WING_ACCELERATION: 90,
  WING_ROTATION_SPEED: 300,
  
  ROTATION_CALIBRATE: 0.5,

};

BasicGame.Boot = function (game) {
  
};

BasicGame.Boot.prototype = {

  init: function () {

    // //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
    // this.input.maxPointers = 1;

    // //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
    // // this.stage.disableVisibilityChange = true;

    // if (this.game.device.desktop) {
    //   //  If you have any desktop specific settings, they can go in here
    // } else {
    //   //  Same goes for mobile settings.
    //   //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
    //   this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //   this.scale.setMinMax(480, 260, 1024, 768);
    //   this.scale.forceLandscape = true;
    // }
    // this.scale.pageAlignHorizontally = true;
    // this.scale.pageAlignVertically = true;
  },

  preload: function () {

    //  Here we load the assets required for our preloader (in this case a loading bar)
    // this.load.image('preloaderBar', 'assets/preloader-bar.png');

  },

  create: function () {

    //  By this point the preloader assets have loaded to the cache, we've set the game settings
    //  So now let's start the real preloader going
    this.state.start('Preloader');

  }

};
