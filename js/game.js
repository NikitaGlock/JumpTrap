let cursors;
let player;
let leftPressed = false;
let rightPressed = false;
let upPressed = false;

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#1d1d1d',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

function preload() {
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
}

function create() {
    const ground = this.physics.add.staticGroup();
    ground.create(config.width / 2, config.height - 20, 'ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, config.height - 150, 'player');
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, ground);

    cursors = this.input.keyboard.createCursorKeys();

    // Touch controls
    document.getElementById('left').addEventListener('touchstart', () => leftPressed = true);
    document.getElementById('left').addEventListener('touchend', () => leftPressed = false);

    document.getElementById('right').addEventListener('touchstart', () => rightPressed = true);
    document.getElementById('right').addEventListener('touchend', () => rightPressed = false);

    document.getElementById('up').addEventListener('touchstart', () => upPressed = true);
    document.getElementById('up').addEventListener('touchend', () => upPressed = false);
}

function update() {
    if (cursors.left.isDown || leftPressed) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown || rightPressed) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    if ((cursors.up.isDown || upPressed) && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

const game = new Phaser.Game(config);
