var $ = require('../vendor/jquery.js');

var canvas, W, H, rainHandler, ctx,
    img,
    maxDrops = 20,
    drops = [],
    angle = 68;

module.exports = {
    init: function() {
        this.createCanvas();
        this.bindings();
    },

    bindings: function() {
        $(window).resize(function() {
            this.setCanvasSize();
        }.bind(this));
    },

    setCanvasSize: function() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
    },

    createCanvas: function() {
        canvas = document.getElementsByClassName('gig-canvas')[0];
        this.setCanvasSize();
        ctx = canvas.getContext('2d');

        for (var i = 0; i < maxDrops; i++) {
            drops.push({
                x: Math.random() * W - 120, // 120 to compensate for the gap on the left
                y: Math.random() * H,
                speed: Math.random() * 10 + 30,
                color: 'rgba(255, 255, 255, 1)',
            });
        }

        img = new Image();
        img.onload = function() {
            this.startRaining();
        }.bind(this);
        img.src = '@@assetPath@@/assets/images/drop-1.png';
    },

    startRaining: function() {
        rainHandler = setInterval(function() {
            this.draw();
        }.bind(this), 30);
    },

    draw: function() {
        ctx.clearRect(0, 0, W, H);

        for (var i = 0; i < maxDrops; i++) {
            var drop = drops[i];
            ctx.drawImage(img, drop.x, drop.y, 66, 148);
        }

        this.update();
    },

    update: function() {
        for (var i = 0; i < maxDrops; i++) {
            var drop = drops[i];

            var angleRad = angle * (Math.PI/180);

            drop.x = drop.x + drop.speed * Math.cos(angleRad);
            drop.y = drop.y + drop.speed * Math.sin(angleRad);

            if (drop.y > H || drop.x > W) {
                drops[i].x = Math.random() * W;
                drops[i].y = -148;
            }
        }
    }
}