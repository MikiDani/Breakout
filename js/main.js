
const log = console.log;

window.globalVar = {}
globalVar.brickTable = []
globalVar.tableX = 4
globalVar.tableY = 24
globalVar.checkPass = true

randomNumber = (min, max) => {
    return  Math.floor(Math.random() * ((max+1) - min) + min);
}

class Objects {
    constructor({name, x, y, objWidth, objHeight, fillType}) {
        this.name = name
        this.x = x
        this.y = y
        this.objWidth = objWidth
        this.objHeight = objHeight
        this.fillType = fillType
    }
}

class Ball extends Objects {
    constructor({name, x, y, objWidth, objHeight, fillType, step}) {
        super({name, x, y, objWidth, objHeight, fillType})
        this.step = step
        this.moveX = this.step
        this.moveY = this.step
        this.img = document.querySelector(`#${name}`)
        if (String(this.img) == 'undefined') {
            throw("Img error! I can't find " + this.name + "!")
        }
        this.imgNaturalWidth = this.img.naturalWidth
        this.imgNaturalHeight = this.img.naturalHeight
    }
}

class Brick extends Objects {
    constructor({name, x, y, objWidth, objHeight, fillType, color, strong, tableX, tableY}) {
        super({name, x, y, objWidth, objHeight, fillType})
        this.color = color
        this.strong = strong
        this.tableX = tableX
        this.tableY = tableY
        this.firstWayX = false
        this.firstWayY = false
    }
}

class Player extends Objects {
    constructor({name, x, y, objWidth, objHeight, fillType, color}) {
        super({name, x, y, objWidth, objHeight, fillType})
        this.color = color
        this.firstWayX = false
        this.firstWayY = false
    }
}

class CanvasClass {
    canvasDiv
    ctx
    ctxBg
    canvasWidth
    canvasHeight
    constructor() {
        this.canvasDiv = document.querySelector('#canvas-div')
        this.canvasBg = document.querySelector('#canvas-bg')

        this.bg01 = document.querySelector("#bg01");
        this.bg01NaturalWidth = this.bg01.naturalWidth
        this.bg01NaturalHeight = this.bg01.naturalHeight
        this.bg01ActualWidth = this.bg01.width
        this.bg01ActualHeight = this.bg01.height

        this.myResizer()
        this.checkContextDiv()  // game arena fill
        this.checkContextBg()   // bg fill

        log(this.canvasWidth, this.canvasHeight)
    }

    checkContextDiv() {
        if (this.canvasDiv.getContext) {
            this.ctx = this.canvasDiv.getContext("2d");
            return;
        }
        throw new Error('getContext arena error!!!');
    }

    checkContextBg() {
        if (this.canvasBg.getContext) {
            this.ctxBg = this.canvasBg.getContext("2d");
            return;
        }
        throw new Error('getContext background error!!!');
    }

    myResizer() {
        this.canvasWidth = (window.innerWidth < 1001) ? window.innerWidth : 1000;

        log(this.canvasWidth)

        this.canvasHeight = (this.canvasWidth * 2)

        $(this.canvasDiv).attr('width', this.canvasWidth);
        $(this.canvasDiv).attr('height', this.canvasHeight);

        $(this.canvasBg).attr('width', this.canvasWidth);
        $(this.canvasBg).attr('height', this.canvasHeight);

        log('width: ' + $(this.canvasDiv).attr('width'))
        log('height: ' + $(this.canvasDiv).attr('height'))
    }

    drawBg() {
        this.ctx.drawImage(this.bg01, 0, 0, this.bg01NaturalWidth, this.bg01NaturalHeight, 0, 0, this.canvasWidth, this.canvasHeight)

        this.ctxBg.drawImage(this.bg01, 0, 0, this.bg01NaturalWidth, this.bg01NaturalHeight, 0, 0, this.canvasWidth, this.canvasHeight)
    }

    drawObj(object) {
        if (object.fillType == 'img') {            
            this.ctx.drawImage(object.img, 0, 0, object.imgNaturalWidth, object.imgNaturalHeight, object.x, object.y, object.objWidth, object.objHeight);
        }

        if (object.fillType == 'color') {
            this.ctx.fillStyle = object.color;
            this.ctx.fillRect(object.x, object.y, object.objWidth, object.objHeight);
        }

        if (object.name.includes('brick')) {
            log('bent')
            this.ctx.font = "16px Arial";
            this.ctx.fillStyle = "black";
            this.ctx.textAlign = "center";
            this.ctx.fillText(object.strong, object.x + (object.objWidth / 2), object.y + (object.objHeight / 2)+5);
        }
    }

