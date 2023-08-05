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