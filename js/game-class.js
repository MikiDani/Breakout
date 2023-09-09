import {Objects, Ball, Player, Gift} from './basic-class.js';
import TableClass from './table-class.js';
import {maps} from './maps.js';

export default class Game {
    constructor(canvasObj, brickTable) {
        this.canvasObj = canvasObj
        this.brickTable = brickTable
        this.gameActive = false
        this.clockObj = null
        this.menuSwitch = true
        this.soundSwitch = true
        this.gameType = 'maps'
        this.refreshTime = 20
        this.lifes = 3
        this.score = 0
        this.randomBallVar = 0
        this.giftTime = 15000
        this.soundLoad()
        this.myAddEventListeners()
        this.reloadMap()
    }

    reloadMap() {
        this.lastway = null
        this.phase = true
        this.stoping = false
        this.mouseClickDown = false
        this.giftArray = []
        this.giftActiveLength = false
        this.lengthIntervalActive = false

        let playerThick = Math.ceil((this.canvasObj.canvasHeight / 40))
        let playerSpace = Math.ceil((this.canvasObj.canvasHeight / 25))
        this.playerLong = Math.ceil((this.canvasObj.canvasWidth / 6))
        
        this.player = new Player({
            name: 'player',
            color: 'orange',
            x: (this.canvasObj.canvasWidth / 2) - (this.playerLong / 2),
            y: (this.canvasObj.canvasHeight) - (playerSpace + playerThick),
            objWidth: this.playerLong,
            objHeight: playerThick,
            fillType: 'color',
            step: 5
        })

        this.playerStep = this.player.step
        this.upper = (this.player.step * 4)

        this.ball = new Ball({
            name: 'ball',
            objWidth: Math.ceil((this.canvasObj.canvasWidth / 20)),
            objHeight: Math.ceil((this.canvasObj.canvasWidth / 20)),
            x: Math.ceil((this.canvasObj.canvasWidth / 2)  - (Math.ceil((this.canvasObj.canvasWidth / 20)) / 2)),
            y: this.player.y - Math.ceil((this.canvasObj.canvasWidth / 20)),
            fillType: 'img',
            step: 3
        })
        
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
            { id: "expired", src: "sounds/expired.mp3" },
            { id: "suction", src: "sounds/suction.mp3" },
            { id: "out", src: "sounds/out.mp3" },
            { id: "start", src: "sounds/start.mp3" },
            { id: "gameover", src: "sounds/gameover.mp3" },
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
        $('#lifes').text(this.lifes)
    }

    checkMenuElements() {
        if (this.gameActive) {
            $('#options').hide()
            $('#button-start').hide()
            $('#button-random').hide()

            $('#button-endgame').show()
            $('#score-box label').html(this.score)
            $('#score-box').show()
        } else {
            $('#options').show()
            $('#button-start').show()
            $('#button-random').show()

            $('#button-endgame').hide()
            $('#score-box label').html(this.score)
            $('#score-box').hide()
        }
    }

