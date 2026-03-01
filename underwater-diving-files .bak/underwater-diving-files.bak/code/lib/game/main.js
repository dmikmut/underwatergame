

ig.module(
    'game.main'
)
    .requires(
    'impact.game',
    'impact.font',
    'plugins.camera',
    'game.entities.player',
    'game.entities.spear',
    'game.entities.spear-pickup',
    'game.levels.level0',
    'game.levels.level1',
    'game.levels.level2',
    'game.screens.startscreen',
    'game.screens.instructionsscreen'
)
    .defines(function () {

        MyGame = ig.Game.extend({
            player: null,
            targetRespawn: null,
            score: 0,
            scoreFont: null,
            bgm: new ig.Sound('media/watery_cave_loop.ogg', false),

            highScore: 0,
            scoreFont: null,
            gameState: 'countdown',
            countdownTimer: null,
            gameTimer: null,
            bgm: new ig.Sound('media/watery_cave_loop.ogg', false),


            init: function () {
                this.score = 0;
                this.highScore = 0;
                ig.input.bind(ig.KEY.UP_ARROW, 'up');
                ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
                //
                ig.input.bind(ig.KEY.SPACE, 'boost');
                ig.input.bind(ig.KEY.E, 'throw'); // E = throw trident

                this.camera = new ig.Camera(ig.system.width / 2.5, ig.system.height / 2, 10);
                this.camera.trap.size.x = ig.system.width / 8;
                this.camera.trap.size.y = ig.system.height / 8;
                this.camera.lookAhead.x = 1;


                ig.music.add(this.bgm,'bgmTrack' );
                ig.music.play('bgmTrack');


                this.loadLevel(LevelLevel1);


            },

            update: function () {
                this.parent();
                if (!this.player) {
                    this.player = this.getEntitiesByType(EntityPlayer)[0];
                }


                var player = this.getEntitiesByType(EntityPlayer)[0];
                this.camera.follow(this.player);
            },

            loadLevel: function (level) {
                this.parent(level);
                this.player = this.getEntitiesByType(EntityPlayer)[0];
                this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
                this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
                this.camera.set(this.player);
            },

            draw: function () {
                this.parent();
                if (this.scoreFont && this.scoreFont.loaded) {
                    var scoreText = 'Score: ' + (this.score || 0);
                    this.scoreFont.draw(scoreText, 12, 12, ig.Font.ALIGN.LEFT);
                }
            }
        });

        ig.main('#canvas', StartScreen, 60, 500, 330, 2);
                if (this.score > this.highScore) this.highScore = this.score;

    });
                        var num = d < 1 ? 3 : (d < 2 ? 2 : (d < 3 ? 1 : 0));
                var map = this.collisionMap;
                var ts = map.tilesize;
                var w = map.pxWidth;
                var h = map.pxHeight;
                var margin = ts * 3;
                var fishW = 54;
                var fishH = 54;
                var player = this.getEntitiesByType(EntityPlayer)[0];
                var x, y;
                var found = false;
                for (var attempt = 0; attempt < 50; attempt++) {
                    if (player && !player._killed && Math.random() < 0.5) {
                        var offsetX = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 120);
                        var offsetY = (Math.random() - 0.5) * 160;
                        x = player.pos.x + offsetX;
                        y = player.pos.y + offsetY;
                    } else {
                        x = margin + Math.random() * (w - 2 * margin);
                        y = margin + Math.random() * (h - 2 * margin);
                    }
                    x = Math.max(margin, Math.min(w - margin - fishW, x));
                    y = Math.max(margin, Math.min(h - margin - fishH, y));
                    if (this._isWalkableForFish(map, x, y, fishW, fishH)) {
                        found = true;
                        break;
                    }
                }
                if (!found && player && !player._killed) {
                    x = player.pos.x + (Math.random() > 0.5 ? 1 : -1) * 120;
                    y = player.pos.y + (Math.random() - 0.5) * 80;
                    x = Math.max(margin, Math.min(w - margin - fishW, x));
                    y = Math.max(margin, Math.min(h - margin - fishH, y));
                    if (this._isWalkableForFish(map, x, y, fishW, fishH)) found = true;
                }
                if (!found) return;
                var types = [EntityFish, EntityFishBig, EntityFishDart];
                var Type = types[Math.floor(Math.random() * types.length)];
                this.spawnEntity(Type, x, y);
            },

            _isWalkableForFish: function (map, x, y, w, h) {
                var ts = map.tilesize;
                var tx0 = Math.floor(x / ts);
                var ty0 = Math.floor(y / ts);
                var tx1 = Math.floor((x + w) / ts);
                var ty1 = Math.floor((y + h) / ts);
                for (var ty = ty0; ty <= ty1; ty++) {
                    for (var tx = tx0; tx <= tx1; tx++) {
                        if (tx < 0 || ty < 0 || tx >= map.width || ty >= map.height) return false;
                        if (map.getTile(tx * ts + 1, ty * ts + 1) !== 0) return false;
                    }
                }
                return true;
                        var min = Math.floor(remaining / 60);
                        var timeText = 'Time: ' + min + ':' + (sec < 10 ? '0' : '') + sec;
                        this.scoreFont.draw(timeText, ig.system.width - 120, 12, ig.Font.ALIGN.LEFT);
                        if (elapsed < 1) {
                            var goW = this.scoreFont.widthForString('GO!');
                            this.scoreFont.draw('GO!', ig.system.width / 2 - goW / 2, ig.system.height / 2 - 15, ig.Font.ALIGN.LEFT);
                        }
                            var w = this.scoreFont.widthForString(big);
                            var h = this.scoreFont.height;
                            var ctx = ig.system.context;
                            ctx.save();
                            ctx.translate(cw, ch);
                            ctx.scale(scale, scale);
                    var uiScale = 2;
                    var cw = ig.system.width / 2;
                    var ch = ig.system.height / 2;
                    var ctx = ig.system.context;

                    var scoreText = 'Score: ' + (this.score || 0);
                    var highText = 'High: ' + (this.highScore || 0);
                    ctx.save();
                    ctx.scale(uiScale, uiScale);
                    this.scoreFont.draw(scoreText, 12 / uiScale, 12 / uiScale, ig.Font.ALIGN.LEFT);
                    this.scoreFont.draw(highText, 12 / uiScale, (12 + this.scoreFont.height + 4) / uiScale, ig.Font.ALIGN.LEFT);
                    ctx.restore();

                    var player = this.getEntitiesByType(EntityPlayer)[0];
                    if (player && player.boostTimer && player.boostCooldown) {
                        var d = player.boostTimer.delta();
                        var fill = Math.min(1, Math.max(0, 1 + d / player.boostCooldown));
                        var barW = 140;
                        var barH = 16;
                        var barX = (ig.system.width - barW) / 2;
                        var barY = ig.system.height - barH - 24;
                        ctx.fillStyle = 'rgba(0,0,0,0.5)';
                        ctx.fillRect(barX, barY, barW, barH);
                        ctx.fillStyle = fill >= 1 ? '#2a8' : '#4cf';
                        ctx.fillRect(barX, barY, barW * fill, barH);
                        ctx.strokeStyle = '#fff';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(barX, barY, barW, barH);
                    }

                    if (this.gameState === 'countdown') {
                        var d = this.countdownTimer.delta();
                        var num = d < 1 ? 3 : (d < 2 ? 2 : (d < 3 ? 1 : 0));
                        if (num >= 1) {
                            var big = '' + num;
                            var countdownScale = 4;
                            var tw = this.scoreFont.widthForString(big);
                            var th = this.scoreFont.height;
                            ctx.save();
                            ctx.translate(cw, ch);
                            ctx.scale(countdownScale, countdownScale);
                            ctx.translate(-tw / 2, -th / 2);
                            this.scoreFont.draw(big, 0, 0, ig.Font.ALIGN.LEFT);
                            ctx.restore();
                        }
                    } else if (this.gameState === 'playing' && this.gameTimer) {
                        var elapsed = this.gameTimer.delta();
                        var remaining = Math.max(0, Math.ceil(60 - elapsed));
                        var sec = remaining % 60;
                        var min = Math.floor(remaining / 60);
                        var timeText = 'Time: ' + min + ':' + (sec < 10 ? '0' : '') + sec;
                        ctx.save();
                        ctx.scale(uiScale, uiScale);
                        this.scoreFont.draw(timeText, (ig.system.width - 120) / uiScale, 12 / uiScale, ig.Font.ALIGN.LEFT);
                        ctx.restore();
                        if (elapsed < 1) {
                            var goText = 'GO!';
                            var goScale = 3;
                            var gw = this.scoreFont.widthForString(goText);
                            var gh = this.scoreFont.height;
                            ctx.save();
                            ctx.translate(cw, ch);
                            ctx.scale(goScale, goScale);
                            ctx.translate(-gw / 2, -gh / 2);
                            this.scoreFont.draw(goText, 0, 0, ig.Font.ALIGN.LEFT);
                            ctx.restore();
                        }
                        if (remaining <= 0) {
                            var upText = 'Time\'s up!';
                            var upW = this.scoreFont.widthForString(upText);
                            ctx.save();
                            ctx.scale(uiScale, uiScale);
                            this.scoreFont.draw(upText, ig.system.width / 2 / uiScale - upW / 2, (ig.system.height / 2 - 10) / uiScale, ig.Font.ALIGN.LEFT);
                            ctx.restore();
