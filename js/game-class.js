const log = console.log;

import {Objects, Ball, Player, Gift} from './basic-class.js';

export default class Game {
    constructor(canvasObj, brickTable) {
        this.canvasObj = canvasObj
        this.brickTable = brickTable
        this.clockObj = null
        this.menuSwitch = true
        this.soundSwitch = false
        this.refreshTime = 20
        this.lifes = 3
        this.score = 0
        this.randomBallVar = 0
        this.lastway = null
        this.phase = true
        this.stoping = false
        this.mouseClickDown = false
        this.giftArray = []
        this.giftActiveSticky = false
        this.giftActiveLength = false

        this.ball = new Ball({
            name: 'ball',
            objWidth: Math.ceil((this.canvasObj.canvasWidth / 20)),
            objHeight: Math.ceil((this.canvasObj.canvasWidth / 20)),
            x: Math.ceil((this.canvasObj.canvasWidth / 2) - (this.canvasObj.canvasWidth / 20)),
            y: Math.ceil(this.canvasObj.canvasHeight - (2 * (this.canvasObj.canvasWidth / 20))),
            fillType: 'img',
            step: 3
        })
        
        let playerThick = Math.ceil((this.canvasObj.canvasHeight / 40))
        let playerSpace = Math.ceil((this.canvasObj.canvasHeight / 25))
        let playerLong = Math.ceil((this.canvasObj.canvasWidth / 6))
        
        this.player = new Player({
            name: 'player',
            color: 'orange',
            x: (this.canvasObj.canvasWidth / 2) - (playerLong / 2),
            y: (this.canvasObj.canvasHeight) - (playerSpace + playerThick),
            objWidth: playerLong,
            objHeight: playerThick,
            fillType: 'color',
            step: 5
        })

        this.playerStep = this.player.step
        this.upper = (this.player.step * 4)

        this.soundLoad()

        this.myAddEventListeners()

        this.canvasObj.drawBg()

        this.canvasObj.drawObj(this.player)

        this.canvasObj.drawObj(this.ball)

        this.soundIconDraw()

        this.lifeDraw()

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
            { id: "fart", src: "sounds/fart.mp3" },
            { id: "boom", src: "sounds/boom.mp3" },
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

    soundIconDraw() {
        if (this.soundSwitch) {
            $('#volume-icon img').attr('src', 'images/sound_icon-on.svg')
        } else {
            $('#volume-icon img').attr('src', 'images/sound_icon-off.svg')
        }
    }

    lifeDraw() {
        $('#life').text(this.lifes)
    }
    
    myAddEventListeners() {
        let clone = this

        $('#button-start').on('click', function() {
            clone.menuSwitch = false
            $('#display-menu').hide()
            $('#display-game').show()
            // start repeat
            clone.start()
        })

        $('#volume-icon').on('click', function() {
            clone.soundSwitch = !clone.soundSwitch

            clone.soundIconDraw()
        })

        // BUTTON VAR-s        
        $(document).on('keydown', {'clone': clone}, function(event) {

            var clone = event.data.clone

            if (event.key == 'Enter') {
                log('ENTER')
                if (clone.menuSwitch) {
                   clone.gameMode(clone)
                }
            }
            
            if (event.key == 'Escape') {
                log('Escape')
                clone.stoping = false
                clone.lastway = null
                if (clone.menuSwitch) {
                    clone.menuSwitch = false
                    clone.gameMode(clone)
                } else {
                    clone.menuSwitch = true
                    clone.menuMode(clone)
                }
            }

            if (event.key == "e") {
                log('STOP')
                clone.stop()
            }

            if (event.key == "i") {
                log('GIFT array:')
                log(clone.giftArray)
            }

            if (event.key == "r") {
                if (typeof this.clockObj == 'undefined') {
                    log('START')
                    clone.start(clone)
                }
            }

            // Game actions
            if (clone.menuSwitch == false) {
                
                // LEFT
                if (event.keyCode == 37) {
                    log('LEFT');
                    clone.playerLeft(clone.upper)
                    clone.lastway = 'left'
                }
                
                // RIGHT
                if (event.keyCode == 39) {    
                    log('right');
                    clone.playerRight(clone.upper)
                    clone.canvasObj.drawObj(clone.player)
                    clone.lastway = 'right'
                }
                   
                // DOWN
                if (event.keyCode == 40 ) {                
                    clone.canvasObj.deleteObj(clone.player)
                    clone.player.y = clone.player.y + clone.player.step
                    clone.checkCrash(clone.player, true)
                    clone.canvasObj.drawObj(clone.player)
                }
                
                // UP
                if (event.keyCode == 38 ) {
                    clone.canvasObj.deleteObj(clone.player)
                    clone.player.y = clone.player.y - clone.player.step
                    clone.checkCrash(clone.player, true)
                    clone.canvasObj.drawObj(clone.player)
                }

                // HITTING SLIDE
                $(document).on('keyup', {'clone': clone}, function() {                   
                    clone.stoping = clone.upper
                    clone.upper = clone.playerStep * 4
                });
            
            clone.upper = clone.upper + clone.playerStep
            }
        });

        // MOUSE USE IN GAME
        $('#canvas-div').on('mousedown', {'clone': clone}, function(event) {
            let clone = event.data.clone
            let posX = event.pageX

            const canvPos = document.getElementById('canvas-div').getBoundingClientRect();

            let rPosX = (posX - canvPos.left) 

            //log((clone.player.objWidth / 2)); log(rPosX) 

            clone.mouseClickDown = (posX >= $(document).width() / 2) ? ['right', rPosX] : ['left', rPosX];
        });

        $('#canvas-div').on('mouseup', {'clone': clone}, function(event) {
            let clone = event.data.clone
            clone.mouseClickDown = false
            clone.upper = 0
        });
        
        // SCREEN USE IN MOBIL
        $('#canvas-div').on('touchstart', {'clone': clone}, function(event) {
            let clone = event.data.clone
            let touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
            let posX = touch.pageX
            clone.mouseClickDown = (posX >= $(document).width() / 2) ? 'right' : 'left';
        });
        
        $('#canvas-div').on('touchend', {'clone': clone}, function(event) {
            let clone = event.data.clone
            clone.mouseClickDown = false
            clone.upper = 0
        });
    }

    playerLeft(upper) {
        this.canvasObj.deleteObj(this.player)
        if (this.player.x > upper) {
            this.player.x = this.player.x - upper
        } else {
            this.player.x = 0
            this.mouseClickDown = false
            this.upper = 0
            this.playAudio('wall')
        }
        this.checkCrash(this.player, true)
        this.canvasObj.drawObj(this.player)
    }

    playerRight(upper) {
        this.canvasObj.deleteObj(this.player)       
        if ((this.player.x + this.player.objWidth + upper) < this.canvasObj.canvasWidth) {
            this.player.x = this.player.x + upper                    
        } else {
            this.player.x = this.canvasObj.canvasWidth - this.player.objWidth
            this.mouseClickDown = false
            this.upper = 0
            this.playAudio('wall')
        }
        this.checkCrash(this.player, true)
        this.canvasObj.drawObj(this.player)
    }

    gameMode(clone) {
        this.menuSwitch = false
        $('#display-menu').hide()
        $('#display-game').show()
        // start repeat
        clone.start()
        clone.playAudio('menu1')
    }

    menuMode(clone) {
        this.menuSwitch = true
        $('#display-menu').show()
        $('#display-game').hide()
        // start repeat
        clone.stop()
        clone.playAudio('menu2')
    }

    ballMapEdgeController() {
        let rand = this.brickTable.randomNumber(0, this.randomBallVar)
        let modifyValue = this.ball.step + rand

        if (this.ball.x > this.canvasObj.canvasWidth - this.ball.objWidth) {
            this.ball.moveX = -modifyValue
            this.playAudio('ball1')
        }
        
        if (this.ball.x < 0) {
            this.ball.moveX = modifyValue
            this.playAudio('ball2')
        }
        
        if (this.ball.y > this.canvasObj.canvasHeight - this.ball.objHeight) {
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
        this.clockObj = setInterval(this.repeat, this.refreshTime)
    }

    stop() {
        clearInterval(this.clockObj)
        delete this.clockObj
    }

    checkCrash(object, playerMove) {
        let nowX = false
        let nowY = false

        if (this.checkX(this.ball, object)) {
            if (object.firstWayX == false) {
                object.firstWayX = true
                nowX = true
            }
        } else {
            object.firstWayX = false
        }
        
        if (this.checkY(this.ball, object)) {
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

            let rand = this.brickTable.randomNumber(0, this.randomBallVar)

            rand ? this.playAudio('ball1') : this.playAudio('ball2');

            // Tégla esetén
            if (object.name == 'brick' || object.name == 'expbrick') {

                if (nowX == true && nowY == true) { // sarok nem ér
                    this.playAudio('fart');
                    //this.stop()
                } else {
                    object.strong = object.strong - 1;  
                }
    
                if (object.strong <= 0) {
                    if (object.name == 'expbrick') {
                        // EXP BRICK
                        if (object.expActive == false) { this.playAudio('boom') }
                        this.brickTable.brickTable[object.tableX][object.tableY].expActive = true
                        this.brickTable.expNeighbours(object)
                    } else {
                        // NORMAL BRICK
                        this.canvasObj.deleteObj(object)

                        clearInterval(window.scoreAnim);
                        
                        this.score = this.score + object.score
                        
                        $('#score').html('<strong>' + this.score + '</strong>')
                        
                        $('#score').addClass('animated-score')
                        
                        window.scoreAnim = setInterval(() => {
                            $('#score').removeClass('animated-score')
                        }, 500);
                        
                        // GIFT
                        if (object.gift) {
                            log('Van gift!' + object.gift);
                            this.playAudio('gift')

                            this.giftArray.push(new Gift({
                                name: object.gift,
                                fillType: 'img',
                                x: object.x + ((object.objWidth) - (object.objWidth / 2) - (object.objHeight / 2)),
                                y: object.y,
                                objWidth: object.objHeight,
                                objHeight: object.objHeight,
                                step: this.ball.step
                            }))
                        }

                        this.brickTable.brickTable[object.tableX][object.tableY] = null
                        this.playAudio('pop')
                    }
                } else {
                    this.canvasObj.drawObj(object)
                }
            }

            let plussRandomMove = this.brickTable.randomNumber(0, this.randomBallVar)    // Igy nam lesz jó talán
               
            if (nowX == true) { 
                this.ball.moveX = -this.ball.moveX + plussRandomMove;
                this.ball.x = this.ball.x + this.ball.moveX
            }

            if (nowY == true) {
                this.ball.moveY = -this.ball.moveY + plussRandomMove;
                this.ball.y = this.ball.y + this.ball.moveY
            }

            this.brickTable.checkPass = false

            if (playerMove) {

                this.canvasObj.deleteObj(this.ball)

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

                    if ((this.canvasObj.canvasWidth - this.ball.objWidth) >= (newCordinateX)) {
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

                this.canvasObj.drawObj(this.ball)
            }
        }
    }

    expAnim(object) {
        if(object.name == 'expbrick') {
            if(object.expActive) {
                if (this.brickTable.brickTable[object.tableX][object.tableY].expTime <= 0) {
                    this.canvasObj.deleteObj(object)
                    this.brickTable.brickTable[object.tableX][object.tableY] = null
                } else {
                    this.canvasObj.drawObj(object)
                    this.brickTable.brickTable[object.tableX][object.tableY].expTime--
                }
            }
        }
    }

    checkPlus(value) {
        if (value >= 0)
            return true;
        return false;
    }

    checkMinus(value) {
        if (value < 0)
            return true;
        return false;
    }

    checkNull(value) {
        if (value == null)
            return true;
        return false;
    }

    drawBricks() {
        for (var n = 0; n < this.brickTable.fantomX; n++) {
            for (var m = 0; m < this.brickTable.fantomY; m++) {
                if (n == 0 || m == 0 || n == this.fantomX-1 || m == this.fantomY-1) {
                } else {
                    if (this.brickTable.brickTable[n][m] != null) {
                        this.canvasObj.drawObj(this.brickTable.brickTable[n][m])
                    }
                }
            }
        }
    }

    checkPickUp(gift, giftRow) {
        if (this.checkY(gift, this.player) && this.checkX(gift, this.player)) {
            this.playAudio('pick1')
            this.canvasObj.deleteObj(gift)
            this.canvasObj.drawObj(this.player)

            if (gift.name == 'life') { 
                this.lifes++
                this.lifeDraw()
            }

            if (gift.name == 'sticky') { this.giftActiveSticky = true }
            if (gift.name == 'length') { this.giftActiveLength = true }
            this.giftArray.splice(giftRow, 1);
        }
    }

    repeat = () => {
        this.canvasObj.deleteObj(this.ball)

        for (var n = 0; n < this.brickTable.fantomX; n++) {
            for (var m = 0; m < this.brickTable.fantomY; m++) {
                if (this.brickTable.checkPass) {
                    if (n != 0 || m != 0 || n != this.fantomX-1 || m != this.fantomY-1) {

                        if (this.brickTable.brickTable[n][m] != null)
                            this.expAnim(this.brickTable.brickTable[n][m])

                        if (this.brickTable.brickTable[n][m] != null) {

                            this.canvasObj.drawObj(this.brickTable.brickTable[n][m])    // Biztos csak így lehet ? !!!

                            let expActive = this.brickTable.brickTable[n][m].expActive

                            if (typeof expActive == 'undefined' || expActive == false) {
                                this.checkCrash(this.brickTable.brickTable[n][m])
                            }
                        }
                    }
                }
            }
        }

        //GIFTS
        var giftRow = 0;
        this.giftArray.forEach(element => {
            //log(element)

            log('this.canvasObj.objHeight: ' + this.canvasObj.canvasHeight)
            log('element.y' + element.y)

            this.checkPickUp(element, giftRow)

            this.canvasObj.deleteObj(element)
            element.y = element.y + element.step
            if (element.y > this.canvasObj.canvasHeight)
            {
                this.giftArray.splice(giftRow, 1);
            } else {
                this.canvasObj.drawObj(element)
            }
            giftRow++
        });
        
        // KEYBOARD STOPPING
        if (typeof this.stoping === 'number') {
            if (this.lastway == 'left') {
                this.playerLeft(this.stoping)
            } else if (this.lastway == 'right') {
                this.playerRight(this.stoping)
            }

            this.stoping = this.stoping / 2
            
            this.stoping = (Math.floor(this.stoping < 5)) ? false : this.stoping;

            if (this.stoping == false)
                this.lastway = null
        }

        // MOUSE/MOBIL STOPPING
        if (this.mouseClickDown !== false) {

            let position = this.mouseClickDown[1] - (this.player.objWidth / 2)
            
            if (this.mouseClickDown[0] == 'right') {                
                if (this.player.x < position) {
                    this.playerRight(this.upper)
                    this.canvasObj.drawObj(this.player)
                    this.upper = this.upper + this.playerStep
                }
                
            } else if (this.mouseClickDown[0] == 'left') {
                if (this.player.x > position) {
                    this.playerLeft(this.upper)
                    this.canvasObj.drawObj(this.player)
                    this.upper = this.upper + this.playerStep
                }
            }
        }

        this.checkCrash(this.player)

        this.canvasObj.drawObj(this.player)   // Máshogy lehet?

        this.brickTable.checkPass = true
        
        this.ballMapEdgeController()

        this.ballMove()

        this.canvasObj.drawObj(this.ball)

        //this.speedCount()
    }
}