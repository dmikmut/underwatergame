/*
 Display the start screen
 */
ig.module(
    'game.screens.startscreen'
).requires(
    'impact.game',
    'impact.font',
    'plugins.parallax'
).defines(function () {

        // Screens
        StartScreen = ig.Game.extend({

            parallax_0: new ig.Image('media/start-screen-bg.png'),
            parallax_1: new ig.Image('media/start-screen-fg.png'),
            splash: new ig.Image('media/start-screen-gradient.png'),
            instructText: new ig.Font('media/04b03.font.png'),
            texto: "PRESS ENTER",
            vel: 100,

            init: function () {

                this.parallax = new Parallax();
                this.parallax.add('media/start-screen-bg.png', {distance: 15, y: 0});
                this.parallax.add('media/start-screen-fg.png', {distance: 7, y: 0});

                this.blinkTimer = new ig.Timer(1);
                this.instructText.lineSpacing = 2;

                ig.input.unbindAll();
                ig.input.bind(ig.KEY.ENTER, 'start');

            },

            update: function () {
                this.blinkTextManager();
                this.parallax.move(this.vel); //speed        
                this.parent();

                if (ig.input.pressed('start')) {
                    ig.system.setGame(Instructionscreen);
                }

            },

            drawImages: function () {
                var x = 0;
                var y = 0;
                this.splash.draw(x, y);
            },

            draw: function () {
                this.parent();
                this.parallax.draw();
                this.drawImages();
                this.instructText.draw(this.texto, ig.system.width / 2 - this.instructText.widthForString(this.texto) / 2, ig.system.height / 2 + 60, ig.Font.ALIGN.LEFT);
            },

            blinkTextManager: function () {
                if (this.blinkTimer.delta() > 0) {
                    this.blinkTimer.reset();
                    if (this.blinkFlag) {
                        this.blinkFlag = false;
                        this.instructText.alpha = 0;
                    } else {
                        this.blinkFlag = true;
                        this.instructText.alpha = 1;
                    }
                }
            }

        });

    });