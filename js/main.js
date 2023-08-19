const log = console.log;

window.globalVar = {}
globalVar.brickTable = []
globalVar.tableX = 8
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
    constructor({name, x, y, objWidth, objHeight, fillType, color, step}) {
        super({name, x, y, objWidth, objHeight, fillType})
        this.color = color
        this.step = step
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
        $('#front-menu').css('width', window.innerWidth)
        $('#front-menu').css('height', window.innerHeight)

        this.canvasWidth = (window.innerWidth < 1001) ? window.innerWidth : 1000;        
        this.canvasHeight = (this.canvasWidth * 2)

        log('this.canvasWidth')
        log(this.canvasWidth)
        log('this.canvasHeight')
        log(this.canvasHeight)

        $(this.canvasDiv).attr('width', this.canvasWidth);
        $(this.canvasDiv).attr('height', this.canvasHeight);

        $(this.canvasBg).attr('width', this.canvasWidth);
        $(this.canvasBg).attr('height', this.canvasHeight);

        log('width: ' + $(this.canvasDiv).attr('width'))
        log('height: ' + $(this.canvasDiv).attr('height'))

        window.mobileCheckResize()
    }

    drawBg() {
        this.ctx.drawImage(this.bg01, 0, 0, this.bg01NaturalWidth, this.bg01NaturalHeight, 0, 0, this.canvasWidth, this.canvasHeight)

        this.ctxBg.drawImage(this.bg01, 0, 0, this.bg01NaturalWidth, this.bg01NaturalHeight, 0, 0, this.canvasWidth, this.canvasHeight)
    }

    drawObj(object) {
        if (object.fillType == 'img') {            
            this.ctx.drawImage(object.img, 0, 0, object.imgNaturalWidth, object.imgNaturalHeight, object.x, object.y, object.objWidth, object.objHeight)
        }

        if (object.fillType == 'color') {
            this.ctx.fillStyle = object.color
            this.ctx.fillRect(object.x, object.y, object.objWidth, object.objHeight)
        }

        if (object.name.includes('brick')) {
            this.ctx.font = "16px Impact"
            this.ctx.fillStyle = "black"
            this.ctx.textAlign = "center"
            this.ctx.fillText(object.strong, object.x + (object.objWidth / 2), object.y + (object.objHeight / 2)+5)
        }
    }

    deleteObj(object) {
        //this.ctx.clearRect(object.x, object.y, object.objWidth, object.objHeight);
               
        this.ctx.drawImage(this.canvasBg, object.x, object.y, object.objWidth, object.objHeight, object.x, object.y, object.objWidth, object.objHeight);

    }
}

class Game {
    constructor() {
        globalVar.n = 0
        globalVar.menuSwitch = true
        this.refreshTime = 10
        this.infoDiv = $("#info-div")
        this.phase = true
        this.soundSwitch = false

        this.ball = new Ball({
            name: 'ball',
            objWidth: Math.ceil((canvasObj.canvasWidth / 20)),
            objHeight: Math.ceil((canvasObj.canvasWidth / 20)),
            x: Math.ceil((canvasObj.canvasWidth / 2)-(canvasObj.canvasWidth / 20)),
            y: Math.ceil(canvasObj.canvasHeight - (2*(canvasObj.canvasWidth / 20))),
            fillType: 'img',
            step: 3
        })

        log(semmi)

        //log(this.ball)
        log(this.ball.x)
        log(this.ball.y)
        
        let playerThick = Math.ceil((canvasObj.canvasHeight / 40))
        let playerSpace = Math.ceil((canvasObj.canvasHeight / 25))
        let playerLong = Math.ceil((canvasObj.canvasWidth / 6))
        
        this.player = new Player({
            name: 'player',
            color: 'orange',
            x: (canvasObj.canvasWidth / 2) - (playerLong / 2)-250,
            y: (canvasObj.canvasHeight) - (playerSpace + playerThick),
            objWidth: playerLong,
            objHeight: playerThick,
            fillType: 'color',
            step: 5
        })

        this.soundLoad()

        this.myAddEventListeners()

        canvasObj.drawBg()

        canvasObj.drawObj(this.player)

        canvasObj.drawObj(this.ball)

        this.drawBricks()
    }
    