    deleteObj(object) {
        //this.ctx.clearRect(object.x, object.y, object.objWidth, object.objHeight);

        log(object.x, object.y, Math.floor(object.objWidth), Math.ceil(object.objHeight))

        //game.stop()

        this.ctx.drawImage(this.canvasBg, object.x, object.y, object.objWidth, object.objHeight, object.x, object.y, object.objWidth, object.objHeight)
    }
}

class Game {
    constructor() {
        globalVar.n = 0
        this.refreshTime = 25
        this.infoDiv = $("#info-div")
        this.phase = true
        this.soundSwitch = true

        this.soundLoad()

        this.myAddEventListeners()

        canvasObj.drawBg()

        canvasObj.drawObj(player)
        canvasObj.drawObj(ball)

        this.drawBricks()
    }
    
    soundLoad() {
        let audioElements = [ 
            { id: "ball1", src: "sounds/ball1.mp3" },
            { id: "ball2", src: "sounds/ball2.mp3" },
        ];
    
        for (let attribute of audioElements) {
            let audio = document.createElement('audio');
            for (let key in attribute) {
                audio.setAttribute(key, attribute[key]);
            }
            document.getElementById("audios").appendChild(audio);
        }
    }
    
    playAudio(soundname) {
        if (this.soundSwitch==true) {
            document.getElementById(soundname).play();
        }
    }


    myAddEventListeners() {

        let clone = this

        $('#button-div').on('click', function() {
            // start repeat
            clone.start()
        })

        document.addEventListener('keydown', function(event) {
            if (event.key == "e") {
                log('STOP')
                clone.stop()
            }

            if (event.key == "r") {
                if (typeof globalVar.clockObj == 'undefined') {
                    log('START')
                    clone.start(clone)
                }
            }

            // UP
            if (event.keyCode == 40) {                
                if (player.y + player.objHeight < canvasObj.canvasHeight) {
                    canvasObj.deleteObj(player)
                    player.y = player.y + player.step
                    canvasObj.drawObj(player)
                }
            }
            
            // DOWN
            if (event.keyCode == 38) {
                if (player.y > 0) {
                    canvasObj.deleteObj(player)
                    player.y = player.y - player.step
                    canvasObj.drawObj(player)
                }
            }
        });
    }

    ballMapEdgeController() {
        if (ball.x > canvasObj.canvasWidth - ball.objWidth) {
            ball.moveX = -ball.step
            this.playAudio('ball1')
        }
        
        if (ball.x < 0) {
            ball.moveX = ball.step
            this.playAudio('ball2')
        }
        
        if (ball.y > canvasObj.canvasHeight - ball.objHeight) {
            ball.moveY = -ball.step
            this.playAudio('ball1')
        }
        
        if (ball.y < 0) {
            ball.moveY = ball.step
            this.playAudio('ball2')
        }

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
        globalVar.clockObj = setInterval(this.repeat, this.refreshTime)
    }

    stop() {
        clearInterval(globalVar.clockObj)
        delete globalVar.clockObj
    }

    brickCheck(brick) {
        let nowX = false
        let nowY = false

        if (this.checkX(ball, brick)) {
            if (brick.firstWayX == false) {
                brick.firstWayX = true
                nowX = true
            }
        } else {
            brick.firstWayX = false
        }
        
        if (this.checkY(ball, brick)) {
            if (brick.firstWayY == false) {
                brick.firstWayY = true
                nowY = true
            }
        } else {
            brick.firstWayY = false
        }

        if (this.checkY(ball, brick) && this.checkX(ball, brick)) {

            brick.firstWayX = false
            brick.firstWayY = false

            let rand = randomNumber(0, 1)

            rand ? this.playAudio('ball1') : this.playAudio('ball2');

            log(brick.strong)

            brick.strong--

            if (brick.strong <= 0) {
                canvasObj.deleteObj(brick)
                globalVar.brickTable[brick.tableX][brick.tableY] = null
            } else {
                canvasObj.drawObj(brick)
            }

            //this.stop()

            if (nowX == true) { ball.moveX = -ball.moveX }
            if (nowY == true) { ball.moveY = -ball.moveY }

            globalVar.checkPass = false

        }
    }

