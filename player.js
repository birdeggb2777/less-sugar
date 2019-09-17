class Player {
    constructor({ size, position, action }) {
        this.size = size;
        this.position = position;
        this.action = action;
    }
}
const oPlayer = new Player({
    size: { w: 100, h: 100 },
    position: { x: 50, y: 600 },
    action: {
        move: { right: false, left: false, up: false, down: false, autoDown: 0.5 }
    }
});
/**
 * 
 * @param {String} direction 
 * @param {Number} speed 
 * @example //not use function handlePlayerMove yet
 */
function handlePlayerMove({ direction, speed }) {
    let { move } = oPlayer.action;
    if (!speed) { //沒有速度時，該方向由移動轉靜止
        move = {...move, direction: false };
        return;
    }
    if (move[direction] === true) { //有速度而且已經在移動中
        return;
    };
    //沒有在移動但是有速度，讓他從靜止轉為移動
    move = {...move, direction: true };
}