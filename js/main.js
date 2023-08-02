const log = console.log;

window.myVar = {}

class Objects {
    constructor({type, name, color, x, y, objWidth, objHeight, step}) {
        this.name = name
        this.type = type
        this.x = x
        this.y = y
        this.step = step
        this.moveX = this.step
        this.moveY = this.step
        this.objWidth = objWidth
        this.objHeight = objHeight
        
        if (this.type == 'img') {
            this.img = document.querySelector(`#${name}`)
            if (String(this.img) == 'undefined') {
                throw("Img error! I can't find " + this.name + "!")
            }
            this.imgNaturalWidth = this.img.naturalWidth
            this.imgNaturalHeight = this.img.naturalHeight
        }
        
        if (this.type == 'rect') {
            this.color = color
        }
    }
}

class CanvasClass {
    canvasDiv
    ctx
    canvasWidth
    canvasHeight
    constructor() {
        this.canvasDiv = document.querySelector('#canvas-div')
        this.img1 = document.querySelector("#img1");
        this.ball = document.querySelector("#ball");
        this.myResizer()
        this.checkContext()
    }

    checkContext() {
        if (this.canvasDiv.getContext) {
            this.ctx = this.canvasDiv.getContext("2d");
            return;
        }
        throw new Error('getContext error!!!');
    }

    myResizer() {
        this.canvasWidth = window.innerWidth
        this.canvasHeight = window.innerHeight-200

        //let bigger = (this.canvasWidth>this.canvasHeight) ? this.canvasHeight : this.canvasWidth;

        $(this.canvasDiv).attr('width', this.canvasWidth);
        $(this.canvasDiv).attr('height', this.canvasHeight);

        log('width: ' + $(this.canvasDiv).attr('width'))
        log('height: ' + $(this.canvasDiv).attr('height'))
    }

    drawObj(object) {
        if (object.type == 'img') {
            //this.ctx.rotate(myVar.n);

            this.ctx.save();
            //this.ctx.rotate(1); // rotate
            
            this.ctx.drawImage(object.img, 0, 0, object.imgNaturalWidth, object.imgNaturalHeight, object.x, object.y, object.objWidth, object.objHeight);

            this.ctx.restore(); // restore original states (no rotation etc)
        }

        if (object.type=='rect') {
            this.ctx.fillStyle = object.color;
            this.ctx.fillRect(object.x, object.y, object.objWidth, object.objHeight);
        }
    }

    deleteObj(object) {
        this.ctx.clearRect(object.x, object.y, object.objWidth, object.objHeight);
    }
}

class Game {
    constructor() {
        this.refreshTime = 30

        myVar.n = 0
        this.infoDiv = $("#info-div")

        this.myAddEventListeners()

        canvasObj.drawObj(leftPlayer)
        canvasObj.drawObj(rightPlayer)
        canvasObj.drawObj(brick)

        // start repeat
        this.start(this)
    }

    myAddEventListeners() {
        let clone = this
        document.addEventListener('keydown', function(event) {
            if (event.key == "e") {
                log('STOP')
                clone.stop()
            }

            if (event.key == "r") {
                log(typeof myVar.clockObj)
                if (typeof myVar.clockObj == 'undefined') {
                    log('START')
                    clone.start(clone)
                }
            }

            if (event.key == "a") {
                if (leftPlayer.y + leftPlayer.objHeight < canvasObj.canvasHeight) {
                    canvasObj.deleteObj(leftPlayer)
                    leftPlayer.y = leftPlayer.y + leftPlayer.step
                    canvasObj.drawObj(leftPlayer)
                }
            }

            if (event.key == "q") {
                if (leftPlayer.y > 0) {
                    canvasObj.deleteObj(leftPlayer)
                    leftPlayer.y = leftPlayer.y - leftPlayer.step
                    canvasObj.drawObj(leftPlayer)
                }
            }

            // UP
            if (event.keyCode == 40) {
                if (rightPlayer.y + rightPlayer.objHeight < canvasObj.canvasHeight) {
                    canvasObj.deleteObj(rightPlayer)
                    rightPlayer.y = rightPlayer.y + rightPlayer.step
                    canvasObj.drawObj(rightPlayer)
                }
            }

            // DOWN
            if (event.keyCode == 38) {
                if (rightPlayer.y > 0) {
                    canvasObj.deleteObj(rightPlayer)
                    rightPlayer.y = rightPlayer.y - rightPlayer.step
                    canvasObj.drawObj(rightPlayer)
                }
            }
        });
    }

    ballController() {
        if (ball.x > canvasObj.canvasWidth - ball.objWidth)
            ball.moveX = -ball.step
            
        if (ball.x < 0)
            ball.moveX = ball.step

        if (ball.y > canvasObj.canvasHeight - ball.objHeight)
            ball.moveY = -ball.step

        if (ball.y < 0)
            ball.moveY = ball.step

        ball.x = ball.x + ball.moveX
        ball.y = ball.y + ball.moveY
    }

    checkX(objA, objB){
        if ((objA.x >= objB.x && objA.x <= objB.x + objB.objWidth) || (objA.x + objA.objWidth >= objB.x && objA.x + objA.objWidth <= objB.x + objB.objWidth)) {
            return true
        }
        return false
    }

    checkY(objA, objB){
        if ((objA.y >= objB.y && objA.y <= objB.y + objB.objHeight) || (objA.y + objA.objHeight >= objB.y && objA.y + objA.objHeight <= objB.y + objB.objHeight)) {
            return true
        }
        return false
    }

    start() {
        myVar.clockObj = setInterval(this.repeat, this.refreshTime)
    }

    stop() {
        clearInterval(myVar.clockObj)
        delete myVar.clockObj
    }

    repeat = () => {
        $("#info-div").html(myVar.n)

        canvasObj.deleteObj(ball)

        if (this.checkY(ball, brick) && this.checkX(ball, brick)) {
            this.stop()
            canvasObj.drawObj(ball)
        }

        this.ballController()

        myVar.n++

        canvasObj.drawObj(ball)
    }
}

///////////
// START //
///////////

var canvasObj = new CanvasClass()

const ball = new Objects({
    type: 'img',
    name: 'ball',
    x: 0,
    y: 0,
    objWidth: 50,
    objHeight: 50,
    step: 5
})

let playerThick = 15
let playerLong = 100
let playerSpace = 25

const leftPlayer = new Objects({
    type: 'rect',
    name: 'left',
    color: 'orange',
    x: playerSpace,
    y: (canvasObj.canvasHeight / 2) - (playerLong / 2),
    objWidth: playerThick,
    objHeight: playerLong,
    step: 10
})

const rightPlayer = new Objects({
    type: 'rect',
    name: 'left',
    color: 'purple',
    x: canvasObj.canvasWidth - playerThick - playerSpace,
    y: (canvasObj.canvasHeight / 2) - (playerLong / 2),
    objWidth: playerThick,
    objHeight: playerLong,
    step: 10
})

const brick = new Objects({
    type: 'rect',
    name: 'left',
    color: 'red',
    x: (canvasObj.canvasWidth / 3),
    y: (canvasObj.canvasHeight / 3),
    // objWidth: 160,
    objHeight: 60,
    step: 10
})

const game = new Game()

$(window).on("resize", function() { 
    canvasObj = new CanvasClass()

    delete window.leftPlayer;
    delete window.rightPlayer;
    delete window.brick;

    canvasObj.drawObj(leftPlayer)
    canvasObj.drawObj(rightPlayer)
    canvasObj.drawObj(brick)
});