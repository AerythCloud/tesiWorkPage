function Ball(x, y, radius, e, mass, colour) {
    this.position = { x: x, y: y }; //m
    this.velocity = { x: 0, y: 0 }; // m/s
    this.e = -e; // has no units
    this.mass = mass; //kg
    this.radius = radius; //m
    this.colour = colour;
    this.area = (Math.PI * radius * radius) / 10000; //m^2
}

var canvas = null;
var ctx = null;
var fps = 1 / 60; //60 FPS
var dt = fps * 1000; //ms
var timer = false;
var Cd = 0.47;
var rho = 1.22; //kg/m^3
var mouse = { x: 0, y: 0, isDown: false };
var ag = 9.81; //m/s^2 acceleration due to gravity on earth = 9.81 m/s^2. 
var balls = [];
var colors = ["#FE4C92", "#75D2FD", "#84EF82", "#FFC934", "#AB7DEC"];
var messageDisplayed = true;

var setup = function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();

    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;
    canvas.onmousemove = getMousePosition;

    // Aggiungi 18 palline iniziali
    for (var i = 0; i < 18; i++) {
        var color = colors[i % colors.length];
        var x = Math.random() * canvas.width;
        var y = Math.random() * canvas.height;
        balls.push(new Ball(x, y, 20, 0.7, 10, color)); // Raggio aumentato a 20
    }

    window.addEventListener('resize', resizeCanvas, false);

    timer = setInterval(loop, dt);
}

var resizeCanvas = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (var i = 0; i < balls.length; i++) {
        balls[i].position.x = Math.min(balls[i].position.x, canvas.width - balls[i].radius);
        balls[i].position.y = Math.min(balls[i].position.y, canvas.height - balls[i].radius);
    }
}

var mouseDown = function(e) {
    if (e.which == 1) {
        if (messageDisplayed) {
            $('#message').fadeOut();
            messageDisplayed = false;
        }
        getMousePosition(e);
        mouse.isDown = true;
        var color = colors[balls.length % colors.length];
        balls.push(new Ball(mouse.x, mouse.y, 20, 0.7, 10, color)); // Raggio aumentato a 20
    }
}

var mouseUp = function(e) {
    if (e.which == 1) {
        mouse.isDown = false;
        balls[balls.length - 1].velocity.x = (balls[balls.length - 1].position.x - mouse.x) / 10;
        balls[balls.length - 1].velocity.y = (balls[balls.length - 1].position.y - mouse.y) / 10;
    }
}

function getMousePosition(e) {
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
}

function loop() {
    //create constants
    var gravity = 0.4;
    var density = 1.22;
    var drag = 1;

    //Clear window at the beginning of every frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < balls.length; i++) {
        if (!mouse.isDown || i != balls.length - 1) {
            //physics - calculating the aerodynamic forces to drag
            // -0.5 * Cd * A * v^2 * rho
            var fx = -0.5 * drag * density * balls[i].area * balls[i].velocity.x * balls[i].velocity.x * (balls[i].velocity.x / Math.abs(balls[i].velocity.x));
            var fy = -0.5 * drag * density * balls[i].area * balls[i].velocity.y * balls[i].velocity.y * (balls[i].velocity.y / Math.abs(balls[i].velocity.y));

            fx = (isNaN(fx) ? 0 : fx);
            fy = (isNaN(fy) ? 0 : fy);

            //Calculating the acceleration of the ball
            //F = ma or a = F/m
            var ax = fx / balls[i].mass;
            var ay = (ag * gravity) + (fy / balls[i].mass);

            //Calculating the ball velocity 
            balls[i].velocity.x += ax * fps;
            balls[i].velocity.y += ay * fps;

            //Calculating the position of the ball
            balls[i].position.x += balls[i].velocity.x * fps * 100;
            balls[i].position.y += balls[i].velocity.y * fps * 100;
        }

        //Rendering the ball
        ctx.beginPath();
        ctx.fillStyle = balls[i].colour;
        ctx.arc(balls[i].position.x, balls[i].position.y, balls[i].radius, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();

        if (mouse.isDown && i == balls.length - 1) {
            ctx.beginPath();
            ctx.strokeStyle = darkenColor(balls[i].colour, 0.7);
            ctx.moveTo(balls[balls.length - 1].position.x, balls[balls.length - 1].position.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            ctx.closePath();
        }
        //Handling the ball collisions
        collisionBall(balls[i]);
        collisionWall(balls[i]);
    }
}

function darkenColor(color, factor) {
    var r = Math.floor(parseInt(color.slice(1, 3), 16) * factor);
    var g = Math.floor(parseInt(color.slice(3, 5), 16) * factor);
    var b = Math.floor(parseInt(color.slice(5, 7), 16) * factor);
    return `rgb(${r},${g},${b})`;
}

function collisionWall(ball) {
    if (ball.position.x > canvas.width - ball.radius) {
        ball.velocity.x *= ball.e;
        ball.position.x = canvas.width - ball.radius;
    }
    if (ball.position.y > canvas.height - ball.radius) {
        ball.velocity.y *= ball.e;
        ball.position.y = canvas.height - ball.radius;
    }
    if (ball.position.x < ball.radius) {
        ball.velocity.x *= ball.e;
        ball.position.x = ball.radius;
    }
    if (ball.position.y < ball.radius) {
        ball.velocity.y *= ball.e;
        ball.position.y = ball.radius;
    }
}

function collisionBall(b1) {
    for (var i = 0; i < balls.length; i++) {
        var b2 = balls[i];
        if (b1.position.x != b2.position.x && b1.position.y != b2.position.y) {
            //quick check for potential collisions using AABBs
            if (b1.position.x + b1.radius + b2.radius > b2.position.x
                && b1.position.x < b2.position.x + b1.radius + b2.radius
                && b1.position.y + b1.radius + b2.radius > b2.position.y
                && b1.position.y < b2.position.y + b1.radius + b2.radius) {

                //pythagoras 
                var distX = b1.position.x - b2.position.x;
                var distY = b1.position.y - b2.position.y;
                var d = Math.sqrt((distX) * (distX) + (distY) * (distY));

                //checking circle vs circle collision 
                if (d < b1.radius + b2.radius) {
                    var nx = (b2.position.x - b1.position.x) / d;
                    var ny = (b2.position.y - b1.position.y) / d;
                    var p = 2 * (b1.velocity.x * nx + b1.velocity.y * ny - b2.velocity.x * nx - b2.velocity.y * ny) / (b1.mass + b2.mass);

                    // calculating the point of collision 
                    var colPointX = ((b1.position.x * b2.radius) + (b2.position.x * b1.radius)) / (b1.radius + b2.radius);
                    var colPointY = ((b1.position.y * b2.radius) + (b2.position.y * b1.radius)) / (b1.radius + b2.radius);

                    //stopping overlap 
                    b1.position.x = colPointX + b1.radius * (b1.position.x - b2.position.x) / d;
                    b1.position.y = colPointY + b1.radius * (b1.position.y - b2.position.y) / d;
                    b2.position.x = colPointX + b2.radius * (b2.position.x - b1.position.x) / d;
                    b2.position.y = colPointY + b2.radius * (b2.position.y - b1.position.y) / d;

                    //updating velocity to reflect collision 
                    b1.velocity.x -= p * b1.mass * nx;
                    b1.velocity.y -= p * b1.mass * ny;
                    b2.velocity.x += p * b2.mass * nx;
                    b2.velocity.y += p * b2.mass * ny;
                }
            }
        }
    }
}

setup();