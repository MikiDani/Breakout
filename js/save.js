this.ctx.fillStyle = "rgb(200, 0, 0)";
this.ctx.fillRect(15, 10, 50, 50);

this.ctx.fillStyle = "blue";
this.ctx.fillRect(30, 30, 50, 50);

this.ctx.fillRect(125, 125, 300, 300);
this.ctx.strokeRect(150, 150, 250, 200);
this.ctx.clearRect(160, 170, 280, 190);

this.ctx.beginPath();
this.ctx.moveTo(75, 50);
this.ctx.lineTo(100, 75);
this.ctx.lineTo(100, 25);
this.ctx.fillStyle = "green";
this.ctx.fill();

this.ctx.drawImage(this.img1, 0, 0, 450, 450, 10, 10, 150, 150);

function circleTest() {
    var x1 = 300;
    var y1 = 400;
    var r =  50;
    var theta = 5;
  
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x1 + r * Math.cos(theta), y1 + r * Math.sin(theta));
    this.ctx.stroke();
  }
  
  canvasObj.circleTest()
  
  
  
  //this.ctx.rotate(myVar.n);
  //this.ctx.save();
  //this.ctx.rotate(1); // rotate
  //this.ctx.restore(); // restore original states (no rotation etc)

  
let brickNeighbours = [
	{x: brick.tableX, y: brick.tableY -1}, {x: brick.tableX, y: brick.tableY + 1}, {x: brick.tableX + 1, y: brick.tableY}, {x: brick.tableX -1, y: brick.tableY}
]

for (var key in brickNeighbours) {
	//var value = brickNeighbours[key];

	log(brickNeighbours[key].x)
	log(brickNeighbours[key].y)

	canvasObj.drawObj(globalVar.brickTable[brickNeighbours[key].x][brickNeighbours[key].y], 'black')
}
this.stop()

for (var key in brickNeighbours) {
    //var value = brickNeighbours[key];

    log(brickNeighbours[key].x)
    log(brickNeighbours[key].y)

    log('---')

    log(globalVar.tableX)
    log(globalVar.tableY)

    if (brickNeighbours[key].x >= 0 && brickNeighbours[key].x <= globalVar.tableX) {
        if (brickNeighbours[key].y >= 0 && brickNeighbours[key].y <= globalVar.tableY) {
            if (typeof globalVar.brickTable[brickNeighbours[key].x][brickNeighbours[key].y] != 'undefined') {
                if (globalVar.brickTable[brickNeighbours[key].x][brickNeighbours[key].y] != null) {
                log(globalVar.brickTable[brickNeighbours[key].x][brickNeighbours[key].y])
                canvasObj.drawObj(globalVar.brickTable[brickNeighbours[key].x][brickNeighbours[key].y])
                }  
            }
        }
    }

}

if (typeof black !='undefined') {
    this.ctx.fillStyle = object.color
    this.ctx.fillRect(object.x, object.y, object.objWidth, object.objHeight)
}


function bcX(x) {
  let returnValue = (x >= 0 && x <= globalVar.tableX) ? true : false;
  return returnValue
}

function bcY(y) {
  let returnValue = (y >= 0 && y <= globalVar.tableY) ? true : false;
  return returnValue
}

function bcN(object) {
  let returnValue = (object != null) ? true : false;
  return returnValue
}

if (bcX(brick.tableX+1)) {
  if (typeof globalVar.brickTable[brick.tableX+1][brick.tableY] != 'undefined' && bcN(globalVar.brickTable[brick.tableX+1][brick.tableY])) {
      canvasObj.drawObj(globalVar.brickTable[brick.tableX+1][brick.tableY])
  }
  else { log('nulla lett!')}
}

if (bcX(brick.tableX-1)) {
  if (typeof globalVar.brickTable[brick.tableX-1][brick.tableY] != 'undefined' && bcN(globalVar.brickTable[brick.tableX-1][brick.tableY])) {
      canvasObj.drawObj(globalVar.brickTable[brick.tableX-1][brick.tableY])
  }
  else { log('nulla lett!')}
}

if (bcY(brick.tableY+1)) {
  if (typeof globalVar.brickTable[brick.tableX][brick.tableY+1] != 'undefined' && bcN(globalVar.brickTable[brick.tableX][brick.tableY+1])) {
      canvasObj.drawObj(globalVar.brickTable[brick.tableX][brick.tableY+1])
  }
  else { log('nulla lett!')}
}

if (bcY(brick.tableY-1)) {
  if (typeof globalVar.brickTable[brick.tableX][brick.tableY-1] != 'undefined' && bcN(globalVar.brickTable[brick.tableX][brick.tableY-1])) {
      canvasObj.drawObj(globalVar.brickTable[brick.tableX][brick.tableY-1])
  }
  else { log('nulla lett!')}
}

//----

    // DNY x- y+   1: x=0, y-1   2: x+1, y=0
    if (this.checkMinus(this.ball.moveX) && this.checkPlus(this.ball.moveY)) {
      if(this.checkNull(globalVar.brickTable[object.x][object.y-1]) && this.checkNull(globalVar.brickTable[object.x+1][object.y])) {
          log('DNY törölhető!')
          object.strong = object.strong - 1;
      }
  }
  // ÉNY x- y-   1: x=+1, y=0   2: x=0, y=+1
  if (this.checkMinus(this.ball.moveX) && this.checkMinus(this.ball.moveY)) {
      if(this.checkNull(globalVar.brickTable[object.x+1][object.y]) && this.checkNull(globalVar.brickTable[object.x][object.y+1])) {
          log('ÉNY törölhető!')
          object.strong = object.strong - 1;
      }
  }
  // ÉK x+ y-   1: x=-1, y=0   2: x=0, y=+1
  if (this.checkPlus(this.ball.moveX) && this.checkMinus(this.ball.moveY)) {
      if(this.checkNull(globalVar.brickTable[object.x-1][object.y]) && this.checkNull(globalVar.brickTable[object.x][object.y+1])) {
          log('ÉK törölhető!')
          object.strong = object.strong - 1;
      }
  }
  // DK x+ y+   1: x=0, y-1   2: x-1, y=0
  if (this.checkPlus(this.ball.moveX) && this.checkPlus(this.ball.moveY)) {
      if(this.checkNull(globalVar.brickTable[object.x][object.y-1]) && this.checkNull(globalVar.brickTable[object.x-1][object.y])) {
          log('DK törölhető!')
          object.strong = object.strong - 1;
      }
  }

  this.playAudio('fart');
  this.stop()

//---

    // Kell ez ?

  speedCount = () => {
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




if(false){
    function preload(arrayOfImages) {
        $(arrayOfImages).each(function() {
            //$('img')[0].src = this;
            log(this)
            //log($('img')[0].src)
        });
    }
    
    preload([
        'images/bg01.jpg',
        'images/ball-anim.gif',
        'images/sound_icon-on.svg'
    ]);
}