const log = console.log;

export default class CanvasClass {
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

        $('#page').css('width', window.innerWidth)
        $('#page').css('height', window.innerHeight)

        $('#front-menu').css('width', window.innerWidth)
        $('#front-menu').css('height', window.innerHeight)

        if (window.mobileCheck()) {
            $('#teszt').html('MOBILE: ' + window.innerWidth + ' x ' + window.innerHeight)
        } else {
            $('#teszt').html('DESKTOP: ' + window.innerWidth + ' x ' + window.innerHeight)
        }
        
        let infoPlace = ((window.innerWidth * 2) / 100) * 10 

        if (window.innerHeight > ((window.innerWidth * 2) + infoPlace)) {
            log('első H nagyobb')
            if (window.isMobil) {
                this.canvasWidth = window.innerWidth
            } else {
                this.canvasWidth = (window.innerWidth > 1001) ? 1000 : window.innerWidth
            }
            this.canvasHeight = Math.ceil(window.innerWidth * 2)
            $('#max-display').css('width', window.innerWidth);
        } else {
            log('második H kisebb')
            let infoRow = (window.innerHeight / 100) * 5
            let gamePlace = (window.innerHeight / 100) * 95

            this.canvasHeight = Math.ceil(gamePlace - infoRow)
            this.canvasWidth = Math.ceil((this.canvasHeight / 2))

            $('#max-display').css('width', this.canvasWidth);
        }

        log('-----i------');
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