import {Objects, Brick, ExpBrick, WallBrick} from './basic-class.js';

export default class TableClass {
    constructor(canvasObj, maps, mode, mapLevel) {
        this.canvasObj = canvasObj
        this.brickTable = []
        this.tableX = 7
        this.tableY = 24
        this.fantomX = this.tableX + 2
        this.fantomY = this.tableY + 2
        this.checkPass = true        
        this.maps = maps
        this.mapLevel = mapLevel
        this.clearTable = false
        
        this.createBrickTable(mode)
    }

    randomNumber = (min, max) => {
        return  Math.floor(Math.random() * ((max + 1) - min) + min);
    }

    createBrickTable(mode) {
        this.brickTable = new Array(this.fantomX);
        for (var i = 0; i < this.brickTable.length; i++) {
            this.brickTable[i] = new Array(this.fantomY);
        }
        
        for (var n = 0; n < this.fantomX; n++) {
            for (var m = 0; m < this.fantomY; m++) {
                if (n == 0 || m == 0 || n == this.fantomX-1 || m == this.fantomY-1) {
                    this.brickTable[n][m] = null
                } else {
                    let brickColor
                    let brickStrong
                    let expTime

                    let brickType
                    let gift
                    let giftCode

                    if (mode == 'maps') {
                        brickType = this.maps[this.mapLevel][n][m][0]
                        giftCode = this.maps[this.mapLevel][n][m][1]
                    } else {
                        brickType = this.randomNumber(0, 6)
                        giftCode = this.randomNumber(0, 3)
                    }

                    if (brickType == 0) { brickColor = 'black'; expTime = 10 }
                    if (brickType == 1) { brickColor = 'green'; brickStrong = 1 }
                    if (brickType == 2) { brickColor = 'blue'; brickStrong = 2 }
                    if (brickType == 3) { brickColor = 'purple'; brickStrong = 3 }
                    if (brickType == 4) { brickColor = 'brown'; brickStrong = 4 }
                    if (brickType == 5) { brickColor = 'red'; brickStrong = 5 }
                    if (brickType == 6) { }

                    if (giftCode == 0) { gift = null; }
                    if (giftCode == 1) { gift = 'life'; }
                    if (giftCode == 2) { gift = 'sticky'; }
                    if (giftCode == 3) { gift = 'length'; }

                    let brickX = Math.floor((this.canvasObj.canvasWidth / this.tableX)) * (n - 1)
                    let brickY = Math.ceil((this.canvasObj.canvasWidth / 16)) * (m - 1)
                    let brickWidth = Math.floor((this.canvasObj.canvasWidth / this.tableX))
                    let brickHeight = Math.ceil((this.canvasObj.canvasWidth / 16))

                    if (brickType == 0) {
                        this.brickTable[n][m] = new ExpBrick({
                            name: 'expbrick',
                            x: brickX,
                            y: brickY,
                            objWidth: brickWidth,
                            objHeight: brickHeight,
                            fillType: 'color',
                            color: brickColor,
                            strong: 1,
                            tableX: n,
                            tableY: m,
                            expTime: 100,
                            expActive: false
                        });
                    } else if (brickType == 6) {
                        this.brickTable[n][m] = new WallBrick({
                            name: 'wallbrick',
                            x: brickX,
                            y: brickY,
                            objWidth: brickWidth,
                            objHeight: brickHeight,
                            fillType: 'img',
                            tableX: n,
                            tableY: m,
                        });
                    } else if (brickType == 1 || brickType == 2 || brickType == 3 || brickType == 4 ||brickType == 5) {
                        this.brickTable[n][m] = new Brick({
                            name: 'brick',
                            x: brickX,
                            y: brickY,
                            objWidth: brickWidth,
                            objHeight: brickHeight,
                            fillType: 'color',
                            color: brickColor,
                            strong: brickStrong,
                            tableX: n,
                            tableY: m,
                            gift: gift
                        });
                    } else {
                        this.brickTable[n][m] = null
                    }
                }                
            }
        }
    }

    expNeighbours (object) {
        let tableX = object.tableX
        let tableY = object.tableY
        let expTime = object.expTime

        let neighbours = [
            {x: tableX, y: tableY-1},
            {x: tableX+1, y: tableY},
            {x: tableX, y: tableY+1},
            {x: tableX-1, y: tableY},
        ]

        neighbours.forEach(act => {
            if (!(act.x == 0 || act.y == 0 || act.x == this.brickTable.fantomX-1 || act.y == this.brickTable.fantomY-1)) {

                let brickX = Math.floor((this.canvasObj.canvasWidth / this.tableX)) * (act.x-1)
                let brickY = Math.ceil((this.canvasObj.canvasWidth / 16)) * (act.y-1)

                this.brickTable[act.x][act.y] = new ExpBrick({
                    name: 'expbrick',
                    x: brickX,
                    y: brickY,
                    objWidth: object.objWidth,
                    objHeight: object.objHeight,
                    fillType: 'color',
                    color: 'pink',
                    strong: 1,
                    tableX: act.x,
                    tableY: act.y,
                    expTime: expTime,
                    expActive: true
                });

                this.canvasObj.drawObj(this.brickTable[act.x][act.y])
            }
        });
    }
}