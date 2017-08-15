var $ = require('../vendor/jquery.js');

var canvas, W, H, rainHandler, ctx,
    maxDrops = 0,
    drops = [],
    floorImg,
    maxFloorDrops = 30,
    floorDrops = [],
    angle = 68;

var images = ['@@assetPath@@/assets/images/drop-1.png',
              '@@assetPath@@/assets/images/drop-2.png',
              '@@assetPath@@/assets/images/drop-3.png',
              '@@assetPath@@/assets/images/floor-drop.png'];

var imgs = {};

module.exports = {
    init: function() {
        this.createCanvas();
        this.bindings();
    },

    bindings: function() {
        $(window).resize(function() {
            this.setCanvasSize();
            this.generateInitialDrops();
        }.bind(this));
    },

    setCanvasSize: function() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;

        if (W > 700) {
            maxDrops = 50
        } else {
            maxDrops = 20
        }
    },

    createCanvas: function() {
        canvas = document.getElementsByClassName('gig-canvas')[0];
        this.setCanvasSize();
        ctx = canvas.getContext('2d');

        this.generateInitialDrops();

        this.loadImages(function() {
            this.startRaining();
        }.bind(this));
    },

    loadImages: function(onDone) {
        var count = images.length;

        var onImageLoad = function () {
            count--;
            if (0 == count) {
                onDone();
            }
        }

        for (var i = 0; i < count; i++) {
            imgs[i] = new Image();
            imgs[i].onload = function() {
                onImageLoad();
            }.bind(this);
            imgs[i].src = images[i];

        }
    },

    generateInitialDrops: function() {
        for (var i = 0; i < maxDrops; i++) {
            drops.push({
                x: Math.random() * W,
                y: (Math.random() * (H / 2)) + (H / 2),
                speed: Math.random() * 10 + 30,
                color: 'rgba(255, 255, 255, 1)',
                img: Math.floor(Math.random() * (images.length - 1)),
                angle: (Math.random() * 6) + (angle - 3)
            });
        }

        for (var i = 0; i < maxFloorDrops; i++) {
            floorDrops.push({
                x: Math.random() * W,
                y: (Math.random() * (H / 2)) + (H / 2),
                w: 20,
                h: 3,
                alpha: 1,
                speed: Math.random() * 0.05,
            });
        }
    },

    startRaining: function() {
        rainHandler = setInterval(function() {
            this.draw();
        }.bind(this), 15);
    },

    draw: function() {
        ctx.clearRect(0, 0, W, H);

        for (var i = 0; i < maxDrops; i++) {
            var drop = drops[i];
            ctx.drawImage(imgs[drop.img], drop.x, drop.y, imgs[drop.img].width / 2, imgs[drop.img].height / 2);
        }

        for (var i = 0; i < maxFloorDrops; i++) {
            var drop = floorDrops[i];
            ctx.globalAlpha = drop.alpha;
            ctx.drawImage(imgs[images.length - 1], drop.x, drop.y, drop.w, drop.h);
            ctx.globalAlpha = 1;
        }

        this.update();
    },

    update: function() {
        for (var i = 0; i < maxDrops; i++) {
            var drop = drops[i];

            var angleRad = drop.angle * (Math.PI/180);

            drop.x = drop.x + drop.speed * Math.cos(angleRad);
            drop.y = drop.y + drop.speed * Math.sin(angleRad);

            if (drop.x > W || drop.y > H) {
                drops[i].x = Math.random() * (W * 2) - W;
                drops[i].y = -148;
            }
        }

        for (var i = 0; i < maxFloorDrops; i++) {
            var drop = floorDrops[i];
            drop.w = drop.w * (drop.speed + 1);
            drop.h = drop.h * (drop.speed + 1);

            drop.x = drop.x - (drop.w * (drop.speed / 2));
            drop.y = drop.y - (drop.h * (drop.speed / 2));

            drop.alpha = drop.alpha < 0.1 ? 0 : drop.alpha - (drop.speed);


            if (imgs[images.length - 1].width / 2 < drop.w) {
                floorDrops[i].x = Math.random() * W;
                floorDrops[i].y = (Math.random() * (H / 2)) + (H / 2);
                floorDrops[i].w = 20;
                floorDrops[i].h = 3;
                drop.alpha = 1;
            }
        }
    }
}