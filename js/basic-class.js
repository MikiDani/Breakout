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

export {Objects, Ball, Brick, Player}