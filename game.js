
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: [MenuScene, GameScene]
};

let game = new Phaser.Game(config);

function MenuScene() {
    Phaser.Scene.call(this, { key: 'MenuScene' });
}
MenuScene.prototype = Object.create(Phaser.Scene.prototype);
MenuScene.prototype.constructor = MenuScene;

MenuScene.prototype.preload = function () {
    this.load.image('startBtn', 'https://labs.phaser.io/assets/ui/button-start.png');
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/sky4.png');
};

MenuScene.prototype.create = function () {
    this.add.image(400, 300, 'sky');
    const startBtn = this.add.image(400, 400, 'startBtn').setInteractive();
    startBtn.on('pointerdown', () => {
        this.scene.start('GameScene');
    });
    this.add.text(260, 200, 'JumpTrap', { fontSize: '48px', fill: '#ffffff' });
};

function GameScene() {
    Phaser.Scene.call(this, { key: 'GameScene' });
}
GameScene.prototype = Object.create(Phaser.Scene.prototype);
GameScene.prototype.constructor = GameScene;

let player, platforms, cursors, coins, score = 0, scoreText, traps;

GameScene.prototype.preload = function () {
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/sky4.png');
    this.load.image('ground', 'https://labs.phaser.io/assets/platform.png');
    this.load.image('coin', 'https://labs.phaser.io/assets/sprites/coin.png');
    this.load.image('trap', 'https://labs.phaser.io/assets/sprites/spikedball.png');
    this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', {
        frameWidth: 32,
        frameHeight: 48
    });
    this.load.spritesheet('sparkle', 'https://labs.phaser.io/assets/particles/yellow.png', {
        frameWidth: 16,
        frameHeight: 16
    });
};

GameScene.prototype.create = function () {
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 584, 'ground').setScale(2).refreshBody();
    for (let i = 0; i < 16; i++) this.add.image(i * 64, 568, 'ground').setScale(0.5).setOrigin(0);

    platforms.create(600, 450, 'ground');
    platforms.create(100, 320, 'ground');
    platforms.create(750, 250, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    coins = this.physics.add.staticGroup();
    for (let i = 0; i < 7; i++) {
        coins.create(100 + i * 100, 100, 'coin').setScale(0.8);
    }

    this.physics.add.overlap(player, coins, collectCoin, null, this);

    score = 0;
    scoreText = this.add.text(16, 16, 'Монеты: 0/7', { fontSize: '24px', fill: '#fff' });

    traps = this.physics.add.staticGroup();
    traps.create(750, 200, 'trap');
    this.physics.add.overlap(player, traps, hitTrap, null, this);
};

GameScene.prototype.update = function () {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if ((cursors.up.isDown || cursors.space?.isDown) && (player.body.blocked.down || player.body.touching.down)) {
        player.setVelocityY(-400);
    }
};

function collectCoin(player, coin) {
    const sparkle = player.scene.add.sprite(coin.x, coin.y, 'sparkle');
    sparkle.setScale(2);
    player.scene.time.delayedCall(300, () => sparkle.destroy());
    coin.disableBody(true, true);
    score += 1;
    scoreText.setText('Монеты: ' + score + '/7');
    if (score >= 7) {
        player.scene.add.text(250, 300, 'Уровень пройден!', { fontSize: '32px', fill: '#0f0' });
        player.scene.physics.pause();
        player.setTint(0x00ff00);
    }
}

function hitTrap(player, trap) {
    player.scene.add.text(250, 300, 'Вы погибли!', { fontSize: '32px', fill: '#f00' });
    player.scene.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
}
