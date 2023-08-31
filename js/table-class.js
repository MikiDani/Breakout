const log = console.log;

import {Objects, Brick} from './basic-class.js';

export default class TableClass {
    constructor(canvasObj) {
        this.canvasObj = canvasObj
        this.brickTable = []
        this.tableX = 7
        this.tableY = 24
        this.checkPass = true

        this.createBrickTable()
    }

    randomNumber = (min, max) => {
        return  Math.floor(Math.random() * ((max+1) - min) + min);
    }

    createBrickTable() {
        this.brickTable = new Array(this.tableX);
        for (var i = 0; i < this.brickTable.length; i++) {
            this.brickTable[i] = new Array(this.tableY);
        }
        
        for (var n = 0; n < this.tableX; n++) {
            for (var m = 0; m < this.tableY; m++) {
    
                let randomColor = this.randomNumber(0,4)
                let brickColor
                let brickStrong
                if (randomColor == 0) { brickColor = 'green'; brickStrong = 1 }
                if (randomColor == 1) { brickColor = 'blue'; brickStrong = 2 }
                if (randomColor == 2) { brickColor = 'purple'; brickStrong = 1 }
                if (randomColor == 3) { brickColor = 'yellow'; brickStrong = 2 }
                if (randomColor == 4) { brickColor = 'red'; brickStrong = 1 }
    
                this.brickTable[n][m] = new Brick({
                    name: 'brick',
                    x: Math.floor((this.canvasObj.canvasWidth / this.tableX)) * n,
                    y: Math.ceil((this.canvasObj.canvasWidth / 16)) * m,
                    objWidth:  Math.floor((this.canvasObj.canvasWidth / this.tableX)),
                    objHeight: Math.ceil((this.canvasObj.canvasWidth / 16)),
                    fillType: 'color',
                    color: brickColor,
                    strong: brickStrong,
                    tableX: n,
                    tableY: m,
                });
                /*
                log('---'+ this.brickTable[n][m].name)
                log(this.brickTable[n][m].x)
                log(this.brickTable[n][m].y)
                log(this.brickTable[n][m].objWidth)
                log(this.brickTable[n][m].objHeight)
                log('---');
                */
            }
        }

        console.log(this.brickTable);
    }
}