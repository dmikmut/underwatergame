ig.module( 
	'game.entities.player'
)
.requires(
	'impact.entity',
    'game.entities.bubbles',
    'game.entities.spear',
    'game.entities.mine',
    'game.entities.mine-big',
    'game.entities.mine-small'
)
.defines(function(){

    EntityPlayer = ig.Entity.extend({
        hasSpear: true,
        size: {x: 32, y: 32},
        animSheet: new ig.AnimationSheet('media/entities/player.png', 80,80),
        size: {x: 32, y:20 },
        offset: {x:25, y:30},
        offset_correction_left: 25,
        offset_correction_right: 25,
        flip: false,
        // physics
        maxVel: {x: 200,y:100},
        friction: {x:22,y:44},
        accelHor: 400,
        accelVer: 400,
        boostSpeed: 300,
        invincibility: false,
        hurtFlag: false,
        boostFlag: false,
        health: 5,
        maxHealth: 5,
        breakingHeartQueue: [],
        currentBreakingHeart: null,
        currentBreakingFrame: 0,
        breakAnimFrameCount: 19,
        breakAnimFrameTime: 0.06,
        breakAnimTimer: null,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,

        init: function(x,y,settings){
            this.parent(x,y,settings);
            this.hasSpear = true;
            this.addAnim('idle',0.1,[0,1,2,3,4,5]);
            this.addAnim('swim',0.1,[7,8,9,10,11,12,13]);
            this.addAnim('hurt',0.1,[29,30,31,32,33]);
            this.addAnim('boost',0.1,[21,22,23,24,25,26,27]);
            this.addAnim('fast',0.1,[15,16,17,18,19]);

            this.invincibilityTimer = new ig.Timer(1);
            this.boostTimer = new ig.Timer(0.8);
        },

        ready: function () {
            this.hasSpear = true;
            if (ig.game.targetRespawn != null) {
                this.positionPlayerInTarget();
            }
        },


        positionPlayerInTarget: function(){
            // flip plaer if respanws on the right side
            if(ig.game.getEntityByName(ig.game.targetRespawn).pos.x > 30) this.flip = true;
            this.pos.x = ig.game.getEntityByName(ig.game.targetRespawn).pos.x;
            this.pos.y = ig.game.getEntityByName(ig.game.targetRespawn).pos.y;
        },

        update: function(){
            this.parent();
            this.movePlayer();
            this.tryThrowSpear();
            this.updateBreakingHearts();

            // reset timers
            if(this.hurtFlag  && this.invincibilityTimer.delta() >= 0 ){
                this.hurtFlag = false;
            }
            if(this.boostFlag  && this.boostTimer.delta() >= 0 ){
               this.boostFlag = false;
            }
        },

        tryThrowSpear: function(){
            if (!this.hasSpear || !ig.input.pressed('throw') || !ig.game.player) return;
            if (ig.game && ig.game.gameState === 'countdown') return;
            this.hasSpear = false;
            ig.game.spawnEntity(EntityBubbles, this.pos.x, this.pos.y - 20);
            var speed = 320;
            // Throw in the direction the player is facing (this.flip = true when facing left)
            var velX = this.flip ? -speed : speed;
            ig.game.spawnEntity(EntitySpear,
                this.pos.x + this.size.x / 2 - 32,
                this.pos.y + this.size.y / 2 - 32,
                { thrower: this, velX: velX, velY: 0, facingLeft: this.flip }
            );
        },

        movePlayer: function(){
            if (ig.game && ig.game.gameState === 'countdown') {
                this.accel.x = 0;
                this.accel.y = 0;
                this.vel.x = 0;
                this.vel.y = 0;
                return;
            }
            var accelX = this.accelHor;
            var accelY = this.accelVer;

            if(ig.input.released('boost') && !this.boostFlag){
                this.boostFlag = true;
                this.boostTimer.reset();
                this.accel.x = 0;
                this.vel.x = this.flip ? -this.boostSpeed : this.boostSpeed;
                this.currentAnim = this.anims.boost.rewind();
                ig.game.spawnEntity(EntityBubbles, this.pos.x,this.pos.y - 20);
            }


            if(!this.boostFlag){
                if(ig.input.state('up')){
                    this.accel.y = -accelY;
                }else if(ig.input.state('down')){
                    this.accel.y = accelY;
                }else{
                    this.accel.y = 0;
                }


                if(ig.input.state('left')){
                    this.accel.x = (this.vel.x < -200) ? 0 : -accelX;
                    this.flip = true;
                }else if(ig.input.state('right') ){
                    this.accel.x = (this.vel.x > 200) ? 0 : accelX;
                    this.flip = false;
                }else{
                    this.accel.x = 0;
                }
            }
        },

        receiveDamage: function(amount, from){
            if (this.health <= 0 || this.boostFlag) return;
            if (this.invincibilityTimer.delta() < 0) return;
            if (from && ig.game && ig.game.score != null) {
                if (from instanceof EntityMineBig) ig.game.score = Math.max(0, ig.game.score - 20);
                else if (from instanceof EntityMineSmall || from instanceof EntityMine) ig.game.score = Math.max(0, ig.game.score - 10);
            }
            amount = amount || 1;
            for (var i = 0; i < amount; i++) {
                if (this.health <= 0) break;
                this.health--;
                this.breakingHeartQueue.push(this.health);
            }
            this.invincibilityTimer.reset();
            this.hurtFlag = true;
        },

        updateBreakingHearts: function(){
            if (this.currentBreakingHeart === null && this.breakingHeartQueue.length > 0) {
                this.currentBreakingHeart = this.breakingHeartQueue.shift();
                this.currentBreakingFrame = 0;
                this.breakAnimTimer = new ig.Timer(0);
            }
            if (this.currentBreakingHeart !== null && this.breakAnimTimer) {
                this.currentBreakingFrame = Math.min(
                    this.breakAnimFrameCount,
                    Math.floor(this.breakAnimTimer.delta() / this.breakAnimFrameTime)
                );
                if (this.currentBreakingFrame >= this.breakAnimFrameCount) {
                    this.currentBreakingHeart = null;
                    if (this.breakingHeartQueue.length > 0) {
                        this.currentBreakingHeart = this.breakingHeartQueue.shift();
                        this.currentBreakingFrame = 0;
                        this.breakAnimTimer.set();
                    }
                }
            }
        },

        check: function(other){
            var playing = ig.game && ig.game.gameState === 'playing' && ig.game.gameTimer && ig.game.gameTimer.delta() < 60;
            if (other instanceof EntityFish && this.boostFlag) {
                if (!other._killed && ig.game && ig.game.score != null && playing) ig.game.score += 10;
                other.kill();
            }
            if (other instanceof EntityFishBig && this.boostFlag) {
                if (!other._killed && ig.game && ig.game.score != null && playing) ig.game.score += 25;
                other.kill();
            }
            if (other instanceof EntityFishDart && this.boostFlag) {
                if (!other._killed && ig.game && ig.game.score != null && playing) ig.game.score += 15;
                other.kill();
            }
        },

        draw: function(){
            this.parent();

            if (this.hasSpear) {
                var baseX = this.pos.x - this.offset.x - ig.game._rscreen.x;
                var baseY = this.pos.y - this.offset.y - ig.game._rscreen.y;
                var dx = baseX + (this.flip ? -48 : this.size.x - 16);
                var dy = baseY + this.size.y / 2 - 32;
                var sheet = EntitySpear.prototype.animSheet;
                var drawn = false;
                if (sheet && sheet.image && sheet.image.loaded) {
                    sheet.image.drawTile(dx, dy, 2, 64, 64, this.flip, false);
                    drawn = true;
                }
                if (!drawn) {
                    var ctx = ig.system.context;
                    var s = ig.system.scale;
                    ctx.fillStyle = 'rgba(0, 200, 255, 0.9)';
                    ctx.fillRect(ig.system.getDrawPos(dx), ig.system.getDrawPos(dy), 32 * s, 64 * s);
                }
            }

            if(this.boostTimer.delta() < 1 && this.boostFlag ){
                this.currentAnim = this.anims.boost;

            }else if(this.invincibilityTimer.delta() < 0 && this.hurtFlag ){
                this.currentAnim = this.anims.hurt;
            }else{
                var temp = 30;
                if(this.vel.x >= -temp && this.vel.x <= temp ) {
                    this.currentAnim =  this.anims.idle;
                }else if(this.vel.x > temp){
                    this.currentAnim = (this.vel.x > 200 ) ? this.anims.fast : this.anims.swim;

                }else if(this.vel.x < temp){
                    this.currentAnim = (this.vel.x < -200 ) ? this.anims.fast : this.anims.swim;

                }else{

                }
            }

            this.currentAnim.flip.x = this.flip;
        }


    });

});
