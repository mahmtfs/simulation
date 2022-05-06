class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.color = "#ffffff";
    }
    move(dirX, dirY){
        this.x += dirX;
        this.y += dirY;
    }
    toString() {
        return this.x + " " + this.y;
    }
}

class Pair{
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function generatePoints(radius, planeSize = new Pair(500, 300), discardNum = 30){
    let cellSize = radius/Math.sqrt(2);
    var grid = new Array(Math.ceil(planeSize.y/cellSize));
    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(Math.ceil(planeSize.x/cellSize));
        for (let j = 0; j < grid[i].length; j++){
            grid[i][j] = 0;
        }
    }
    let points = new Array(0);
    let spawnPoints = new Array(0);
    let val = document.getElementById("amount").value;

    spawnPoints.push(new Point(planeSize.x / 2, planeSize.y / 2));
    while (points.length < val){
        let spawnIndex = parseInt(Math.random() * spawnPoints.length);
        let spawnCenter = spawnPoints[spawnIndex];
        let candidateAccepted = false;
        for (let i = 0; i < discardNum; i++){
            let angle = Math.random() * Math.PI * 2;
            let dir = new Pair(Math.sin(angle), Math.cos(angle));
            let index = radius + Math.random() * radius
            let candidate = new Point(spawnCenter.x + dir.x * index, spawnCenter.y + dir.y * index);
            if (isValid(candidate, planeSize, cellSize, radius, points, grid)){
				candidate.color = generateRandomColor();
                points.push(candidate);
                spawnPoints.push(candidate);
                grid[parseInt(candidate.y / cellSize)][parseInt(candidate.x / cellSize)] = points.length;
                candidateAccepted = true;
                break;
            }
        }
        if (!candidateAccepted){
            spawnPoints.splice(spawnIndex, 1);
        }
    }
    return points;
}

function isValid(candidate, planeSize, cellSize, radius, points, grid){
    var offset = 5;
    if (candidate.x >= offset && candidate.x < planeSize.x - offset && candidate.y >= offset && candidate.y < planeSize.y - offset){
        let cellX = parseInt(candidate.x / cellSize);
        let cellY = parseInt(candidate.y / cellSize);
        let searchStartX = Math.max(0, cellX - 2);
        let searchEndX = Math.min(cellX + 2, grid[0].length - 1);
        let searchStartY = Math.max(0, cellY - 2);
        let searchEndY = Math.min(cellY + 2, grid.length - 1);

        for (let x = searchStartX; x <= searchEndX; x++){
            for (let y = searchStartY; y <= searchEndY; y++){
                let pointIndex = grid[y][x] - 1;
                if (pointIndex !== -1){
                    let vx = candidate.x - points[pointIndex].x;
                    let vy = candidate.y - points[pointIndex].y;
                    let distance = vx * vx + vy * vy;
                    if (distance < radius * radius){
                        return false
                    }
                }
            }
        }
        return true;
    }
    return false;
}

function generateRandomColor(){
    let maxVal = 0xFFFFFF;
    let randomNumber = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);
    return `#${randColor.toUpperCase()}`
}

var c = document.getElementById("simulation");
var ctx = c.getContext("2d");
var radius = 3;
let pointArr;

function drawPoints(points){
	for (let i = 0; i < points.length; i++){
        //points[i].color = generateRandomColor();
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = points[i].color;
        ctx.fill();
        ctx.stroke();
    }
}

function simulation(){
    ctx.clearRect(0, 0, c.width, c.height);
    var points = generatePoints(9);
	drawPoints(points);
	pointArr = points;
}

function zoomFunc(){
	window.onload = function(){
		trackTransforms(ctx);
		function redraw(){
			// Clear the entire canvas
			var p1 = ctx.transformedPoint(0,0);
			var p2 = ctx.transformedPoint(c.width,c.height);
			ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

			// Alternatively:
			// ctx.save();
			// ctx.setTransform(1,0,0,1,0,0);
			// ctx.clearRect(0,0,canvas.width,canvas.height);
			// ctx.restore();
			//ctx.clearRect(0, 0, c.width, c.height);
			if (pointArr !== undefined) {
				drawPoints(pointArr);
			}
		}
		redraw();

		var lastX=c.width/2, lastY=c.height/2;
		var dragStart,dragged;
		c.addEventListener('mousedown',function(evt){
			document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
			lastX = evt.offsetX || (evt.pageX - c.offsetLeft);
			lastY = evt.offsetY || (evt.pageY - c.offsetTop);
			dragStart = ctx.transformedPoint(lastX,lastY);
			dragged = false;
		},false);
		c.addEventListener('mousemove',function(evt){
			lastX = evt.offsetX || (evt.pageX - c.offsetLeft);
			lastY = evt.offsetY || (evt.pageY - c.offsetTop);
			dragged = true;
			if (dragStart){
				var pt = ctx.transformedPoint(lastX,lastY);
				ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
				redraw();
			}
		},false);
		c.addEventListener('mouseup',function(evt){
			dragStart = null;
			if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
		},false);

		var scaleFactor = 1.1;
		var zoom = function(clicks){
			var pt = ctx.transformedPoint(lastX,lastY);
			ctx.translate(pt.x,pt.y);
			var factor = Math.pow(scaleFactor,clicks);
			ctx.scale(factor,factor);
			ctx.translate(-pt.x,-pt.y);
			redraw();
		}

		var handleScroll = function(evt){
			var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
			if (delta) zoom(delta);
			return evt.preventDefault() && false;
		};
		c.addEventListener('DOMMouseScroll',handleScroll,false);
		c.addEventListener('mousewheel',handleScroll,false);
	};
	// Adds ctx.getTransform() - returns an SVGMatrix
	// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
	function trackTransforms(ctx){
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		var xform = svg.createSVGMatrix();
		ctx.getTransform = function(){ return xform; };

		var savedTransforms = [];
		var save = ctx.save;
		ctx.save = function(){
			savedTransforms.push(xform.translate(0,0));
			return save.call(ctx);
		};
		var restore = ctx.restore;
		ctx.restore = function(){
			xform = savedTransforms.pop();
			return restore.call(ctx);
		};

		var scale = ctx.scale;
		ctx.scale = function(sx,sy){
			xform = xform.scaleNonUniform(sx,sy);
			return scale.call(ctx,sx,sy);
		};
		var rotate = ctx.rotate;
		ctx.rotate = function(radians){
			xform = xform.rotate(radians*180/Math.PI);
			return rotate.call(ctx,radians);
		};
		var translate = ctx.translate;
		ctx.translate = function(dx,dy){
			xform = xform.translate(dx,dy);
			return translate.call(ctx,dx,dy);
		};
		var transform = ctx.transform;
		ctx.transform = function(a,b,c,d,e,f){
			var m2 = svg.createSVGMatrix();
			m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
			xform = xform.multiply(m2);
			return transform.call(ctx,a,b,c,d,e,f);
		};
		var setTransform = ctx.setTransform;
		ctx.setTransform = function(a,b,c,d,e,f){
			xform.a = a;
			xform.b = b;
			xform.c = c;
			xform.d = d;
			xform.e = e;
			xform.f = f;
			return setTransform.call(ctx,a,b,c,d,e,f);
		};
		var pt  = svg.createSVGPoint();
		ctx.transformedPoint = function(x,y){
			pt.x=x; pt.y=y;
			return pt.matrixTransform(xform.inverse());
		}
	}
}

zoomFunc();