    speedCount() {
        if (this.phase == true) {
            if (this.refreshTime<=200) {
                this.refreshTime++
            } else {
                this.refreshTime--
                this.phase = false
            }
        } else if (this.phase == false) {
            if (this.refreshTime>=10) {
                this.refreshTime--
            } else {
                this.refreshTime++
                this.phase = true
            }
        }
        log(this.refreshTime)
    }

    drawBricks() {
        for(var n = 0; n < globalVar.tableX; n++) {
            for(var m = 0; m < globalVar.tableY; m++) {
                if (globalVar.brickTable[n][m] != null) {
                    canvasObj.drawObj(globalVar.brickTable[n][m])
                }
            }
        }
    }

    repeat = () => {
        $("#info-div").html(globalVar.n)

        canvasObj.deleteObj(ball)

        for(var n = 0; n < globalVar.tableX; n++) {
            for(var m = 0; m < globalVar.tableY; m++) {
                if (globalVar.checkPass) {
                    if (globalVar.brickTable[n][m] != null) {
                        this.brickCheck(globalVar.brickTable[n][m])
                    }
                }
            }
        }

        globalVar.checkPass = true
        
        this.ballMapEdgeController()

        globalVar.n++

        canvasObj.drawObj(ball)

        //this.speedCount()
    }
}

function createBrickTable() {

    globalVar.brickTable = new Array(globalVar.tableX);
    for (var i = 0; i < globalVar.brickTable.length; i++) {
        globalVar.brickTable[i] = new Array(globalVar.tableY);
    }
    
    for(var n = 0; n < globalVar.tableX; n++) {
        for(var m = 0; m < globalVar.tableY; m++) {

            let randomColor = randomNumber(0,1)
            let brickColor
            let brickStrong
            if (randomColor == 0) { brickColor = 'green'; brickStrong = 1 }
            if (randomColor == 1) { brickColor = 'blue'; brickStrong = 2 }
            if (randomColor == 2) { brickColor = 'purple'; brickStrong = 3 }
            if (randomColor == 3) { brickColor = 'yellow'; brickStrong = 4 }
            if (randomColor == 4) { brickColor = 'red'; brickStrong = 5 }

            globalVar.brickTable[n][m] = new Brick({
                name: 'brick[' + n + '][' + m + ']',
                x: Math.floor((canvasObj.canvasWidth / globalVar.tableX) * n),
                y: Math.ceil((canvasObj.canvasWidth / 16) * m),
                objWidth:  Math.floor((canvasObj.canvasWidth / globalVar.tableX)),
                objHeight: Math.ceil((canvasObj.canvasWidth / 16)),
                fillType: 'color',
                color: brickColor,
                strong: brickStrong,
                tableX: n,
                tableY: m,
            });
            log(globalVar.brickTable[n][m].objWidth)
            log(globalVar.brickTable[n][m].objHeight)
            log(globalVar.brickTable[n][m].x)
            log(globalVar.brickTable[n][m].y)
        }
    }
    
    console.log(globalVar.brickTable);
}

///////////
// START //
///////////

var canvasObj = new CanvasClass()

const ball = new Ball({
    name: 'ball',
    x: 100,
    y: 800,
    objWidth: (canvasObj.canvasWidth / 10),
    objHeight: (canvasObj.canvasWidth / 10),
    fillType: 'img',
    step: 5
})

let playerThick = 15
let playerLong = 100
let playerSpace = 25

const player = new Player({
    name: 'player',
    color: 'orange',
    x: playerSpace,
    y: (canvasObj.canvasHeight / 2) - (playerLong / 2),
    objWidth: playerThick,
    objHeight: playerLong,
    fillType: 'color',
    step: 10
})

createBrickTable()

const game = new Game()

$(window).on("resize", function() { 
    canvasObj = new CanvasClass()

    delete window.player;
    delete window.brick;

    canvasObj.drawBg()

    canvasObj.drawObj(player)

    game.drawBricks()
});