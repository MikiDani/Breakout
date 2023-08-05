$( document ).ready(function() {

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
            this.firstWayX = false
            this.firstWayY = false
            
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

            log(this.bg01)
            log(this.bg01NaturalWidth, this.bg01NaturalHeight)
            log('itt:', this.bg01ActualWidth, this.bg01ActualHeight)
                        
            this.myResizer()
            this.checkContextDiv()
            this.checkContextBg()

            log(this.canvasWidth, this.canvasHeight)
        }

        drawBg() {
            log('KISFASZ!!!')
            this.ctx.drawImage(this.bg01, 0, 0, this.bg01NaturalWidth, this.bg01NaturalHeight, 0, 0, this.canvasWidth, this.canvasHeight)

            this.ctxBg.drawImage(this.bg01, 0, 0, this.bg01NaturalWidth, this.bg01NaturalHeight, 0, 0, this.canvasWidth, this.canvasHeight)
        }

        checkContextDiv() {
            if (this.canvasDiv.getContext) {
                this.ctx = this.canvasDiv.getContext("2d");
                return;
            }
            throw new Error('getContext error!!!');
        }

        checkContextBg() {
            if (this.canvasBg.getContext) {
                this.ctxBg = this.canvasBg.getContext("2d");
                return;
            }
            throw new Error('getContext error!!!');
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

        drawObj(object) {
            if (object.type == 'img') {            
                this.ctx.drawImage(object.img, 0, 0, object.imgNaturalWidth, object.imgNaturalHeight, object.x, object.y, object.objWidth, object.objHeight);
            }

            if (object.type=='rect') {
                this.ctx.fillStyle = object.color;
                this.ctx.fillRect(object.x, object.y, object.objWidth, object.objHeight);
            }
        }

        deleteObj(object) {
            //this.ctx.clearRect(object.x, object.y, object.objWidth, object.objHeight);

            this.ctx.drawImage(this.canvasBg, object.x, object.y, object.objWidth, object.objHeight, object.x, object.y, object.objWidth, object.objHeight)

        }
    }

    class Game {
        constructor() {
            myVar.n = 0
            this.refreshTime = 6
            this.infoDiv = $("#info-div")

            this.myAddEventListeners()  

            canvasObj.drawBg()

            canvasObj.drawObj(player)
            canvasObj.drawObj(brick)
            canvasObj.drawObj(brick2)

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
                    if (typeof myVar.clockObj == 'undefined') {
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

            let nowX = false
            let nowY = false

            if (this.checkX(ball, brick)) {
                if (brick.firstWayX == false) {
                    brick.firstWayX = true
                    nowX = true
                    log('X FIRST')
                } else {
                    log('X már van!')
                }
            } else {
                brick.firstWayX = false
            }
            
            if (this.checkY(ball, brick)) {
                if (brick.firstWayY == false) {
                    brick.firstWayY = true
                    nowY = true
                    log('Y FIRST')
                }else {
                    log('Y már van!')
                }
            } else {
                brick.firstWayY = false
            }

            
            
            if (this.checkY(ball, brick) && this.checkX(ball, brick)) {
                
                log(brick.firstWayX, brick.firstWayY)
                log(nowX, nowY)

                brick.firstWayX = false
                brick.firstWayY = false

                if (nowX == true) {
                    ball.moveX = -ball.moveX
                    log('X INVERSE')
                    log('XMOVE' + ball.moveX)
                }
                
                if (nowY == true) {
                    ball.moveY = -ball.moveY
                    log('Y INVERSE')
                    log('YMOVE' + ball.moveY)
                }

                //canvasObj.drawObj(ball)              
                
                log('X:' + ball.moveX)
                log('Y:' + ball.moveY)

                //this.stop()
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
        y: 10,
        objWidth: 50,
        objHeight: 50,
        step: 5
    })

    let playerThick = 15
    let playerLong = 100
    let playerSpace = 25

    const player = new Objects({
        type: 'rect',
        name: 'player',
        color: 'orange',
        x: playerSpace,
        y: (canvasObj.canvasHeight / 2) - (playerLong / 2),
        objWidth: playerThick,
        objHeight: playerLong,
        step: 10
    })

    const brick = new Objects({
        type: 'rect',
        name: 'brick',
        color: 'red',
        x: 100,
        y: 100,
        objWidth: 550,
        objHeight: 1150,
        step: 10
    });

    const brick2 = new Objects({
        type: 'rect',
        name: 'brick2',
        color: 'green',
        x: 0,
        y: 0,
        objWidth: (canvasObj.canvasWidth / 10),
        objHeight: 20,
        step: 10
    });

    const game = new Game()

    $(window).on("resize", function() { 
        canvasObj = new CanvasClass()

        delete window.player;
        delete window.brick;
        delete window.brick2;

        canvasObj.drawBg()

        canvasObj.drawObj(player)
        canvasObj.drawObj(brick)
        canvasObj.drawObj(brick2)
    });

});