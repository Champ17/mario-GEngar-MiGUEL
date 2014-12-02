
game.playerEntinty = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
                image: "mario",
                spritewidth: "128",
                spriteheight: "128",
                width: 128,
                height: 128,
                getShape: function() {
                    return (new me.Rect(0, 0, 30, 128)).toPolygon();
                }
            }]);
        this.renderable.addAnimation("idle", [3]);
        this.renderable.addAnimation("smallWalk", [8, 9, 10, 11, 12, 13], 80);
        this.renderable.setCurrentAnimation("idle");
        this.body.setVelocity(5, 20);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },
    update: function(delta) {
        if (me.input.isKeyPressed("Right")) {
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.flipX(false);
        } else  {
            this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed('Left')) {
            this.flipX(true);
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            if (!this.renderable.isCurrentAnimation("smallWalk")) {
                this.renderable.setCurrentAnimation("smallWalk");
            }
        }
        if (me.input.isKeyPressed('jump')) {
          // make sure we are not already jumping or falling
          if (!this.body.jumping && !this.body.falling) {
              // set current vel to the maximum defined value
              // gravity will then do the rest
              this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
              // set the jumping flag
              this.body.jumping = true;
            }
        }

            this.body.update(delta);
            me.collision.check(this, true, this.collideHandler.bind(this), true);

            if (this.body.vel.x !== 0) {
                if (!this.renderable.isCurrentAnimation("smallWalk")) {
                    this.renderable.setCurrentAnimation("smallWalk");
                    this.renderable.setAnimationFrame();
                }
            } else {
                this.renderable.setCurrentAnimation("idle");
            }



            this._super(me.Entity, "update", [delta]);
            return true;
        }
        ,
                collideHandler: function(response){

            }
});



game.levelTrigger = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, settings]);
        this.body.onCollision = this.onCollision.bind(this);
        this.level = settings.level;
        this.xSpawn = settings.xSpawn;
        this.ySpawn = settings.ySpawn;
    },
    onCollision: function() {
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
    }
    
    

});