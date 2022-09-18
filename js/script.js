let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const screenWidth = document.documentElement.scrollWidth; //find out the size of the site
const screenHeight = document.documentElement.scrollHeight-4;

//resize the canvas so that the canvas size is an even number bloockSize
if(screenWidth % 2 != 0)
    canvas.width = screenWidth - 1;
else 
    canvas.width = screenWidth;
if(screenHeight % 2 != 0)
    canvas.height = screenHeight - 2;
else 
    canvas.height = screenHeight - 1;

const width = canvas.width;
const height = canvas.height;

const platformWidth = 20;
const platformHeight = 100;

const speed = 4;

let game_points1 = 0;
let game_points2 = 0;
let max_points = prompt("введите максимальное количество очков для выигрыша");

function colision(x1, y1, width1, height1, x2, y2, width2, height2)
{
    return x1 < x2 + width2&&
        x1 + width1 > x2&&
        y1 < y2 + height2&&
        y1 + height1 > y2;
}

let Platform = function(x, y)
{
    this.x = x;
    this.y = y;
    this.width = platformWidth;
    this.height = platformHeight;
};

Platform.prototype.draw = function()
{
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
};

let Ball = function(x, y)
{
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 4;
    this.speedX = 0;
    this.speedY = 0;
};

Ball.prototype.draw = function()
{
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
};

Ball.prototype.logic = function()
{
    this.x += this.speedX;
    this.y += this.speedY;
}

let player1 = new Platform(0, height / 2);
let player2 = new Platform(width - platformWidth, height / 2);
let ball = new Ball(width / 2, height / 2);

function checkColision()
{
    if(ball.y < 0)
    {
        ball.y = 0;
        ball.speedY *= -1;
    } else if(ball.y + ball.height > height)
    {
        ball.y = height - ball.height;
        ball.speedY *= -1;
    }
    if(ball.x < 0)
    {
        game_points2++;

        ball.x = width / 2;
        ball.y = height / 2;
        ball.speedX = 0;
        ball.speedY = 0;

        player1.y = height / 2;
        player2.y = height / 2;
    } else if(ball.x + ball.width > width)
    {
        game_points1++;

        ball.x = width / 2;
        ball.y = height / 2;
        ball.speedX = 0;
        ball.speedY = 0;

        player1.y = height / 2;
        player2.y = height / 2;
    }

    if(colision(ball.x, ball.y, ball.width, ball.height, player1.x, player1.y, player1.width, player1.height))
    {
        ball.x = player1.x + player1.width + ball.width;
        ball.speedX *= -1;
    } else if(colision(ball.x, ball.y, ball.width, ball.height, player2.x, player2.y, player2.width, player2.height))
    {
        ball.x = player2.x - ball.width;
        ball.speedX *= -1;
    }
}

function logic()
{
    ball.logic();
}

function draw()
{
    ctx.clearRect(0, 0, width, height);

    player1.draw();
    player2.draw();
    ball.draw();

    ctx.font = "26px Arial";
    ctx.fillStyle = "green";
    ctx.fillText(`счет игры: ${game_points1}:${game_points2}`, width / 2-50, 30);
}

function main()
{
    checkColision();
    logic();
    draw();

    if(max_points == game_points1)
    {
        clearInterval(time);
        alert("first player win");
        document.location.reload();
    } else if(max_points == game_points2)
    {
        clearInterval(time);
        alert("second player win");
        document.location.reload();
    }
}

document.addEventListener("keydown", function(e) {
    console.log(e.keyCode);
    if(e.keyCode === 87)
        player1.y -= speed;
    else if(e.keyCode === 83)
        player1.y += speed;
    
    if(e.keyCode === 38)
        player2.y -= speed;
    else if(e.keyCode === 40)
        player2.y += speed;
    
    if(e.keyCode === 32 && ball.speedX == 0 && ball.speedY == 0)
    {
        ball.speedX = 4;
        ball.speedY = 4;
    }
});

document.addEventListener("mousemove", function(e) {
    if(colision(e.offsetX, e.offsetY, 1, 1, player1.x, player1.y, player1.width, player1.height))
    {
        player1.y = e.offsetY - player1.height / 2;

        if(player1.y < 0)
            player1.y = 0;
        else if(player1.y + player1.height > height)
            player1.y = height - player1.height;
    }
    else if(colision(e.offsetX, e.offsetY, 1, 1, player2.x, player2.y, player2.width, player2.height))
    {
        player2.y = e.offsetY - player2.height / 2;

        if(player2.y < 0)
            player2.y = 0;
        else if(player2.y + player2.height > height)
            player2.y = height - player2.height;
    }
});

document.addEventListener("mousedown", function(e) {
    if(e.buttons && ball.speedX == 0 && ball.speedY == 0)
    {
        ball.speedX = 4;
        ball.speedY = 4;
    }
});

let time = setInterval(main, 1000/30);