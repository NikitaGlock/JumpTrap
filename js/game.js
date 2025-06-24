
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1d1d1d',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;

function preload() {
    this.load.setBaseURL('.');
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
}

function create() {
    player = this.add.image(400, 300, 'player');
}

function update() {}

const game = new Phaser.Game(config);