    myAddEventListeners() {
        let clone = this
        
        $('.breakin-logo').on('click', function() {
            location.reload()
        });

        $('.button-info').on('click', function() {
            if( $('.menu-first').css('display') == 'none') {
                $('.menu-first').show()
                $('.info-box').hide()
            } else {
                $('.menu-first').hide()
                $('.info-box').show()
            }
        })
        
        $('#button-start').on('click', function() {         
            let speed = $("input[name=speed]:checked").val();
            if (speed != 'undefined' && speed != null)
                clone.refreshTime = speed
            
            clone.soundSwitch = ($('#sound').is(":checked")) ? true : false;

            if(clone.soundSwitch) {
                clone.playAudio('start')
            }

            clone.gameActive = true
            clone.checkMenuElements()
            clone.menuSwitch = false

            $('#display-menu').hide()
            $('#display-game').show()
            // start repeat
            clone.soundIconDraw()
            clone.start()
        })

        $('#button-random').on('click', function() {
            let speed = $("input[name=speed]:checked").val();
            if (speed != 'undefined' && speed != null)
                clone.refreshTime = speed
            
            clone.soundSwitch = ($('#sound').is(":checked")) ? true : false;

            if(clone.soundSwitch) {
                clone.playAudio('start')
            }

            clone.gameActive = true
            clone.checkMenuElements()
                        
            $('#display-menu').hide()
            $('#display-game').show()
            // start repeat
            clone.soundIconDraw()
            
            clone.gameType = 'random'

            clone.nextLevel(true, clone.gameType)

            clone.menuSwitch = false

            clone.start()
        })

        $('#button-endgame').on('click', function() {
            clone.playAudio('gameover')
            clone.gameActive = false
            clone.score = 0
            clone.lifes = 3
            clone.checkMenuElements()

            clone.gameType = 'maps'

            clone.nextLevel(true, clone.gameType)
            clone.menuSwitch = false
        });

        $('#volume-icon').on('click', function() {
            clone.soundSwitch = !clone.soundSwitch
            clone.soundIconDraw()
        })

        // BUTTON VAR-s        
        $(document).on('keydown', {'clone': clone}, function(event) {

            var clone = event.data.clone
            
            if (event.key == 'Escape') {
                clone.stoping = false
                clone.lastway = null
                if (clone.gameActive) {
                    if (clone.menuSwitch) {
                        clone.menuSwitch = false
                        clone.gameMode(clone)
                    } else {
                        clone.menuSwitch = true
                        clone.menuMode(clone)
                    }
                }
            }

            // Game actions
            if (clone.menuSwitch == false && clone.lifes >= 0) {
                
                // LEFT
                if (event.keyCode == 37) {
                    clone.playerLeft(clone.upper)
                    clone.lastway = 'left'
                }
                
                // RIGHT
                if (event.keyCode == 39) {    
                    clone.playerRight(clone.upper)
                    clone.canvasObj.drawObj(clone.player)
                    clone.lastway = 'right'
                }

                if (event.keyCode == 32 ) {
                    if (clone.player.stickyActive.catch == true) {
                        clone.canvasObj.deleteObj(clone.ball)
                        clone.ball.moveY = -clone.ball.step
                        clone.ball.y = clone.ball.y + clone.ball.moveY
                        
                        clone.player.stickyActive.catch = false
                        clone.player.stickyActive.sound = true

                        clone.player.stickyActive.piece--

                        if (clone.player.stickyActive.piece <= 0) {
                            clone.player.stickyActive.piece = 3
                            clone.player.stickyActive.active = false
                        }
                    }
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
            let canvPos = document.getElementById('canvas-div').getBoundingClientRect();
            let rPosX = (posX - canvPos.left)

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
            let canvPos = document.getElementById('canvas-div').getBoundingClientRect();
            let rPosX = (posX - canvPos.left)

            clone.mouseClickDown = (posX >= $(document).width() / 2) ? ['right', rPosX] : ['left', rPosX];
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
            if (this.player.stickyActive.catch == true) {
                this.canvasObj.deleteObj(this.ball)
                this.ball.x = this.ball.x - upper
            }
        } else {
            this.player.x = 0
            this.mouseClickDown = false
            this.upper = 0
            this.playAudio('wall')
            if (this.player.stickyActive.catch == true) {
                this.canvasObj.deleteObj(this.ball)
                let ballDistance = (this.player.objWidth / 2) - (this.ball.objHeight /2)
                this.ball.x = ballDistance
                this.canvasObj.drawObj(this.ball)
            }
        }
        this.checkCrash(this.player, true)
        this.canvasObj.drawObj(this.player)
    }

    playerRight(upper) {
        this.canvasObj.deleteObj(this.player)       
        if ((this.player.x + this.player.objWidth + upper) < this.canvasObj.canvasWidth) {
            this.player.x = this.player.x + upper
            if (this.player.stickyActive.catch == true) {
                this.canvasObj.deleteObj(this.ball)
                this.ball.x = this.ball.x + upper
            }
        } else {
            this.player.x = this.canvasObj.canvasWidth - this.player.objWidth
            this.mouseClickDown = false
            this.upper = 0
            this.playAudio('wall')
            if (this.player.stickyActive.catch == true) {
                this.canvasObj.deleteObj(this.ball)
                let ballDistance = (this.player.objWidth / 2) - (this.ball.objHeight /2)
                this.ball.x = this.player.x + ballDistance
                this.canvasObj.drawObj(this.ball)
            }
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
        
        if (this.ball.y > this.canvasObj.canvasHeight + this.ball.objHeight) {
            if (this.lifes > -1) { this.lifes-- }
            $('#lifes').text(this.lifes)
            this.canvasObj.deleteObj(this.player)
            this.canvasObj.deleteObj(this.ball)

            let playerThick = Math.ceil((this.canvasObj.canvasHeight / 40))
            let playerSpace = Math.ceil((this.canvasObj.canvasHeight / 25))
            this.playerLong = Math.ceil((this.canvasObj.canvasWidth / 6))
            
            if (this.lifes>=0) {
                this.playAudio('out')
                this.player.x = (this.canvasObj.canvasWidth / 2) - (this.playerLong / 2);
                this.player.y = (this.canvasObj.canvasHeight) - (playerSpace + playerThick);
                
                this.ball.x = Math.ceil((this.canvasObj.canvasWidth / 2)  - (Math.ceil((this.canvasObj.canvasWidth / 20)) / 2));
                this.ball.y = this.player.y - Math.ceil((this.canvasObj.canvasWidth / 20));
                this.canvasObj.drawObj(this.player)
                this.canvasObj.drawObj(this.ball)

                this.player.stickyActive = {
                    active: true,
                    catch: true,
                    piece: 1,
                    sound: false
                }
            } else {
                this.ball.y = this.canvasObj.canvasHeight + this.ball.objHeight*2
                this.ball.moveX = 0
                this.ball.moveY = 0
                this.playAudio('gameover')
                $('#lifes').text('0')
                this.stop()
            }
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
        this.clockObj = null
    }

    checkNextLevel() {
        for (var n = 0; n < this.brickTable.fantomX; n++) {
            for (var m = 0; m < this.brickTable.fantomY; m++) {
                if (n == 0 || m == 0 || n == this.fantomX-1 || m == this.fantomY-1) {
                } else {
                    if (this.brickTable.brickTable[n][m] != null) {
                        if (this.brickTable.brickTable[n][m].name != 'wallbrick') {
                            return false;
                        }
                    }
                }
            }
        }
        this.nextLevel()
        return true;
    }

    nextLevel(reset, maptype) {
        clearInterval(this.clockObj)
        this.clockObj = null
        let newMapLevel
        if (reset) {
            newMapLevel = 0
            this.menuSwitch = true
        } else {
            newMapLevel = this.brickTable.mapLevel + 1
        }
        this.brickTable = null
        this.brickTable = new TableClass(this.canvasObj, maps, maptype, newMapLevel)
        this.reloadMap()
        if (!reset) {
            this.start()
        }
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
            // IF NO STICKY
            if (!(object.name == 'player' && object.stickyActive.active == true)) {

                object.firstWayX = false
                object.firstWayY = false
    
                let rand = this.brickTable.randomNumber(0, this.randomBallVar)
                rand ? this.playAudio('ball1') : this.playAudio('ball2');
    
                // Tégla esetén
                if (object.name == 'brick' || object.name == 'expbrick') {
    
                    if (nowX == true && nowY == true) { // sarok nem ér
                        this.playAudio('fart');
                        //this.stop()
                        object.strong = object.strong - 1; // !! MOST ÉR AZ IS : )
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
                            $('#score-box label').html(this.score)
                            $('#score').addClass('animated-score')
                            
                            window.scoreAnim = setInterval(() => {
                                $('#score').removeClass('animated-score')
                            }, 500);
                            
                            // GIFT
                            if (object.gift) {
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
                       this.checkNextLevel()
                    } else {
                        this.canvasObj.drawObj(object)
                    }
                }
                
                function ballRestart (clone) {
                    if (clone.ball.moveX == 0)
                        clone.ball.moveX = (clone.brickTable.randomNumber(0, 1)) ? clone.ball.step : -clone.ball.step;
                    if (clone.ball.moveY == 0)
                        clone.ball.moveY = (clone.brickTable.randomNumber(0, 1)) ? clone.ball.step : -clone.ball.step;
                }

                let plussRandomMove = this.brickTable.randomNumber(0, this.randomBallVar)    // Igy nam lesz jó talán
                if (nowX == true) {
                    this.ball.moveX = -this.ball.moveX + plussRandomMove;
                    this.ball.x = this.ball.x + this.ball.moveX
                    ballRestart(this)
                }
    
                if (nowY == true) {
                    this.ball.moveY = -this.ball.moveY + plussRandomMove;
                    this.ball.y = this.ball.y + this.ball.moveY
                    ballRestart(this)
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
                }

            } else {

                if (object.stickyActive.sound) {
                    this.playAudio('suction')
                    object.stickyActive.sound = false
                }

                this.ball.moveX = 0
                this.ball.moveY = 0

                this.canvasObj.deleteObj(this.ball)
                this.ball.y = this.player.y - this.ball.objHeight;
                this.canvasObj.drawObj(this.ball)

                object.stickyActive.catch = true
            }
        }
    }

    expAnim(object) {
        if(object.name == 'expbrick') {
            if(object.expActive) {
                if (this.brickTable.brickTable[object.tableX][object.tableY].expTime <= 0) {
                    this.canvasObj.deleteObj(object)
                    this.brickTable.brickTable[object.tableX][object.tableY] = null
                    this.checkNextLevel()
                } else {
                    this.canvasObj.drawObj(object)
                    this.brickTable.brickTable[object.tableX][object.tableY].expTime--
                }
            }
        }
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

            if (gift.name == 'sticky') { this.player.stickyActive.active = true }
            if (gift.name == 'length') { this.giftActiveLength = true }
            this.giftArray.splice(giftRow, 1);
        }
    }

    giftActiveLengthAction () {
        if (this.giftActiveLength) {
            this.giftActiveLength = false;
            var clone = this

            function bigger() {
                if (clone.player.x >= (clone.canvasObj.canvasWidth - (clone.playerLong * 2))) {
                    clone.player.x = clone.canvasObj.canvasWidth - (clone.playerLong * 2)
                } else {
                    clone.player.x = clone.player.x - (clone.playerLong / 2)
                }
                clone.player.x = (clone.player.x < 0) ? 0 : clone.player.x;
                clone.checkCrash(clone.player, true)
            }

            function smaller() {
                clone.player.x = clone.player.x + (clone.playerLong / 2)
                if (clone.player.stickyActive.catch) {
                    clone.canvasObj.deleteObj(clone.ball)
                    clone.ball.x = clone.player.x + ((clone.playerLong / 2) - (clone.ball.objWidth / 2))
                    clone.canvasObj.drawObj(clone.ball)
                }
            }

            var resetPlayerLength = function () {
                clone.playAudio('expired')
                clone.lengthIntervalActive = false
                clone.canvasObj.deleteObj(clone.player)
                smaller()
                clone.player.objWidth = clone.playerLong
                clone.canvasObj.drawObj(clone.player)
            }
            
            function timeOff() {
                resetPlayerLength()
                if (stickyTime) { clearInterval(stickyTime) }
            }           

            this.player.objWidth = this.playerLong * 2
            this.canvasObj.deleteObj(this.player)
            bigger()
            this.canvasObj.drawObj(this.player)
            if (this.lengthIntervalActive == false) {
                this.lengthIntervalActive = true
                var stickyTime = setInterval(timeOff, this.giftTime);
            }
        }
    }

    //GAME HEART
    repeat = () => {
        this.giftActiveLengthAction()
        this.canvasObj.deleteObj(this.ball)
        for (var n = 0; n < this.brickTable.fantomX; n++) {
            for (var m = 0; m < this.brickTable.fantomY; m++) {
                if (this.brickTable.checkPass) {
                    if (n != 0 || m != 0 || n != this.fantomX-1 || m != this.fantomY-1) {

                        if (this.brickTable.brickTable[n][m] != null)
                            this.expAnim(this.brickTable.brickTable[n][m])

                        if (this.brickTable.brickTable[n][m] != null) {
                            this.canvasObj.drawObj(this.brickTable.brickTable[n][m])    // Biztos csak így lehet ? újrarajzolja a téglákat !!!
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
            this.canvasObj.deleteObj(element)
            element.y = element.y + element.step
            if (element.y > this.canvasObj.canvasHeight)
            {
                this.giftArray.splice(giftRow, 1);
            } else {
                this.canvasObj.drawObj(element)
                this.checkPickUp(element, giftRow)
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
    }
}