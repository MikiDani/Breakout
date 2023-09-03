const log = console.log;

import {Objects, Brick, ExpBrick} from './basic-class.js';

export default class TableClass {
    constructor(canvasObj) {
        this.canvasObj = canvasObj
        this.brickTable = []
        this.tableX = 7
        this.tableY = 24
        this.checkPass = true

        this.fantomX = this.tableX + 2
        this.fantomY = this.tableY + 2

        this.createBrickTable()
    }

    randomNumber = (min, max) => {
        return  Math.floor(Math.random() * ((max + 1) - min) + min);
    }

    createBrickTable() {
        this.brickTable = new Array(this.fantomX);
        for (var i = 0; i < this.brickTable.length; i++) {
            this.brickTable[i] = new Array(this.fantomY);
        }
        
        for (var n = 0; n < this.fantomX; n++) {
            for (var m = 0; m < this.fantomY; m++) {
                
                if (n == 0 || m == 0 || n == this.fantomX-1 || m == this.fantomY-1) {
                    this.brickTable[n][m] = null
                } else {
                    let randomType = this.randomNumber(0,2)
                    let brickColor
                    let brickStrong
                    let expTime

                    if (randomType == 0) { brickColor = 'black'; expTime = 10 }
                    if (randomType == 1) { brickColor = 'green'; brickStrong = 1 }
                    if (randomType == 2) { brickColor = 'blue'; brickStrong = 2 }
                    if (randomType == 3) { brickColor = 'purple'; brickStrong = 1 }
                    if (randomType == 4) { brickColor = 'yellow'; brickStrong = 2 }
                    if (randomType == 5) { brickColor = 'red'; brickStrong = 1 }

                    let brickX = Math.floor((this.canvasObj.canvasWidth / this.tableX)) * (n - 1)
                    let brickY = Math.ceil((this.canvasObj.canvasWidth / 16)) * (m - 1)
                    let brickWidth = Math.floor((this.canvasObj.canvasWidth / this.tableX))
                    let brickHeight = Math.ceil((this.canvasObj.canvasWidth / 16))

                    if (randomType == 0) {
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
                    } else {

                        let randomGift = this.randomNumber(0, 3)
                        let gift
                        if (randomGift == 0) { gift = null; }
                        if (randomGift == 1) { gift = 'life'; }
                        if (randomGift == 2) { gift = 'sticky'; }
                        if (randomGift == 3) { gift = 'length'; }

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
                    }
                    
                    /*
                    log(q + '. | n: '+ n  +' m: ' + m)
                    log(this.brickTable[n][m].x)
                    log(this.brickTable[n][m].y)
                    log(this.brickTable[n][m].objWidth)
                    log(this.brickTable[n][m].objHeight)
                    log('---');
                    */
                }                
            }
        }

        console.log(this.brickTable);
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
                    strong: 0,
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