    soundLoad() {
        let audioElements = [ 
            { id: "ball1", src: "sounds/ball1.mp3" },
            { id: "ball2", src: "sounds/ball2.mp3" },
            { id: "wall", src: "sounds/wall.mp3" },
            { id: "gift", src: "sounds/gift.mp3" },
            { id: "pop", src: "sounds/pop.mp3" },
            { id: "pick1", src: "sounds/pick1.mp3" },
            { id: "pick2", src: "sounds/pick2.mp3" },
            { id: "menu1", src: "sounds/menu1.mp3" },
            { id: "menu2", src: "sounds/menu2.mp3" },
        ];
    
        for  (let attribute of audioElements) {
            let  audio = document.createElement('audio');
            for  (let key in attribute) {
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

        $('#button-start').on('click', function() {
            globalVar.menuSwitch = false
            $('#display-menu').hide()
            $('#display-game').show()
            // start repeat
            clone.start()
        })

        $('#volume-icon').on('click', function() {
            clone.soundSwitch = !clone.soundSwitch
        })

        var playerStep = this.player.step
        var upper = (this.player.step * 4)
        
        $(document).on('keydown', {'clone': clone}, function(event) {

            let clone = event.data.clone

            log('first: ' + upper)

            log('event.key: ' + event.key)

            if (event.key == 'Enter') {
                log('ENTER')
                if (globalVar.menuSwitch) {
                   clone.gameMode(clone)
                }
            }
            
            if (event.key == 'Escape') {
                log('Escape')
                if (globalVar.menuSwitch) {
                    globalVar.menuSwitch = false
                    clone.gameMode(clone)
                } else {
                    globalVar.menuSwitch = true
                    clone.menuMode(clone)
                }
            }

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

            // RIGHT
            if (event.keyCode == 39) {    
                
                log(upper)

                canvasObj.deleteObj(game.player)
                
                if (game.player.x + game.player.objWidth < canvasObj.canvasWidth) {
                    game.player.x = game.player.x + upper                    
                } else {
                    game.player.x = canvasObj.canvasWidth - game.player.objWidth
                    clone.playAudio('wall')
                }

                game.checkCrash(game.player, true)

                canvasObj.drawObj(game.player)
            }
            
            // LEFT
            if (event.keyCode == 37) {

                log(upper)

                canvasObj.deleteObj(game.player)

                if (game.player.x > game.player.step) {
                    game.player.x = game.player.x - upper
                } else {
                    game.player.x = 0
                    clone.playAudio('wall')
                }
                
                game.checkCrash(game.player, true)
                
                canvasObj.drawObj(game.player)
            }

            // DOWN
            if (event.keyCode == 40 ) {                
                canvasObj.deleteObj(game.player)

                game.player.y = game.player.y + game.player.step

                game.checkCrash(game.player, true)

                canvasObj.drawObj(game.player)
            }
            
            // UP
            if (event.keyCode == 38 ) {
                canvasObj.deleteObj(game.player)
                game.player.y = game.player.y - game.player.step

                game.checkCrash(game.player, true)

                canvasObj.drawObj(game.player)
            }

            upper = upper + playerStep
        });
        document.addEventListener('keyup', function(event) {
            upper = playerStep * 4
        });

    }

    gameMode(clone) {
        globalVar.menuSwitch = false
        $('#display-menu').hide()
        $('#display-game').show()
        // start repeat
        clone.start()
        clone.playAudio('menu1')
    }

    menuMode(clone) {
        globalVar.menuSwitch = true
        $('#display-menu').show()
        $('#display-game').hide()
        // start repeat
        clone.stop()
        clone.playAudio('menu2')
    }

    ballMapEdgeController() {
        let rand = randomNumber(0, 1)
        let modifyValue = this.ball.step + rand

        if (this.ball.x > canvasObj.canvasWidth - this.ball.objWidth) {
            this.ball.moveX = -modifyValue
            this.playAudio('ball1')
        }
        
        if (this.ball.x < 0) {
            this.ball.moveX = modifyValue
            this.playAudio('ball2')
        }
        
        if (this.ball.y > canvasObj.canvasHeight - this.ball.objHeight) {
            this.ball.moveY = -modifyValue
            this.playAudio('ball1')
        }
        
        if (this.ball.y < 0) {
            this.ball.moveY = modifyValue
            this.playAudio('ball2')
        }
    }

    ballMove() {

        this.ball.x = this.ball.x + this.ball.moveX
        this.ball.y = this.ball.y + this.ball.moveY
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

    checkCrash(object, playerMove) {
        let nowX = false
        let nowY = false

        if (this.checkX(game.ball, object)) {
            if (object.firstWayX == false) {
                object.firstWayX = true
                nowX = true
            }
        } else {
            object.firstWayX = false
        }
        
        if (this.checkY(game.ball, object)) {
            if (object.firstWayY == false) {
                object.firstWayY = true
                nowY = true
            }
        } else {
            object.firstWayY = false
        }

        // crach
        if (this.checkY(this.ball, object) && this.checkX(this.ball, object)) {

            object.firstWayX = false
            object.firstWayY = false

            let rand = randomNumber(0, 1)

            rand ? this.playAudio('ball1') : this.playAudio('ball2');

            // Tégla esetén
            if (object.name == 'brick') {
                object.strong = (nowX == true && nowY == true) ? object.strong : object.strong - 1;  // sarok nem ér
    
                if (object.strong <= 0) {
                    canvasObj.deleteObj(object)

                    // GIFT

                    globalVar.brickTable[object.tableX][object.tableY] = null
                    this.playAudio('pop')
                } else {
                    canvasObj.drawObj(object)
                }
            }

            let plussRandomMove = randomNumber(0, 1)    // Igy nam lesz jó talán
               
            if (nowX == true) { 
                this.ball.moveX = -this.ball.moveX + plussRandomMove;
                this.ball.x = this.ball.x + this.ball.moveX
            }

            if (nowY == true) {
                this.ball.moveY = -this.ball.moveY + plussRandomMove;
                this.ball.y = this.ball.y + this.ball.moveY
            }

            globalVar.checkPass = false

            if (playerMove) {

                canvasObj.deleteObj(this.ball)

                let xDistance = this.ball.x - object.x
                let xHalfLong = (object.objWidth / 2) - (this.ball.objWidth / 2)
                                
                if (xHalfLong > xDistance) {
                    //log('x elso fele')
                    let newCordinateX = object.x - this.ball.objWidth - 1

                    if (newCordinateX >= 0) {
                        this.ball.x = newCordinateX
                        this.ball.moveX = -this.ball.step
                    }
                } else {
                    //log('x második fele')
                    let newCordinateX = object.x + object.objWidth + 1

                    if ((canvasObj.canvasWidth - this.ball.objWidth) >= (newCordinateX)) {
                        this.ball.x = newCordinateX
                        this.ball.moveX = this.ball.step
                    }
                }

                let yDistance = this.ball.y - object.y
                let yHalfLong = (object.objHeight / 2)

                if (yHalfLong > yDistance) {
                    //log('y elso fele')
                    this.ball.y = object.y - this.ball.objHeight - 1
                    this.ball.moveY = -this.ball.step
                
                } else {
                    //log('y második fele')
                    this.ball.y = object.y + object.objHeight + 1
                    this.ball.moveY = this.ball.step
                }

                canvasObj.drawObj(this.ball)
            }
        }
    }

    // Kell ez ?
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
        for (var n = 0; n < globalVar.tableX; n++) {
            for (var m = 0; m < globalVar.tableY; m++) {
                if (globalVar.brickTable[n][m] != null) {
                    canvasObj.drawObj(globalVar.brickTable[n][m])
                }
            }
        }
    }

    repeat = () => {
        $("#info-div").html(globalVar.n)

        canvasObj.deleteObj(game.ball)

        for (var n = 0; n < globalVar.tableX; n++) {
            for (var m = 0; m < globalVar.tableY; m++) {
                if (globalVar.checkPass) {
                    if (globalVar.brickTable[n][m] != null) {
                        this.checkCrash(globalVar.brickTable[n][m])
                    }
                }
            }
        }
        
        game.checkCrash(game.player)

        //canvasObj.drawObj(game.player)   // Máshogy lehet?

        globalVar.checkPass = true
        
        this.ballMapEdgeController()

        this.ballMove()

        globalVar.n++

        canvasObj.drawObj(game.ball)

        //this.speedCount()
    }
}

function createBrickTable() {
    globalVar.brickTable = new Array(globalVar.tableX);
    for (var i = 0; i < globalVar.brickTable.length; i++) {
        globalVar.brickTable[i] = new Array(globalVar.tableY);
    }
    
    for (var n = 0; n < globalVar.tableX; n++) {
        for (var m = 0; m < globalVar.tableY; m++) {

            let randomColor = randomNumber(0,4)
            let brickColor
            let brickStrong
            if (randomColor == 0) { brickColor = 'green'; brickStrong = 1 }
            if (randomColor == 1) { brickColor = 'blue'; brickStrong = 2 }
            if (randomColor == 2) { brickColor = 'purple'; brickStrong = 1 }
            if (randomColor == 3) { brickColor = 'yellow'; brickStrong = 2 }
            if (randomColor == 4) { brickColor = 'red'; brickStrong = 1 }

            globalVar.brickTable[n][m] = new Brick({
                name: 'brick',
                x: Math.floor((canvasObj.canvasWidth / globalVar.tableX)) * n,
                y: Math.ceil((canvasObj.canvasWidth / 16)) * m,
                objWidth:  Math.floor((canvasObj.canvasWidth / globalVar.tableX)),
                objHeight: Math.ceil((canvasObj.canvasWidth / 16)),
                fillType: 'color',
                color: brickColor,
                strong: brickStrong,
                tableX: n,
                tableY: m,
            });
            /*
            log('---'+ globalVar.brickTable[n][m].name)
            log(globalVar.brickTable[n][m].objWidth)
            log(globalVar.brickTable[n][m].objHeight)
            log(globalVar.brickTable[n][m].x)
            log(globalVar.brickTable[n][m].y)
            log('---');
            */
        }
    }
    
    //console.log(globalVar.brickTable);
}

///////////
// START //
///////////

var semmi = 0

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

window.mobileCheckResize = () => {
    log('mobilcheck:' + window.mobileCheck())
    
    if(window.mobileCheck()) {
        $('#max-display').css('width', '1000');
    } else {
        $('#max-display').css('width', '400');
    }
}

var canvasObj = new CanvasClass()
createBrickTable()
var game = new Game()

$(window).on("resize", function() {

    semmi++

    var canvasObj = new CanvasClass()
    var game = new Game()

    for  (var n = 0; n < globalVar.tableX; n++) {
        for   (var m = 0; m < globalVar.tableY; m++) {
            if  (globalVar.brickTable[n][m] !== null) {
                globalVar.brickTable[n][m].x = Math.floor((canvasObj.canvasWidth / globalVar.tableX)) * n
                globalVar.brickTable[n][m].y = Math.ceil((canvasObj.canvasWidth / 16)) * m
                globalVar.brickTable[n][m].objWidth = Math.floor((canvasObj.canvasWidth / globalVar.tableX))
                globalVar.brickTable[n][m].objHeight = Math.ceil((canvasObj.canvasWidth / 16))
            }
        }
    }

    canvasObj.drawBg()

    canvasObj.drawObj(game.player)

    game.drawBricks()
});