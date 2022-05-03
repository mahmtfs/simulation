class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
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

function generatePoints(radius, planeSize = new Pair(500, 200), discardNum = 30){
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

    spawnPoints.push(new Point(planeSize.x / 2, planeSize.y / 2));
    while (spawnPoints.length > 0){
        let spawnIndex = parseInt(Math.random() * spawnPoints.length);
        let spawnCenter = spawnPoints[spawnIndex];
        let candidateAccepted = false;
        for (let i = 0; i < discardNum; i++){
            let angle = Math.random() * Math.PI * 2;
            let dir = new Pair(Math.sin(angle), Math.cos(angle));
            let index = radius + Math.random() * radius
            let candidate = new Point(spawnCenter.x + dir.x * index, spawnCenter.y + dir.y * index);
            if (isValid(candidate, planeSize, cellSize, radius, points, grid)){
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

var c = document.getElementById("simulation");
var ctx = c.getContext("2d");
var radius = 5;

var points = generatePoints(30);
for (let i = 0; i < points.length; i++){
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = "black";
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.stroke();
}
