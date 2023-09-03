const log = console.log;

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
    constructor({name, x, y, objWidth, objHeight, fillType, color, strong, tableX, tableY, gift}) {
        super({name, x, y, objWidth, objHeight, fillType})
        this.color = color
        this.strong = strong
        this.tableX = tableX
        this.tableY = tableY
        this.gift = gift
        this.firstWayX = false
        this.firstWayY = false
        this.score = strong * 10
    }
}

class ExpBrick extends Brick {
    constructor({name, x, y, objWidth, objHeight, fillType, color, strong, tableX, tableY, expTime, expActive}) {
        super({name, x, y, objWidth, objHeight, fillType, color, strong, tableX, tableY})
        this.expTime = expTime
        this.expActive = expActive
        this.expFrame = 1
        this.expImg1 = document.querySelector('#exp-img-1')
        this.expImg2 = document.querySelector('#exp-img-2')
        this.expImg3 = document.querySelector('#exp-img-3')
        if (String(this.expImg1) == 'undefined') {
            throw("Img error! I can't find exp-img-1!")
        }
        this.imgNaturalWidth = this.expImg1.naturalWidth
        this.imgNaturalHeight = this.expImg1.naturalHeight
    }

    frame(value) {
        if (value == '1') { this.expFrame = 2; return this.expImg1; }
        if (value == '2') { this.expFrame = 3; return this.expImg2; }
        if (value == '3') { this.expFrame = 1; return this.expImg3; }
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

class Gift extends Objects {
    constructor({name, x, y, objWidth, objHeight, fillType, step}) {
        super({name, x, y, objWidth, objHeight, fillType})
        this.fillType = fillType
        this.step = step
        this.img = document.querySelector(`#gift-${name}`)
        if (String(this.img) == 'undefined') {
            throw("Img error! I can't find " + this.name + "!")
        }
        this.imgNaturalWidth = this.img.naturalWidth
        this.imgNaturalHeight = this.img.naturalHeight
    }
}

export {Objects, Ball, Brick, Player, ExpBrick, Gift}